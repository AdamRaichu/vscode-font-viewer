const vscode = require("vscode");
import FontDoc from "./doc";

export default class FontEdit {
  static register() {
    const provider = new FontEdit();
    return vscode.window.registerCustomEditorProvider(FontEdit.viewType, provider);
  }

  static viewType = "fontViewer.FontEdit";

  constructor() {}

  async resolveCustomEditor(document, panel, _token) {
    var extUri = vscode.extensions.getExtension("adamraichu.font-viewer").extensionUri;
    var config = vscode.workspace.getConfiguration().fontViewer;

    panel.webview.options = {
      enableScripts: true,
    };
    panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <script src="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "dist", "media.js"))}"></script>
  <style id="font-container"></style>
  <link rel="stylesheet" href="${panel.webview.asWebviewUri(vscode.Uri.joinPath(extUri, "media", "editor.css"))}"></link>
  <style>${config.ligaturesEnabled ? "" : `* {font-variant-ligatures: none;}`}</style>
</head>
<body>
  <vscode-button id="open-settings">Open Extension Settings</vscode-button>
  <h1 id="loading">Font Preview is loading...</h1>
  <div id="preview">
    <div class="s18">
      <p>${config.characterList.join("</p><p>")}</p>
    </div>
    <hr>
    <p contenteditable id="editable">You can edit the text of this paragraph.</p>
    <hr>
    <p class="s12"><span class="label">12: </span>${config.sentence}</p>
    <p class="s18"><span class="label">18: </span>${config.sentence}</p>
    <p class="s24"><span class="label">24: </span>${config.sentence}</p>
    <p class="s36"><span class="label">36: </span>${config.sentence}</p>
    <p class="s48"><span class="label">48: </span>${config.sentence}</p>
    <p class="s60"><span class="label">60: </span>${config.sentence}</p>
    <p class="s72"><span class="label">72: </span>${config.sentence}</p>
  </div>
</body>
</html>`;
    panel.webview.onDidReceiveMessage((message) => {
      if (message.command === "DOMContentLoaded") {
        document.getFileData(document.uri).then(function (data) {
          panel.webview.postMessage({ command: "base64", base64: data, uri: document.uri.toString() });
        });
      }
      if (message.command === "invalid") {
        vscode.window.showErrorMessage("Invalid font file uri. Please make sure you are using an eot, otf, ttf, woff, or woff2 file.");
      }
      if (message.command === "openSettings") {
        vscode.commands.executeCommand("workbench.action.openSettings", "@ext:adamraichu.font-viewer");
      }
    });
  }

  async openCustomDocument(uri, _context, _token) {
    return new FontDoc(uri);
  }
}
