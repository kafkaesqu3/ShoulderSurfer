/*
 * Copyright 2010-2020 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of SingleFile.
 *
 *   The code in this file is free software: you can redistribute it and/or 
 *   modify it under the terms of the GNU Affero General Public License 
 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
 *   of the License, or (at your option) any later version.
 * 
 *   The code in this file is distributed in the hope that it will be useful, 
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
 *   General Public License for more details.
 *
 *   As additional permission under GNU AGPL version 3 section 7, you may 
 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
 *   AGPL normally required by section 4, provided you include this license 
 *   notice and a URL through which recipients can access the Corresponding 
 *   Source.
 */

/* global globalThis */

import * as cssTree from "./../vendor/css-tree.js";
import {
	normalizeFontFamily,
	getFontWeight
} from "./../single-file-helper.js";

const helper = {
	normalizeFontFamily,
	getFontWeight
};

const FontFace = globalThis.FontFace;

const REGEXP_URL_SIMPLE_QUOTES_FN = /url\s*\(\s*'(.*?)'\s*\)/i;
const REGEXP_URL_DOUBLE_QUOTES_FN = /url\s*\(\s*"(.*?)"\s*\)/i;
const REGEXP_URL_NO_QUOTES_FN = /url\s*\(\s*(.*?)\s*\)/i;
const REGEXP_URL_FUNCTION = /(url|local|-sf-url-original)\(.*?\)\s*(,|$)/g;
const REGEXP_SIMPLE_QUOTES_STRING = /^'(.*?)'$/;
const REGEXP_DOUBLE_QUOTES_STRING = /^"(.*?)"$/;
const REGEXP_URL_FUNCTION_WOFF = /^url\(\s*["']?data:font\/(woff2?)/;
const REGEXP_URL_FUNCTION_WOFF_ALT = /^url\(\s*["']?data:application\/x-font-(woff)/;
const REGEXP_FONT_FORMAT = /\.([^.?#]+)((\?|#).*?)?$/;
const REGEXP_FONT_FORMAT_VALUE = /format\((.*?)\)\s*,?$/;
const REGEXP_FONT_SRC = /(.*?)\s*,?$/;
const EMPTY_URL_SOURCE = /^url\(["']?data:[^,]*,?["']?\)/;
const LOCAL_SOURCE = "local(";
const MEDIA_ALL = "all";
const FONT_STRETCHES = {
	"ultra-condensed": "50%",
	"extra-condensed": "62.5%",
	"condensed": "75%",
	"semi-condensed": "87.5%",
	"normal": "100%",
	"semi-expanded": "112.5%",
	"expanded": "125%",
	"extra-expanded": "150%",
	"ultra-expanded": "200%"
};
const FONT_MAX_LOAD_DELAY = 5000;

export {
	process
};

async function process(doc, stylesheets, fontURLs, fontTests) {
	const fontsDetails = {
		fonts: new Map(),
		medias: new Map(),
		supports: new Map()
	};
	const stats = { rules: { processed: 0, discarded: 0 }, fonts: { processed: 0, discarded: 0 } };
	let sheetIndex = 0;
	stylesheets.forEach(stylesheetInfo => {
		const cssRules = stylesheetInfo.stylesheet.children;
		if (cssRules) {
			stats.rules.processed += cssRules.getSize();
			stats.rules.discarded += cssRules.getSize();
			if (stylesheetInfo.mediaText && stylesheetInfo.mediaText != MEDIA_ALL) {
				const mediaFontsDetails = createFontsDetailsInfo();
				fontsDetails.medias.set("media-" + sheetIndex + "-" + stylesheetInfo.mediaText, mediaFontsDetails);
				getFontsDetails(doc, cssRules, sheetIndex, mediaFontsDetails);
			} else {
				getFontsDetails(doc, cssRules, sheetIndex, fontsDetails);
			}
		}
		sheetIndex++;
	});
	processFontDetails(fontsDetails);
	await Promise.all([...stylesheets].map(async ([, stylesheetInfo], sheetIndex) => {
		const cssRules = stylesheetInfo.stylesheet.children;
		const media = stylesheetInfo.mediaText;
		if (cssRules) {
			if (media && media != MEDIA_ALL) {
				await processFontFaceRules(cssRules, sheetIndex, fontsDetails.medias.get("media-" + sheetIndex + "-" + media), fontURLs, fontTests, stats);
			} else {
				await processFontFaceRules(cssRules, sheetIndex, fontsDetails, fontURLs, fontTests, stats);
			}
			stats.rules.discarded -= cssRules.getSize();
		}
	}));
	return stats;
}

function getFontsDetails(doc, cssRules, sheetIndex, mediaFontsDetails) {
	let mediaIndex = 0, supportsIndex = 0;
	cssRules.forEach(ruleData => {
		if (ruleData.type == "Atrule" && ruleData.name == "media" && ruleData.block && ruleData.block.children && ruleData.prelude) {
			const mediaText = cssTree.generate(ruleData.prelude);
			const fontsDetails = createFontsDetailsInfo();
			mediaFontsDetails.medias.set("media-" + sheetIndex + "-" + mediaIndex + "-" + mediaText, fontsDetails);
			mediaIndex++;
			getFontsDetails(doc, ruleData.block.children, sheetIndex, fontsDetails);
		} else if (ruleData.type == "Atrule" && ruleData.name == "supports" && ruleData.block && ruleData.block.children && ruleData.prelude) {
			const supportsText = cssTree.generate(ruleData.prelude);
			const fontsDetails = createFontsDetailsInfo();
			mediaFontsDetails.supports.set("supports-" + sheetIndex + "-" + supportsIndex + "-" + supportsText, fontsDetails);
			supportsIndex++;
			getFontsDetails(doc, ruleData.block.children, sheetIndex, fontsDetails);
		} else if (ruleData.type == "Atrule" && ruleData.name == "font-face" && ruleData.block && ruleData.block.children) {
			const fontKey = getFontKey(ruleData);
			let fontInfo = mediaFontsDetails.fonts.get(fontKey);
			if (!fontInfo) {
				fontInfo = [];
				mediaFontsDetails.fonts.set(fontKey, fontInfo);
			}
			const src = getPropertyValue(ruleData, "src");
			if (src) {
				const fontSources = src.match(REGEXP_URL_FUNCTION);
				if (fontSources) {
					fontSources.forEach(source => fontInfo.unshift(source));
				}
			}
		}
	});
}

function processFontDetails(fontsDetails) {
	fontsDetails.fonts.forEach((fontInfo, fontKey) => {
		fontsDetails.fonts.set(fontKey, fontInfo.map(fontSource => {
			const fontFormatMatch = fontSource.match(REGEXP_FONT_FORMAT_VALUE);
			let fontFormat;
			const urlMatch = fontSource.match(REGEXP_URL_SIMPLE_QUOTES_FN) ||
				fontSource.match(REGEXP_URL_DOUBLE_QUOTES_FN) ||
				fontSource.match(REGEXP_URL_NO_QUOTES_FN);
			const fontUrl = urlMatch && urlMatch[1];
			if (fontFormatMatch && fontFormatMatch[1]) {
				fontFormat = fontFormatMatch[1].replace(REGEXP_SIMPLE_QUOTES_STRING, "$1").replace(REGEXP_DOUBLE_QUOTES_STRING, "$1").toLowerCase();
			}
			if (!fontFormat) {
				const fontFormatMatch = fontSource.match(REGEXP_URL_FUNCTION_WOFF);
				if (fontFormatMatch && fontFormatMatch[1]) {
					fontFormat = fontFormatMatch[1];
				} else {
					const fontFormatMatch = fontSource.match(REGEXP_URL_FUNCTION_WOFF_ALT);
					if (fontFormatMatch && fontFormatMatch[1]) {
						fontFormat = fontFormatMatch[1];
					}
				}
			}
			if (!fontFormat && fontUrl) {
				const fontFormatMatch = fontUrl.match(REGEXP_FONT_FORMAT);
				if (fontFormatMatch && fontFormatMatch[1]) {
					fontFormat = fontFormatMatch[1];
				}
			}
			return { src: fontSource.match(REGEXP_FONT_SRC)[1], fontUrl, format: fontFormat };
		}));
	});
	fontsDetails.medias.forEach(mediaFontsDetails => processFontDetails(mediaFontsDetails));
	fontsDetails.supports.forEach(supportsFontsDetails => processFontDetails(supportsFontsDetails));
}

async function processFontFaceRules(cssRules, sheetIndex, fontsDetails, fontURLs, fontTests, stats) {
	const removedRules = [];
	let mediaIndex = 0, supportsIndex = 0;
	for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
		const ruleData = cssRule.data;
		if (ruleData.type == "Atrule" && ruleData.name == "media" && ruleData.block && ruleData.block.children && ruleData.prelude) {
			const mediaText = cssTree.generate(ruleData.prelude);
			await processFontFaceRules(ruleData.block.children, sheetIndex, fontsDetails.medias.get("media-" + sheetIndex + "-" + mediaIndex + "-" + mediaText), fontURLs, fontTests, stats);
			mediaIndex++;
		} else if (ruleData.type == "Atrule" && ruleData.name == "supports" && ruleData.block && ruleData.block.children && ruleData.prelude) {
			const supportsText = cssTree.generate(ruleData.prelude);
			await processFontFaceRules(ruleData.block.children, sheetIndex, fontsDetails.supports.get("supports-" + sheetIndex + "-" + supportsIndex + "-" + supportsText), fontURLs, fontTests, stats);
			supportsIndex++;
		} else if (ruleData.type == "Atrule" && ruleData.name == "font-face") {
			const key = getFontKey(ruleData);
			const fontInfo = fontsDetails.fonts.get(key);
			if (fontInfo) {
				const processed = await processFontFaceRule(ruleData, fontInfo, fontURLs, fontTests, stats);
				if (processed) {
					fontsDetails.fonts.delete(key);
				}
			} else {
				removedRules.push(cssRule);
			}
		}
	}
	removedRules.forEach(cssRule => cssRules.remove(cssRule));
}

async function processFontFaceRule(ruleData, fontInfo, fontURLs, fontTests, stats) {
	const removedNodes = [];
	for (let node = ruleData.block.children.head; node; node = node.next) {
		if (node.data.property == "src") {
			removedNodes.push(node);
		}
	}
	removedNodes.pop();
	removedNodes.forEach(node => ruleData.block.children.remove(node));
	const srcDeclaration = ruleData.block.children.filter(node => node.property == "src").tail;
	if (srcDeclaration) {
		await Promise.all(fontInfo.map(async (source, sourceIndex) => {
			if (fontTests.has(source.src)) {
				source.valid = fontTests.get(source.src);
			} else {
				if (FontFace) {
					const fontFace = new FontFace("test-font", source.src);
					try {
						let timeout;
						await Promise.race([
							fontFace.load().then(() => fontFace.loaded).then(() => { source.valid = true; globalThis.clearTimeout(timeout); }),
							new Promise(resolve => timeout = globalThis.setTimeout(() => { source.valid = true; resolve(); }, FONT_MAX_LOAD_DELAY))
						]);
					} catch (error) {
						const declarationFontURLs = fontURLs.get(srcDeclaration.data);
						if (declarationFontURLs) {
							const fontURL = declarationFontURLs[declarationFontURLs.length - sourceIndex - 1];
							if (fontURL) {
								const fontFace = new FontFace("test-font", "url(" + fontURL + ")");
								try {
									let timeout;
									await Promise.race([
										fontFace.load().then(() => fontFace.loaded).then(() => { source.valid = true; globalThis.clearTimeout(timeout); }),
										new Promise(resolve => timeout = globalThis.setTimeout(() => { source.valid = true; resolve(); }, FONT_MAX_LOAD_DELAY))
									]);
								} catch (error) {
									// ignored
								}
							}
						} else {
							source.valid = true;
						}
					}
				} else {
					source.valid = true;
				}
				fontTests.set(source.src, source.valid);
			}
		}));
		const findSource = (fontFormat, testValidity) => fontInfo.find(source => !source.src.match(EMPTY_URL_SOURCE) && source.format == fontFormat && (!testValidity || source.valid));
		const filterSource = fontSource => fontInfo.filter(source => source == fontSource || source.src.startsWith(LOCAL_SOURCE));
		stats.fonts.processed += fontInfo.length;
		stats.fonts.discarded += fontInfo.length;
		const woffFontFound = findSource("woff2-variations", true) || findSource("woff2", true) || findSource("woff", true);
		if (woffFontFound) {
			fontInfo = filterSource(woffFontFound);
		} else {
			const ttfFontFound = findSource("truetype-variations", true) || findSource("truetype", true);
			if (ttfFontFound) {
				fontInfo = filterSource(ttfFontFound);
			} else {
				const otfFontFound = findSource("opentype") || findSource("embedded-opentype");
				if (otfFontFound) {
					fontInfo = filterSource(otfFontFound);
				} else {
					fontInfo = fontInfo.filter(source => !source.src.match(EMPTY_URL_SOURCE) && (source.valid) || source.src.startsWith(LOCAL_SOURCE));
				}
			}
		}
		stats.fonts.discarded -= fontInfo.length;
		fontInfo.reverse();
		try {
			srcDeclaration.data.value = cssTree.parse(fontInfo.map(fontSource => fontSource.src).join(","), { context: "value" });
		}
		catch (error) {
			// ignored
		}
		return true;
	} else {
		return false;
	}
}

function getPropertyValue(ruleData, propertyName) {
	let property;
	if (ruleData.block.children) {
		property = ruleData.block.children.filter(node => {
			try {
				return node.property == propertyName && !cssTree.generate(node.value).match(/\\9$/);
			} catch (error) {
				return node.property == propertyName;
			}
		}).tail;
	}
	if (property) {
		try {
			return cssTree.generate(property.data.value);
		} catch (error) {
			// ignored
		}
	}
}

function getFontKey(ruleData) {
	return JSON.stringify([
		helper.normalizeFontFamily(getPropertyValue(ruleData, "font-family")),
		helper.getFontWeight(getPropertyValue(ruleData, "font-weight") || "400"),
		getPropertyValue(ruleData, "font-style") || "normal",
		getPropertyValue(ruleData, "unicode-range"),
		getFontStretch(getPropertyValue(ruleData, "font-stretch")),
		getPropertyValue(ruleData, "font-variant") || "normal",
		getPropertyValue(ruleData, "font-feature-settings"),
		getPropertyValue(ruleData, "font-variation-settings")
	]);
}

function getFontStretch(stretch) {
	return FONT_STRETCHES[stretch] || stretch;
}

function createFontsDetailsInfo() {
	return {
		fonts: new Map(),
		medias: new Map(),
		supports: new Map()
	};
}