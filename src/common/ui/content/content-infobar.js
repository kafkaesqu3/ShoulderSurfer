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

/* global globalThis, singlefile, fetch */

const SCRIPT_PATH = "/lib/web/infobar-web.js";

const browser = globalThis.browser;

export {
	includeScript
};

async function includeScript(pageData) {
	let infobarContent;
	if (browser && browser.runtime && browser.runtime.getURL) {
		infobarContent = await (await fetch(browser.runtime.getURL(SCRIPT_PATH))).text();
	} else if (singlefile.getFileContent) {
		infobarContent = singlefile.getFileContent(SCRIPT_PATH);
	}
	let lastInfobarContent;
	while (lastInfobarContent != infobarContent) {
		lastInfobarContent = infobarContent;
		infobarContent = infobarContent.replace(/\/\*(.|\n)*?\*\//, "");
	}
	infobarContent = infobarContent.replace(/\t+/g, " ").replace(/\nthis\.[^(]*/gi, "\n").replace(/\n+/g, "");
	pageData.content += "<script>document.currentScript.remove();" + infobarContent + "</script>";
}