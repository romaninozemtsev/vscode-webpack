import { provideVSCodeDesignSystem, vsCodeButton, vsCodeTextField, Button, TextField } from "@vscode/webview-ui-toolkit";

// In order to use the Webview UI Toolkit web components they
// must be registered with the browser (i.e. webview) using the
// syntax below.
//
// To register more toolkit components, simply import the component
// registration function and call it from within the register
// function, like so:
//
// provideVSCodeDesignSystem().register(
//   vsCodeButton(),
//   vsCodeCheckbox()
// );
// 
// Finally, if you would like to register all of the toolkit
// components at once, there's a handy convenience function:
//
// provideVSCodeDesignSystem().register(allComponents);
//
provideVSCodeDesignSystem().register(vsCodeButton(), vsCodeTextField());

// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi();

// Just like a regular webpage we need to wait for the webview
// DOM to load before we can reference any of the HTML elements
// or toolkit components
window.addEventListener("load", main);

// Main function that gets executed once the webview DOM loads
function main() {
  // To get improved type annotations/IntelliSense the associated class for
  // a given toolkit component can be imported and used to type cast a reference
  // to the element (i.e. the `as Button` syntax)
  const howdyButton = document.getElementById("addBtn") as Button;
  howdyButton?.addEventListener("click", addConnectionClick);
}

// Callback function that is executed when the howdy button is clicked
function addConnectionClick() {
  const hostInput = document.getElementById("host") as TextField;
  const portInput = document.getElementById("port") as TextField;
  const userInput = document.getElementById("user") as TextField;
  const passwordInput = document.getElementById("password") as TextField;
  const databaseInput = document.getElementById("database") as TextField;

  vscode.postMessage({
    command: "addConnectionSubmit",
    data: {
      host: hostInput?.value,
      port: portInput?.value,
      user: userInput?.value,
      password: passwordInput?.value,
      database: databaseInput?.value,
    },
    text: "Hey there partner! 🤠",
  });
}