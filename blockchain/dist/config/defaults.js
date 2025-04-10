"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.default = {
    port: 4004,
    saltworkFactor: 10,
    jwtsecret: process.env.JWT_SECRET || '12345-55555-09876-54321',
    jwtExp: '100d',
    ICON_URL1: process.env.ICON_URL1 || "http://172.105.52.30:4002",
    ICON_URL: process.env.ICON_URL || "http://172.105.52.30:4002",
    BASE_URL: process.env.APP_ENV === 'development'
        ? 'http://localhost:4004'
        : 'http://192.46.213.147:4004',
    zoho_token: process.env.ZOHO_TOKEN,
    zepto_url: 'https://api.zeptomail.in/v1.1/email',
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORISED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOTFOUND: 404,
    HTTP_SERVER_ERROR: 500,
    HTTP_SUCCESS: 200,
    HTTP_SUCCESSFULLY_CREATED: 201,
};
//# sourceMappingURL=defaults.js.map