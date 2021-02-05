
import * as vscode from 'vscode';
import { HelloWorldPanel } from './HelloWorldPanel';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "rubicon" is now active!');

	context.subscriptions.push(
		vscode.commands.registerCommand('rubicon.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		HelloWorldPanel.createOrShow(context.extensionUri);
	})
	);
	
	context.subscriptions.push(
		vscode.commands.registerCommand('rubicon.askQuestion', async () => {
			const answer = await vscode.window.showInformationMessage(
				"How was you day?", 
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
