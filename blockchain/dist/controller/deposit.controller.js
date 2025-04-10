"use strict";
//remove all teh variables which are not used
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.depositHistory = void 0;
const client_1 = require("@prisma/client");
const defaults_1 = __importDefault(require("../config/defaults"));
const prisma = new client_1.PrismaClient();
// import winston from "winston";
const depositHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body.user;
    const depositHistory = yield prisma.deposit_history.findMany({
        where: {
            user_id: user_id,
        },
        orderBy: {
            date: 'desc',
        },
    });
    if (depositHistory.length === 0) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'No deposit history found',
        });
    }
    const depositData = depositHistory.map((item) => {
        return {
            date: item.date,
            transaction_id: item.transaction_id,
            amount: item.amount,
            final_amount: item.final_amount,
            fees: item.fees,
            status: item.status,
        };
    });
    return res.status(defaults_1.default.HTTP_SUCCESS).send({
        status_code: defaults_1.default.HTTP_SUCCESS,
        status: '1',
        message: 'Deposit history fetched successfully',
        data: depositData
    });
});
exports.depositHistory = depositHistory;
//# sourceMappingURL=deposit.controller.js.map