const vscode = acquireVsCodeApi();

window.addEventListener("message", (e) => {
  if (e.data.command === "base64") {
    document.getElementById("loading").remove();
    var target = document.getElementById("font-container");
    var mime = getMime(e.data.uri);
    if (mime === "INVALID") {
      vscode.postMessage({ command: "invalid" });
      document.body.innerHTML = "<h1>Invalid font file uri.</h1><h3>Please make sure you are using an eot, otf, ttf, woff, or woff2 file.</h3>";
      return;
    }
    target.innerText = `@font-face {
  font-family: "AnUnguessableNameWhichShallNotBeTaken"; 
  src: url(data:${mime};base64,${e.data.base64});
}`;
    document.getElementById("preview").style.display = "block";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  vscode.postMessage({ command: "DOMContentLoaded" });
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
