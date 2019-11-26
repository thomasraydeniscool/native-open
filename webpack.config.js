const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // the filename template for entry chunks
    filename: "[name].js",
    // library import name
    library: "nativeopen",
    // universal module definition
    libraryTarget: "umd",
    // the type of the exported library
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
