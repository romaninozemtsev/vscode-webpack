import * as vscode from 'vscode';
import { establishConnection } from '../db-conn';

export class SampleKernel {
	private readonly _id = 'sql-serializer-kernel';
	private readonly _label = 'Sample Notebook Kernel';
	private readonly _supportedLanguages = ['sql'];

	private _executionOrder = 0;
	private readonly _controller: vscode.NotebookController;

	constructor() {

		this._controller = vscode.notebooks.createNotebookController(this._id,
			'sql-notebook',
			this._label);

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
        const [rows] = await connection.query('select TABLE_NAME, TABLE_ROWS,TABLE_COMMENT from information_schema.tables where TABLE_SCHEMA = ?', ['information_schema']);
		try {

			if (Array.isArray(rows)) {
				vscode.NotebookCellOutputItem.json(rows);

				execution.replaceOutput([new vscode.NotebookCellOutput([
					vscode.NotebookCellOutputItem.json(rows)
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
