const CONSTANTS = require("../utils/constants");

module.exports = {
  test: /(?<!\.css)\.(png|jpe?g|gif)$/i,
  use: [
    {
      loader: "file-loader",
      options: {
        name: CONSTANTS.BUILD_PUBLIC_FOLDER + "/[contenthash].[ext]",
      }
    }
  ]
};
