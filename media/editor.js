const vscode = acquireVsCodeApi();
const uikit = require("@vscode/webview-ui-toolkit");

uikit.provideVSCodeDesignSystem().register(uikit.vsCodeButton());

function renderBase64(base64, uri, editableText) {
  const loading = document.getElementById("loading");
  if (loading) loading.remove();
  const preview = document.getElementById("preview");
  if (preview) preview.style.display = "block";

  const target = document.getElementById("font-container");
  const mime = getMime(uri);

  if (mime === "INVALID") {
    // inform extension that the stored uri is invalid and clear saved state
    vscode.postMessage({ command: "invalid" });
    vscode.setState({});
    document.body.innerHTML = "<h1>Invalid font file uri.</h1><h3>Please make sure you are using an eot, otf, ttf, woff, or woff2 file.</h3>";
    return;
  }

  // show the CSS that uses the embedded base64 font
  target.innerText = `@font-face {
  font-family: "AnUnguessableNameWhichShallNotBeTaken"; 
  src: url(data:${mime};base64,${base64});
}`;

  // Restore editable paragraph text if present
  const editable = document.getElementById("editable");
  if (editable && typeof editableText === "string") {
    editable.innerText = editableText;
  }
}

window.addEventListener("message", (e) => {
  if (e.data.command === "base64") {
    // get current editable text if present
    const editable = document.getElementById("editable");
    const editableText = editable ? editable.innerText : "";
    // persist the font data and editable text so the webview remembers it across reloads
    vscode.setState({ base64: e.data.base64, uri: e.data.uri, editableText });
    renderBase64(e.data.base64, e.data.uri, editableText);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // try to restore saved webview state first so we don't need to ask the extension
  const state = vscode.getState();
  if (state && state.base64 && state.uri) {
    renderBase64(state.base64, state.uri, state.editableText);
  } else {
    vscode.postMessage({ command: "DOMContentLoaded" });
  }

  // Listen for changes to the editable paragraph and persist them
  const editable = document.getElementById("editable");
  if (editable) {
    editable.addEventListener("input", function () {
      const state = vscode.getState() || {};
      state.editableText = editable.innerText;
      vscode.setState(state);
    });
  }

  // Open settings when button clicked
  const openSettingsButton = document.getElementById("open-settings");
  if (openSettingsButton) {
    openSettingsButton.addEventListener("click", function () {
      vscode.postMessage({ command: "openSettings" });
    });
  }
});

function getMime(uri) {
  var mime;

  if (uri.endsWith(".eot")) {
    mime = "application/vnd.ms-fontobject";
  } else if (uri.endsWith(".otf")) {
    mime = "font/otf";
  } else if (uri.endsWith(".ttf")) {
    mime = "font/ttf";
  } else if (uri.endsWith(".woff")) {
    mime = "font/woff";
  } else if (uri.endsWith(".woff2")) {
    mime = "font/woff2";
  } else {
    return "INVALID";
  }

  return mime;
}
