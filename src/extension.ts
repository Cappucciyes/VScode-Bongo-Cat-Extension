// how to debug webview: https://dzhavat.github.io/2020/11/12/easy-way-to-debug-a-webview-in-a-vscode-extension.html

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let panel: vscode.WebviewPanel | undefined = undefined;

	const newComand = vscode.commands.registerCommand("typingcat.startBongoCat", () => {
		vscode.window.showInformationMessage('Congratulations, your extension "typingcat" is now active!')

		if (panel) {
			panel.reveal(vscode.ViewColumn.Beside)
		}
		else {
			panel = vscode.window.createWebviewPanel(
				'catCoding', // Identifies the type of the webview. Used internally
				'Bongo Cat', // Title of the panel displayed to the user
				vscode.ViewColumn.Beside, // Editor column to show the new webview panel in.
				{ // Webview options
					// Enable scripts in the webview
					enableScripts: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src', 'webViewContent'), vscode.Uri.joinPath(context.extensionUri, 'dist')]
				}
			);

		}
		// Webviews run in isolated contexts that cannot directly access local resources.
		// to load any content from the user's current workspace, 
		// you must use the Webview.asWebviewUri function to convert a local file: URI into a special URI that VS Code can use to load a subset of local resources.
		// And special URI to use when rendering local file into the webview
		const webViewJS = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'dist', 'webViewContent.js'));
		const webViewCSS = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'webViewContent', 'main.css'));
		const webViewSpriteUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'webViewContent', 'static', 'sprite.png'))


		const catState = [
			'default',
			'typing',
			'tab',
			'backSpace',
		];

		panel.webview.html = getWebviewContent(webViewSpriteUri, webViewJS, webViewCSS, panel.webview.cspSource);

		let bongoCatReset = () => {
			if (panel) {
				panel.webview.postMessage({ action: catState[0] })
				resetter = undefined;
			}
		}

		// get user setting
		let configTabSize = vscode.workspace.getConfiguration().get('editor.tabSize') as number
		// tab according to user setting 
		let tab: String = ''
		for (let i = 0; i < configTabSize; i++) {
			tab += ' '
		}

		let resetter: NodeJS.Timeout | undefined
		let keyListener = vscode.workspace.onDidChangeTextDocument((textDoucmentChangeEvent) => {
			if (panel && (tab === textDoucmentChangeEvent.contentChanges[0].text) && tab.length > 1) {
				panel.webview.postMessage({ action: catState[2], changes: textDoucmentChangeEvent.contentChanges[0].text })
				if (resetter)
					clearTimeout(resetter);
				resetter = setTimeout(bongoCatReset, 125)

				console.log(textDoucmentChangeEvent.contentChanges)
			}
			else if (panel && textDoucmentChangeEvent.contentChanges[0].rangeLength > 0 && textDoucmentChangeEvent.contentChanges[0].text === '') {
				panel.webview.postMessage({ action: catState[3], changes: textDoucmentChangeEvent.contentChanges[0].text })
				if (resetter)
					clearTimeout(resetter);
				resetter = setTimeout(bongoCatReset, 125)

				console.log(textDoucmentChangeEvent.contentChanges)
			}
			else if (panel) {
				panel.webview.postMessage({ action: catState[1], changes: textDoucmentChangeEvent.contentChanges[0].text })
				if (resetter)
					clearTimeout(resetter);
				resetter = setTimeout(bongoCatReset, 125)

				console.log(textDoucmentChangeEvent.contentChanges)
			}
		})

		// when panel is closed (or distroyed)
		panel.onDidDispose(
			() => {
				// code to run when the panel is closed
				// getting rid of listeners that might try to "modify" closed window 
				keyListener.dispose()
				if (resetter)
					clearTimeout(resetter);
			},
			null,
			context.subscriptions
		);
	})


	// The subscription ensures that your command is properly de-registered when your extension is unloaded.
	// make sure all disposable object that an extension makes goes into subscription.
	context.subscriptions.push(newComand);
}

// This method is called when your extension is deactivated
export function deactivate() { }

function getWebviewContent(spriteUri: vscode.Uri, jsUri: vscode.Uri, cssUri: vscode.Uri, cspSource: string) {
	let webviewContent = `
<!DOCTYPE html>
<html>
<head>
	<meta
	http-equiv="Content-Security-Policy"
	content="default-src 'none'; img-src ${cspSource} https:; script-src ${cspSource}; style-src ${cspSource};"
	/>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" href="${cssUri}"> 
</head>
<body>
    <canvas id='mainCanvas'>Failed to load Canvas</canvas>
    <img id="sprite" src="${spriteUri}" alt="faild to load image">
</body>
<script src="${jsUri}"></script>
</html>`


	console.log(webviewContent)

	return webviewContent
}