require("dotenv").config();
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CONSTANTS = require("../../utils/constants");
const commonPlugins = require("../common/plugins");
const plugins = require("./plugins");
const performance = require("../common/performance");
const output = require("../common/output");
const resolve = require("../common/resolve");
const entry = require("../common/entry");
const tsRule = require("../../rules/ts");
const svgRule = require("../../rules/svg");
const imagesRule = require("../../rules/images");
const fontsRule = require("../../rules/fonts");
const { extendedPostCSSPlugins } = require("../../rules/css/postcss");

module.exports = {
  context: CONSTANTS.SRC_DIR,
  entry,
  output,
  resolve,
  mode: "production",
  module: {
    rules: [
      tsRule,
      {
        test: /\.(sass|scss|css)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: extendedPostCSSPlugins
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
  plugins: [...plugins, ...commonPlugins]
};
