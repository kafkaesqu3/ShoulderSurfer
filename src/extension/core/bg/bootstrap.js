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

import * as config from "./config.js";
import { autoSaveIsEnabled } from "./autosave-util.js";

export {
	onMessage
};

async function onMessage(message, sender) {
	if (message.method.endsWith(".init")) {
		const [optionsAutoSave, options, autoSaveEnabled] = await Promise.all([config.getOptions(sender.tab.url, true), config.getOptions(sender.tab.url), autoSaveIsEnabled(sender.tab)]);
		return { optionsAutoSave, options, autoSaveEnabled, tabId: sender.tab.id, tabIndex: sender.tab.index };
	}
}