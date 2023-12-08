const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = [
  new HtmlWebpackPlugin({
    template: "index_dev.html",
    favicon: "./icons/favicon.ico"
  })
]
