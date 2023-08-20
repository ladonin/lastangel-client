const path = require("path");
const PROJECT_DIR = process.cwd();
const SRC_DIR = path.resolve(PROJECT_DIR, 'src');
const BUILD_DIR = path.resolve(PROJECT_DIR, 'build');
const NODE_MODULES_DIR = path.resolve(PROJECT_DIR, 'node_modules');
const BUILD_JS_FOLDER = "client/code/js";
const BUILD_ASSETS_FOLDER = "client/code/assets";
const BUILD_CSS_FOLDER = "client/code/css";
const PRODUCTION = "production";
const BUILD_PUBLIC_FOLDER = "client/public";
module.exports = {
    PRODUCTION,
    PROJECT_DIR,
    SRC_DIR,
    BUILD_DIR,
    NODE_MODULES_DIR,
    BUILD_JS_FOLDER,
    BUILD_ASSETS_FOLDER,
    BUILD_CSS_FOLDER,
    BUILD_PUBLIC_FOLDER
}
