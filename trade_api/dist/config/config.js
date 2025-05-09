"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.AdminTradeAccounts = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 10007,
    JWT_secret_key: process.env.JWT_secret_key || '12345-55555-09876-54321',
    HTTP_BAD_REQUEST: process.env.HTTP_BAD_REQUEST || '400',
    HTTP_UNAUTHORISED: parseInt(process.env.HTTP_UNAUTHORISED || '401', 10),
    HTTP_FORBIDDEN: parseInt(process.env.HTTP_FORBIDDEN || '403', 10),
    HTTP_NOTFOUND: parseInt(process.env.HTTP_NOTFOUND || '404', 10),
    HTTP_SERVER_ERROR: parseInt(process.env.HTTP_SERVER_ERROR || '500', 10),
    HTTP_SUCCESS: parseInt(process.env.HTTP_SUCCESS || '200', 10),
    HTTP_SUCCESSFULLY_CREATED: parseInt(process.env.HTTP_SUCCESSFULLY_CREATED || '201', 10),
    //redis connection details
    REDIS_HOST: process.env.REDIS_HOST || 'redis-18514.c322.us-east-1-2.ec2.redns.redis-cloud.com',
    REDIS_PORT: 18514,
    REDIS_USER: process.env.REDIS_USER || 'default',
    REDIS_AUTH: process.env.REDIS_AUTH || 'blE32GqYBT9dHDyopO1tiG10AKOuW0C8',
};
exports.config = config;
exports.AdminTradeAccounts = [
    {
        name: process.env.AccountName1 || 'BinanceAccount1',
        binance_url: process.env.BINANCE_URL1 || "https://testnet.binance.vision",
        apiKey: process.env.BINANCE_API_KEY_1 || 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
        apiSecret: process.env.BINANCE_API_SECRET_1 || 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
        binance_ws_url: process.env.BINANCE_WS_URL1 || "wss://testnet.binance.vision",
    },
    {
        name: process.env.AccountName2 || 'BinanceAccount2',
        binance_url: process.env.BINANCE_URL2 || "https://testnet.binance.vision",
        apiKey: process.env.BINANCE_API_KEY_2 || 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om',
        apiSecret: process.env.BINANCE_API_SECRET_2 || 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW',
        binance_ws_url: process.env.BINANCE_WS_URL2 || "wss://testnet.binance.vision" ///"wss://stream.binance.com:9443",
    }
    // Add more accounts as needed
];
//# sourceMappingURL=config.js.map