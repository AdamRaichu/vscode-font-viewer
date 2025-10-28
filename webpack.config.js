const path = require("path");

module.exports = {
  entry: { main: "./src/index.js", media: "./media/editor.js" },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: {
    vscode: "commonjs vscode",
  },
  mode: "production",
};
