const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const CONSTANTS = require("../../utils/constants");

module.exports = [
  new EnvironmentPlugin({
    API_URL: JSON.stringify(process.env.API_URL),
    OUTER_STORAGE_URL: JSON.stringify(process.env.OUTER_STORAGE_URL),
    SIGNIN_URL: JSON.stringify(process.env.SIGNIN_URL),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    IMAGES_UPLOAD_MIN_WIDTH: JSON.stringify(process.env.IMAGES_UPLOAD_MIN_WIDTH),
    IMAGES_UPLOAD_MIN_HEIGHT: JSON.stringify(process.env.IMAGES_UPLOAD_MIN_HEIGHT),
    IMAGES_UPLOAD_MAX_WIDTH: JSON.stringify(process.env.IMAGES_UPLOAD_MAX_WIDTH),
    IMAGES_UPLOAD_MAX_HEIGHT: JSON.stringify(process.env.IMAGES_UPLOAD_MAX_HEIGHT),
    IMAGES_UPLOAD_EXTENSIONS: JSON.stringify(process.env.IMAGES_UPLOAD_EXTENSIONS),
  }),
  new MiniCssExtractPlugin({
    filename: CONSTANTS.BUILD_CSS_FOLDER + "/[name]-[contenthash].css",
    chunkFilename: CONSTANTS.BUILD_CSS_FOLDER + "/[name]-[contenthash].css"
  }),
  new CleanWebpackPlugin()
]
