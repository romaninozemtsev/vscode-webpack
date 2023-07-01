// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SampleKernel } from './notebook/controller';
import { DatabaseProvider } from './tree-view';
import { establishConnection } from './db-conn';
import { SampleContentSerializer } from './notebook/serializer';

const cats = {
	'Coding Cat': 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
	'Compiling Cat': 'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif'
};

const NOTEBOOK_TYPE = 'sql-notebook';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	const connection = await establishConnection();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-webpack" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let webviewDisposable = vscode.commands.registerCommand('vscode-webpack.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const panel = vscode.window.createWebviewPanel(
			'catCoding',
			'Cat Coding',
			vscode.ViewColumn.One,
			{
			  // Enable scripts in the webview
			  enableScripts: true,
			  localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "dist")],
			}
		  );

		  let scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "dist", "webview.js"));
		
	
		  let iteration = 0;
		  const updateWebview = () => {
			const cat = iteration++ % 2 ? 'Compiling Cat' : 'Coding Cat';
			panel.title = cat;
			panel.webview.html = getWebviewContent(cat, scriptUri);
		  };
	
		  // Set initial content
		  updateWebview();
	
		  // And schedule updates to the content every second
		  const interval = setInterval(updateWebview, 1000);

			panel.onDidDispose(
				() => {
				// When the panel is closed, cancel any future updates to the webview content
				clearInterval(interval);
				},
				null,
				context.subscriptions
			);

			panel.webview.onDidReceiveMessage(
				message => {
				  switch (message.command) {
					case 'alert':
					  vscode.window.showErrorMessage(message.text);
					  return;
				  }
				},
				undefined,
				context.subscriptions
			  );
	});

	context.subscriptions.push(webviewDisposable);



	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-sql" is now active!');


	let addConnectionCommand =  vscode.commands.registerCommand('vscode-sql.addConnection', () => {
		vscode.window.showInformationMessage('add connection');
	});
	context.subscriptions.push(addConnectionCommand);

	// create tree view with DatabaseProvider as data provider

	let treeView =  vscode.window.createTreeView('databaseExplorer', {
		treeDataProvider: new DatabaseProvider(connection)
	});

	context.subscriptions.push(vscode.commands.registerCommand('vscode-sql.createSqlNotebook', async () => {
		const language = 'sql';
		const defaultValue = `select * from users`;
		const cell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, defaultValue, language);
		const data = new vscode.NotebookData([cell]);
		data.metadata = {
			custom: {
				cells: [],
				metadata: {
					orig_nbformat: 4
				},
				nbformat: 4,
				nbformat_minor: 2
			}
		};
		const doc = await vscode.workspace.openNotebookDocument(NOTEBOOK_TYPE, data);
		await vscode.window.showNotebookDocument(doc);
		//treeView.reveal();
	}));


	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer(
			NOTEBOOK_TYPE, new SampleContentSerializer(), { transientOutputs: true }
		),
		new SampleKernel()
	);

}

function getWebviewContent(cat: keyof typeof cats, webviewUri: vscode.Uri) {
	return `<!DOCTYPE html>
  <html lang="en">
  <head>
	  <meta charset="UTF-8">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>Cat Coding</title>
  </head>
  <body>
  
  	<img src="${cats[cat]}" width="300" />
	  <vscode-button id="howdy">Howdy!</vscode-button>
	  <script type="module" src="${webviewUri}"></script>
  </body>
  </html>`;
  }

// This method is called when your extension is deactivated
export function deactivate() {}
