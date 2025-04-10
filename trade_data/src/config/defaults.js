"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
exports.default = {
    port: 4002,
    saltworkFactor: 10,
    jwtsecret: process.env.JWT_SECRET,
    jwtExp: '100d',
    BASE_URL: process.env.APP_ENV === 'development'
        ? 'http://localhost:4001'
        : 'http://192.46.213.147:4001',
    zoho_token: process.env.ZOHO_TOKEN,
    zepto_url: 'https://api.zeptomail.in/v1.1/email',
};
