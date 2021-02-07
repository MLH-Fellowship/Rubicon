import * as _vscode from "vscode";

declare global {
    const tsvscode:{
        postMessage: ({command: string, value: any}) => void;
    };
}