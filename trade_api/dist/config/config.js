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
        binance_url: process.env.BINANCE_URL1 || "https://api.binance.com",
        apiKey: process.env.BINANCE_API_KEY_1 || 'Gj6LpFlLZC8ISpjCehEqE2RpQjRKIKYDygmcVc3TCDNF4AyYu6BzBtahzGILoT3R',
        apiSecret: process.env.BINANCE_API_SECRET_1 || '4TGEcO0dMjwNMPqKWzV6ZnHJwM3B6OFWtvYWj9JBuan6VIjgJtAeFHE6gt4qU30j',
        binance_ws_url: process.env.BINANCE_WS_URL1 || "wss://testnet.binance.vision",
    },
    {
        name: process.env.AccountName2 || 'BinanceAccount2',
        binance_url: process.env.BINANCE_URL2 || "https://api.binance.com",
        apiKey: process.env.BINANCE_API_KEY_2 || 'ZdA8QO89Bo9XFrpDmECeTGSapxtVyKQvfpv59VcNpiGCPdsf035DwVTJgsALMgzX',
        apiSecret: process.env.BINANCE_API_SECRET_2 || 'dLMBTs1ZOcXrTZMAhhRfCp8xg9aPK7yNWC8p5ijGyq5QMVawPsfDxCUDCEVUgCdQ',
        binance_ws_url: process.env.BINANCE_WS_URL2 || "wss://testnet.binance.vision" ///"wss://stream.binance.com:9443",
    }
    // Add more accounts as needed
];
//# sourceMappingURL=config.js.map