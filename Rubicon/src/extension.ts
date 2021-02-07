import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';


export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
	item.text = '$(file-code) Add Documentation';
	item.command = 'rubicon.addDoc';
	item.show();
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("rubicon-sidebar", sidebarProvider)
	  );
	context.subscriptions.push(
		vscode.commands.registerCommand('rubicon.addDoc', () => {
			const {activeTextEditor}=vscode.window;

			if(!activeTextEditor){
				vscode.window.showInformationMessage("No active text editor");
				return; 
			}
			const text = activeTextEditor.document.getText(activeTextEditor.selection);
			// function to send a message
			sidebarProvider._view?.webview.postMessage({
				type:"new-doc",
				value: text,
			});
		})
		
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('rubicon.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		HelloWorldPanel.createOrShow(context.extensionUri);
	})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('rubicon.refresh', () => {
		HelloWorldPanel.kill();
		HelloWorldPanel.createOrShow(context.extensionUri);
		setTimeout(() => {
		vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools"
			);
		},500);
		})
	);
	context.subscriptions.push(
		vscode.commands.registerCommand('rubicon.askQuestion', async () => {
			const answer = await vscode.window.showInformationMessage(
				"How was your day?", 
				"good", 
				"bad"
			);

			if (answer ==='bad'){
				vscode.window.showInformationMessage("sorry to hear that");
			}else{
				console.log({answer});
			}
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
