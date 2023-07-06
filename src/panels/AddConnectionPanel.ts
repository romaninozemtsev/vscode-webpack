import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getUri } from "../utilities/getUri";
import { getNonce } from "../utilities/getNonce";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class AddConnectionPanel {
  public static currentPanel: AddConnectionPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];
  private _onConnectionAdded: any;

  /**
   * The AddConnectionPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri, onConnectionAdded: any) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);

    this._onConnectionAdded = onConnectionAdded;
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri, onConnectionAdded: any) {
    if (AddConnectionPanel.currentPanel) {
      // If the webview panel already exists reveal it
      AddConnectionPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showHelloWorld",
        // Panel title
        "Hello World",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          // Restrict the webview to only load resources from the `out` directory
          localResourceRoots: [
            Uri.joinPath(extensionUri, "dist"),
            Uri.joinPath(extensionUri, "media", "css")
          ],
        }
      );

      AddConnectionPanel.currentPanel = new AddConnectionPanel(panel, extensionUri, onConnectionAdded);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    AddConnectionPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) associated with the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where *references* to CSS and JavaScript files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const webviewUri = getUri(webview, extensionUri, ["dist", "add-connection.js"]);
    const styleUri = getUri(webview, extensionUri, ["media", "css", "add-connection.css"]);
    const nonce = getNonce();

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
					<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}'; style-src vscode-resource: 'self' 'unsafe-inline';">
          <link href="${styleUri}" rel="stylesheet" />
          <title>Add Connection</title>
        </head>
        <body>
          <h1>Add MySQL Connection</h1>
          <form id="add-connection-form" class="flex-col">
            <vscode-text-field id="name">Name</vscode-text-field>
            <div class="flex-row">
              <vscode-text-field value="localhost" id="host">Host</vscode-text-field>
              <vscode-text-field value="3306" id="port">Port</vscode-text-field>
            </div>
            <vscode-text-field id="database">Database</vscode-text-field>
            <vscode-text-field value="root" id="user">User</vscode-text-field>
            <vscode-text-field id="password" name="password">Password</vscode-text-field>
            <vscode-button id="addBtn">Add</vscode-button>
          </form>
					<script type="module" nonce="${nonce}" src="${webviewUri}"></script>
        </body>
      </html>
    `;
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const data = message.data;

        switch (command) {
          case "addConnectionSubmit":
            // Code that should run in response to the hello message command
            window.showInformationMessage("Connection added");
            console.log(data);
            this._onConnectionAdded(data);
            return;
          // Add more switch case statements here as more webview message commands
          // are created within the webview context (i.e. inside src/webview/main.ts)
        }
      },
      undefined,
      this._disposables
    );
  }
}