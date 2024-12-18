"use strict";
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
exports.generateRandomOrderId = exports.createCryptoPair = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const utility_functions_1 = require("../utility/utility.functions");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
/*----- Get Buy Sell Balance -----*/
const createCryptoPair = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { admin_id: admin_id } = req.body.user;
        const { quote_currency, base_currency, symbol, qty_decimal, price_decimal, min_quote_qty, max_quote_qty, trade_fee, } = req.body;
        // if (!admin_id) {
        //   return res.json({
        //     status: "0",
        //     message: "You are not authorized or user not present",
        //   });
        // }
        if (!quote_currency ||
            !base_currency ||
            !symbol ||
            !qty_decimal ||
            !price_decimal) {
            return res.status(200).send({
                status: "0",
                message: "Please provide all the fields",
            });
        }
        const quoteData = yield prisma.currencies.count({
            where: { currency_id: quote_currency },
        });
        if (!quoteData) {
            return res.status(200).send({
                status: "0",
                message: "Provide valid quote currency",
            });
        }
        const baseData = yield prisma.currencies.count({
            where: { currency_id: base_currency },
        });
        if (!baseData) {
            return res.status(200).send({
                status: "0",
                message: "Provide valid base currency",
            });
        }
        const pair_id = yield (0, utility_functions_1.generateUniqueId)(symbol, 16);
        const data = yield prisma.crypto_pair.create({
            data: {
                pair_id: pair_id,
                quote_asset_id: quote_currency,
                base_asset_id: base_currency,
                pair_symbol: symbol,
                quantity_decimal: qty_decimal,
                price_decimal,
                current_price: 0,
                min_base_qty: min_quote_qty,
                max_base_qty: max_quote_qty,
                min_quote_qty: min_quote_qty,
                max_quote_qty: max_quote_qty,
                trade_fee: trade_fee,
                chart_id: "",
                icon: "",
                trade_status: 0,
                pro_trade: 0,
                change_in_price: 0, // Add the missing property
            },
        });
        res.status(200).send({
            status: "1",
            message: "Crypto pair created successfully",
            data,
        });
    }
    catch (err) {
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.createCryptoPair = createCryptoPair;
function generateRandomOrderId() {
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${timestamp}${randomPart}`;
}
exports.generateRandomOrderId = generateRandomOrderId;
//# sourceMappingURL=controller.js.map