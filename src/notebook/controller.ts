import * as vscode from 'vscode';
import { establishConnection } from '../db-conn';
import { exec } from 'child_process';

export class SampleKernel {
	private readonly _supportedLanguages = ['sql'];

	private _executionOrder = 0;
	private readonly _controller: vscode.NotebookController;

	constructor(
		private readonly id: string = 'sql-serializer-kernel',
		private readonly label: string = 'Sample Notebook Kernel') {

		this._controller = vscode.notebooks.createNotebookController(this.id,
			'sql-notebook',
			this.label);

		this._controller.supportedLanguages = this._supportedLanguages;
		this._controller.supportsExecutionOrder = true;
		this._controller.executeHandler = this._executeAll.bind(this);
	}

	dispose(): void {
		this._controller.dispose();
	}

	private _executeAll(cells: vscode.NotebookCell[], _notebook: vscode.NotebookDocument, _controller: vscode.NotebookController): void {
		for (const cell of cells) {
			this._doExecution(cell);
		}
	}

	private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
		const execution = this._controller.createNotebookCellExecution(cell);

		execution.executionOrder = ++this._executionOrder;
		execution.start(Date.now());

		const connection = await establishConnection();

		await connection.query('USE information_schema');
		const query = cell.document.getText();
        const [rows] = await connection.query(query);
		try {

			if (Array.isArray(rows)) {
				vscode.NotebookCellOutputItem.json(rows);

				execution.replaceOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.json(rows, 'vscode-webpack.sql-notebook/table')
				])]);
			}

			// execution.replaceOutput([new vscode.NotebookCellOutput([
			// 	vscode.NotebookCellOutputItem.json(JSON.parse(cell.document.getText()))
			// ])]);

			execution.end(true, Date.now());
		} catch (err) {
			execution.replaceOutput([new vscode.NotebookCellOutput([
				vscode.NotebookCellOutputItem.error(err as Error)
			])]);
			execution.end(false, Date.now());
		}
	}
}
