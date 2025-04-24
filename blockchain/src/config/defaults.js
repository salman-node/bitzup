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
    Wallet_server_getAddress_url: "https://5dea-2401-4900-1c1a-617b-c4af-f1a4-9f8c-b4b8.ngrok-free.app/api/generateAddress"

};
