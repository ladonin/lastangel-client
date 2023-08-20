const CONSTANTS = require("../../utils/constants");

module.exports = {
  path: CONSTANTS.BUILD_DIR,
  publicPath: "/", // против CSP ошибки
  assetModuleFilename: CONSTANTS.BUILD_ASSETS_FOLDER + "/[name]-[hash:8].[ext]",
  filename: CONSTANTS.BUILD_JS_FOLDER + "/[name]-[contenthash].js",
  chunkFilename: CONSTANTS.BUILD_JS_FOLDER + "/[name]-[contenthash].js"
}
