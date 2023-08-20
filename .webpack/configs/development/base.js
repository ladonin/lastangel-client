require("dotenv").config();
const path = require("path");
const { basePostCSSPlugins } = require("../../rules/css/postcss");
const CONSTANTS = require("../../utils/constants");
const plugins = require("../common/plugins");
const performance = require("../common/performance");
const output = require("../common/output");
const resolve = require("../common/resolve");
const entry = require("../common/entry");
const tsRule = require("../../rules/ts");
const svgRule = require("../../rules/svg");
const imagesRule = require("../../rules/images");
const fontsRule = require("../../rules/fonts");

module.exports = {
  context: CONSTANTS.SRC_DIR,
  entry,
  output,
  resolve,
  devServer: {
    historyApiFallback: true, // против CSP ошибки
    headers: { "Access-Control-Allow-Origin": "*" }
  },
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      tsRule,
      {
        test: /\.(sass|scss|css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: basePostCSSPlugins
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: [CONSTANTS.NODE_MODULES_DIR, CONSTANTS.SRC_DIR]
              }
            }
          },
          {
            loader: "sass-resources-loader",
            options: {
              resources: path.resolve(CONSTANTS.SRC_DIR, "styles", "index.scss")
            }
          }
        ]
      },
      svgRule,
      imagesRule,
      fontsRule
    ]
  },
  performance,
  plugins
};
