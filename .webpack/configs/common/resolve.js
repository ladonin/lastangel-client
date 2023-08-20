const CONSTANTS = require("../../utils/constants");

module.exports = {
  extensions: ["", "*", ".ts", ".tsx", ".js", ".jsx"],
  modules: [
    CONSTANTS.NODE_MODULES_DIR,
    CONSTANTS.SRC_DIR
  ]
}
