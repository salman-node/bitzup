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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const defaults_1 = __importDefault(require("./config/defaults"));
// import {depositRouter} from './routes/deposit.router';
// import { withdrawalRouter } from './routes/withdrawal.router';
const user_wallet_routes_1 = require("./routes/user.wallet.routes");
const withdrawal_router_1 = require("./routes/withdrawal.router");
const deposit_router_1 = require("./routes/deposit.router");
// import path from 'path';
const app = (0, express_1.default)();
dotenv.config();
const PORT = defaults_1.default.port || process.env.PORT;
app.set('trust proxy', true);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('src/public'));
// app.use('/deposit', depositRouter);
// app.use('/withdraw', withdrawalRouter);
app.use('/wallet', user_wallet_routes_1.userWalletRouter);
app.use('/v1', withdrawal_router_1.withdrawalRouter);
app.use('/v2', deposit_router_1.depositRouter);
app.listen(PORT, () => {
    console.log(`⚙️ BitzUp: server is running on port ${defaults_1.default.BASE_URL}`);
});
//# sourceMappingURL=index.js.map