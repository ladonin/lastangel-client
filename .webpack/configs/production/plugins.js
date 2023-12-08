const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = [
  new HtmlWebpackPlugin({
    template: "index.html",
    favicon: "./icons/favicon.ico"
  })
]
