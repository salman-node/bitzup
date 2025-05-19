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
exports.depositHistory = exports.depositWebhook = void 0;
const client_1 = require("@prisma/client");
const defaults_1 = __importDefault(require("../config/defaults"));
const prisma = new client_1.PrismaClient();
// import Big from "big.js";
// import { Decimal } from '@prisma/client/runtime/library';
// Top-level module scope (keeps memory for lifetime of server)
const processedTxHashes = new Set();
// webhook for deposit
const depositWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, chain_id, address, amount, contract_address, tx_hash, memo } = req.body;
        console.log(user_id, chain_id, address, amount, "contract_address: ", contract_address, tx_hash, memo);
        if (contract_address === undefined) {
            return res.status(defaults_1.default.HTTP_SUCCESS).send({
                status_code: defaults_1.default.HTTP_SUCCESS,
                status: 0,
                message: 'Contract address is required',
            });
        }
        // Validate required parameters
        if (!user_id || !chain_id || !address || !amount || !tx_hash) {
            return res.status(defaults_1.default.HTTP_SUCCESS).send({
                status_code: defaults_1.default.HTTP_SUCCESS,
                status: 0,
                message: 'Missing required parameters',
            });
        }
        // Validate data types
        if (typeof user_id !== 'string' ||
            typeof chain_id !== 'number' ||
            typeof address !== 'string' ||
            typeof contract_address !== 'string' ||
            typeof tx_hash !== 'string' ||
            (memo && typeof memo !== 'string')) {
            return res.status(defaults_1.default.HTTP_SUCCESS).send({
                status_code: defaults_1.default.HTTP_SUCCESS,
                status: 0,
                message: 'Invalid parameter types',
            });
        }
        if (processedTxHashes.has(tx_hash)) {
            return res.status(409).json({ status: 0, message: 'Duplicate transaction (in-memory cache)' });
        }
        // Add tx_hash to Set early to avoid race conditions
        processedTxHashes.add(tx_hash);
        const parsedAmount = amount;
        console.log('parsedAmount', parsedAmount);
        if (parsedAmount <= 0) {
            return res.status(defaults_1.default.HTTP_SUCCESS).send({
                status_code: defaults_1.default.HTTP_SUCCESS,
                status: 0,
                message: 'Invalid amount',
            });
        }
        // Check if currency exists for the given chain & contract
        const currencyID = yield prisma.$queryRaw `
      SELECT currency_id from currency_network
      WHERE network_id = ${chain_id} and contract_address = ${contract_address};`;
        if (!currencyID || currencyID.length === 0) {
            return res.status(defaults_1.default.HTTP_SUCCESS).send({
                status_code: defaults_1.default.HTTP_SUCCESS,
                status: 0,
                message: 'Currency not found for the provided chain and contract',
            });
        }
        const currency_id = currencyID[0].currency_id;
        // Optional: prevent duplicate tx_hash (idempotency)
        const existingTx = yield prisma.deposit_history.findFirst({
            where: { transaction_id: tx_hash },
        });
        if (existingTx) {
            return res.status(defaults_1.default.HTTP_SUCCESS).send({
                status_code: defaults_1.default.HTTP_SUCCESS,
                status: 0,
                message: 'Duplicate transaction hash',
            });
        }
        // Update user balance
        // await prisma.$executeRaw`
        // UPDATE balances
        // SET main_balance = main_balance + ${parsedAmount},
        //     current_balance = current_balance + ${parsedAmount}
        // WHERE user_id = ${user_id} AND currency_id = ${currency_id};
        // `;
        // await prisma.balances.updateMany({
        //   where: {
        //     user_id: user_id,
        //     currency_id: currency_id,
        //   },
        //   data: {
        //     main_balance: {
        //       increment: parsedAmount,
        //     },
        //     current_balance: {
        //       increment: parsedAmount,
        //     },
        //   },
        // });
        yield prisma.$queryRaw `INSERT INTO balances (user_id, currency_id, main_balance, current_balance)
    VALUES (${user_id}, ${currency_id}, ${parsedAmount}, ${parsedAmount})ON DUPLICATE KEY UPDATE 
    main_balance = main_balance + VALUES(main_balance),
    current_balance = current_balance + VALUES(current_balance);`;
        // Insert deposit history
        yield prisma.deposit_history.create({
            data: {
                user_id: user_id,
                transaction_id: tx_hash,
                amount: parsedAmount.toString(),
                final_amount: parsedAmount.toString(),
                status: 'SUCCESS',
                date: new Date(),
                coin_id: currency_id,
                memo: memo || '',
                address: address,
                chain_id: chain_id,
            },
        });
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 1,
            message: 'Deposit webhook executed successfully',
        });
    }
    catch (error) {
        console.error('Deposit webhook error:', error);
        return res.status(500).send({
            status_code: 500,
            status: 0,
            message: 'Internal server error',
        });
    }
});
exports.depositWebhook = depositWebhook;
const depositHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body.user;
    if (!user_id) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'User not found',
        });
    }
    const depositHistory = yield prisma.$queryRaw `
    SELECT w.*, c.symbol, n.chain_name as network_name, n.id,n.netw_fee as network_fee FROM deposit_history w 
    JOIN currencies c ON w.coin_id = c.currency_id 
    JOIN chains n ON w.chain_id = n.chain_id
    WHERE w.user_id =${user_id} ORDER BY w.date DESC;`;
    if (depositHistory.length === 0) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'No deposit history found',
        });
    }
    // const depositData = depositHistory.map((item:any) => {
    //     return {
    //         date: item.date,
    //         transaction_id: item.transaction_id,
    //         amount: item.amount,
    //         final_amount: item.final_amount,
    //         status: item.status,
    //     }
    // });  
    return res.status(defaults_1.default.HTTP_SUCCESS).send({
        status_code: defaults_1.default.HTTP_SUCCESS,
        status: '1',
        message: 'Deposit history fetched successfully',
        data: depositHistory
    });
});
exports.depositHistory = depositHistory;
//# sourceMappingURL=deposit.controller.js.map