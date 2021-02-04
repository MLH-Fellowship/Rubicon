/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";const pkg=require("../package.json"),path=require("path"),os=require("os");function getDefaultUserDataPath(){let e=process.env.VSCODE_APPDATA;if(!e)switch(process.platform){case"win32":if(!(e=process.env.APPDATA)){const r=process.env.USERPROFILE;if("string"!=typeof r)throw new Error("Windows: Unexpected undefined %USERPROFILE% environment variable");e=path.join(r,"AppData","Roaming")}break;case"darwin":e=path.join(os.homedir(),"Library","Application Support");break;case"linux":e=process.env.XDG_CONFIG_HOME||path.join(os.homedir(),".config");break;default:throw new Error("Platform not supported")}return path.join(e,pkg.name)}exports.getDefaultUserDataPath=getDefaultUserDataPath;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/ea3859d4ba2f3e577a159bc91e3074c5d85c0523/core/paths.js.map
