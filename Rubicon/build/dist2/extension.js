module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const HelloWorldPanel_1 = __webpack_require__(2);
function activate(context) {
    console.log('Congratulations, your extension "rubicon" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('rubicon.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        HelloWorldPanel_1.HelloWorldPanel.createOrShow(context.extensionUri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('rubicon.askQuestion', () => __awaiter(this, void 0, void 0, function* () {
        const answer = yield vscode.window.showInformationMessage("How was your day?", "good", "bad");
        if (answer === 'bad') {
            vscode.window.showInformationMessage("sorry to hear that");
        }
        else {
            console.log({ answer });
        }
    })));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");;

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HelloWorldPanel = void 0;
const vscode = __webpack_require__(1);
const getNonce_1 = __webpack_require__(3);
class HelloWorldPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // // Handle messages from the webview
        // this._panel.webview.onDidReceiveMessage(
        //   (message) => {
        //     switch (message.command) {
        //       case "alert":
        //         vscode.window.showErrorMessage(message.text);
        //         return;
        //     }
        //   },
        //   null,
        //   this._disposables
        // );
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (HelloWorldPanel.currentPanel) {
            HelloWorldPanel.currentPanel._panel.reveal(column);
            HelloWorldPanel.currentPanel._update();
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(HelloWorldPanel.viewType, "Rubicon", column || vscode.ViewColumn.One, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [
                vscode.Uri.joinPath(extensionUri, "media"),
                vscode.Uri.joinPath(extensionUri, "out/compiled"),
            ],
        });
        HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
    static kill() {
        var _a;
        (_a = HelloWorldPanel.currentPanel) === null || _a === void 0 ? void 0 : _a.dispose();
        HelloWorldPanel.currentPanel = undefined;
    }
    static revive(panel, extensionUri) {
        HelloWorldPanel.currentPanel = new HelloWorldPanel(panel, extensionUri);
    }
    dispose() {
        HelloWorldPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        return __awaiter(this, void 0, void 0, function* () {
            const webview = this._panel.webview;
            this._panel.webview.html = this._getHtmlForWebview(webview);
            webview.onDidReceiveMessage((data) => __awaiter(this, void 0, void 0, function* () {
                switch (data.type) {
                    case "onInfo": {
                        if (!data.value) {
                            return;
                        }
                        vscode.window.showInformationMessage(data.value);
                        break;
                    }
                    case "onError": {
                        if (!data.value) {
                            return;
                        }
                        vscode.window.showErrorMessage(data.value);
                        break;
                    }
                    // case "tokens": {
                    //   await Util.globalState.update(accessTokenKey, data.accessToken);
                    //   await Util.globalState.update(refreshTokenKey, data.refreshToken);
                    //   break;
                    // }
                }
            }));
        });
    }
    _getHtmlForWebview(webview) {
        // // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out/compiled", "HelloWorld.js"));
        // Local path to css styles
        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "reset.css"));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css"));
        // const cssUri = webview.asWebviewUri(
        //   vscode.Uri.joinPath(this._extensionUri, "out", "compiled/swiper.css")
        // );
        // // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce_1.getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content=" img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
        <script nonce="${nonce}"> 
        </script>
			</head>
        <body> 
        
        <script src="${scriptUri}" nonce="${nonce}">
        </body>
			</html>`;
    }
}
exports.HelloWorldPanel = HelloWorldPanel;
HelloWorldPanel.viewType = "hello-world";


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getNonce = void 0;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
exports.getNonce = getNonce;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })()
;
//# sourceMappingURL=extension.js.map