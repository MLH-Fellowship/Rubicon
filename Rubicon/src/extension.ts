import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';
import { SidebarProvider } from './SidebarProvider';


export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider("rubicon-sidebar", sidebarProvider)
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
