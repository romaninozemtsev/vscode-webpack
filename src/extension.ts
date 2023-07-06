// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SampleKernel } from './notebook/controller';
import { DatabaseProvider } from './tree-view';
import { establishConnection } from './db-conn';
import { SampleContentSerializer } from './notebook/serializer';
import { AddConnectionPanel } from "./panels/AddConnectionPanel";
import { ConnectionConfiguration } from './models/ConnectionConfiguration';
import { getDbConfigs, getSettings } from './utilities/dbSettings';


const NOTEBOOK_TYPE = 'sql-notebook';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	//const connection = await establishConnection();

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-webpack" is now active!');

	async function onConnectionAdded(connection: any) {
		console.log('connection added', connection);
		// save to "vscode-webpack.connections" setting
		const settings = getSettings();
		const currentConfigurations = getDbConfigs(settings);
		settings.update("connections", [...currentConfigurations, connection], vscode.ConfigurationTarget.Global);
		console.log('currentConfigurations', currentConfigurations);
		setTimeout(() => {
			treeDataProvider.refresh();
		}, 250);
	}


	context.subscriptions.push(vscode.commands.registerCommand('vscode-sql.addConnection', () => {
		AddConnectionPanel.render(context.extensionUri, onConnectionAdded);
	}));

	// create tree view with DatabaseProvider as data provider

	let treeDataProvider = new DatabaseProvider();
	let treeView =  vscode.window.createTreeView('databaseExplorer', {
		treeDataProvider: treeDataProvider
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

	context.subscriptions.push(vscode.commands.registerCommand('vscode-sql.refresh', () => {
		treeDataProvider.refresh();
	}));
	


	context.subscriptions.push(
		vscode.workspace.registerNotebookSerializer(
			NOTEBOOK_TYPE, new SampleContentSerializer(), { transientOutputs: true }
		),
		new SampleKernel()
	);

}


// This method is called when your extension is deactivated
export function deactivate() {}
