"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.config = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var config = {
    port: process.env.port,
    JWT_secret_key: process.env.JWT_secret_key || '12345-55555-09876-54321',
    HTTP_BAD_REQUEST: parseInt(process.env.HTTP_BAD_REQUEST, 10),
    HTTP_UNAUTHORISED: parseInt(process.env.HTTP_UNAUTHORISED, 10),
    HTTP_FORBIDDEN: parseInt(process.env.HTTP_FORBIDDEN, 10),
    HTTP_NOTFOUND: parseInt(process.env.HTTP_NOTFOUND, 10),
    HTTP_SERVER_ERROR: parseInt(process.env.HTTP_SERVER_ERROR, 10),
    HTTP_SUCCESS: parseInt(process.env.HTTP_SUCCESS, 10),
    HTTP_SUCCESSFULLY_CREATED: parseInt(process.env.HTTP_SUCCESSFULLY_CREATED, 10),
    binance_apiKey: process.env.binance_apiKey || 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
    api_secret: process.env.api_secret || 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
    binance_url: process.env.binance_url || "https://testnet.binance.vision"
};
exports.config = config;
//# sourceMappingURL=config.js.map