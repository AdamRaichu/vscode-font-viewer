const vscode = require("vscode");
const JSZip = require("jszip");

export default class FontDoc {
  constructor(uri) {
    this._uri = uri;
  }

  async dispose() {}

  get uri() {
    return this._uri;
  }

  async getFileData(uri) {
    return new Promise(function (resolve, reject) {
      var z = new JSZip();
      z.file("filename-unknown-ext", vscode.workspace.fs.readFile(uri));
      z.files["filename-unknown-ext"].async("base64").then(
        function (f) {
          resolve(f);
        },
        function (err) {
          vscode.window.showErrorMessage("There was an error converting the font file to base64.");
          reject(err);
        }
      );
    });
  }
}
