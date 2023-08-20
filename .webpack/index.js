require("dotenv").config();
const productionConfig = require("./configs/production/base");
const developmentConfig = require("./configs/development/base");
const CONSTANTS = require("./utils/constants");

const IS_PRODUCTION = process.env.NODE_ENV === CONSTANTS.PRODUCTION;

module.exports = IS_PRODUCTION ? productionConfig : developmentConfig;
