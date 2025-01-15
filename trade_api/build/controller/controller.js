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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.rawQuery = exports.get_pair_data = exports.get_open_orders = exports.formatDate = exports.cancelOrder = exports.placeSellStopLimit = exports.placeBuyStopLimit = exports.placeSellOrder = exports.placeBuyOrder = void 0;
require("dotenv").config();
// import { Request, Response } from "express";
var joi_1 = __importDefault(require("joi"));
var prisma_client_1 = require("../config/prisma_client"); // import { v4 as uuid } from "uuid";
// import GenerateID from "../utility/generator";
var config_1 = require("../config/config");
var constants_1 = require("../utility/constants");
var generator_1 = require("../utility/generator");
// import configValidate from '../utility/validation'
var connector_typescript_1 = require("@binance/connector-typescript");
var crypto_1 = require("crypto");
var apiKey = config_1.config.binance_apiKey;
var apiSecret = config_1.config.api_secret;
var client = new connector_typescript_1.Spot(apiKey, apiSecret, {
    baseURL: config_1.config.binance_url,
    timeout: 1000
});
var placeBuyOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody, user_id, pair_id, quote_volume, limit_price, order_type, stop_limit_price, ip_address, device_type, device_info, orderType, getPairData, side, pairDecimal, pairSymbol, minQuoteVolume, maxQuoteVolume, quote_asset_id, userAssetBalance, userBalance, validateQuoteVolume, OrderId, baseVolume, options, orderData, binanceError_1, status_1, OrderResponse, responseData, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                reqBody = req.body;
                user_id = reqBody.user_id, pair_id = reqBody.pair_id, quote_volume = reqBody.quote_volume, limit_price = reqBody.limit_price, order_type = reqBody.order_type, stop_limit_price = reqBody.stop_limit_price, ip_address = reqBody.ip_address, device_type = reqBody.device_type, device_info = reqBody.device_info;
                console.log(1, user_id, pair_id, quote_volume, limit_price, order_type, stop_limit_price, ip_address, device_type, device_info);
                orderType = order_type.toUpperCase();
                return [4 /*yield*/, prisma_client_1.prisma.crypto_pair.findMany({
                        where: {
                            pair_id: pair_id
                        },
                        select: {
                            base_asset_id: true,
                            quote_asset_id: true,
                            pair_id: true,
                            pair_symbol: true,
                            current_price: true,
                            min_quote_qty: true,
                            min_base_qty: true,
                            max_base_qty: true,
                            max_quote_qty: true,
                            trade_fee: true,
                            quantity_decimal: true,
                            price_decimal: true,
                            status: true
                        }
                    })];
            case 1:
                getPairData = _a.sent();
                console.log(2);
                if (!getPairData.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_BAD_REQUEST).send({
                            status_code: config_1.config.HTTP_BAD_REQUEST,
                            status: "3",
                            message: "Invalid pair id"
                        })];
                }
                side = "BUY";
                pairDecimal = getPairData[0].quantity_decimal;
                pairSymbol = getPairData[0].pair_symbol;
                minQuoteVolume = getPairData[0].min_quote_qty;
                maxQuoteVolume = getPairData[0].max_quote_qty;
                quote_asset_id = getPairData[0].quote_asset_id;
                console.log(3);
                return [4 /*yield*/, prisma_client_1.prisma.balances.findMany({
                        where: {
                            user_id: user_id,
                            currency_id: quote_asset_id
                        },
                        select: {
                            current_balance: true
                        }
                    })];
            case 2:
                userAssetBalance = _a.sent();
                console.log(4);
                if (!userAssetBalance.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "User balance not found"
                        })];
                }
                userBalance = userAssetBalance[0].current_balance;
                if (Number(userBalance) < Number(quote_volume)) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Sorry, your quote balance is insufficient."
                        })];
                }
                console.log(5);
                validateQuoteVolume = joi_1["default"].object({
                    quote_volume: joi_1["default"].number()
                        .precision(pairDecimal)
                        .min(minQuoteVolume)
                        .max(maxQuoteVolume)
                        .required()
                }).validate({ quote_volume: quote_volume });
                if (validateQuoteVolume.error) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Amount must be greater then or equal to ".concat(minQuoteVolume, " and less then or equal to ").concat(maxQuoteVolume)
                        })];
                }
                console.log(6);
                OrderId = (0, generator_1.GenerateUniqueID)(10, (0, crypto_1.randomUUID)(), "".concat(user_id, "-"));
                baseVolume = 0;
                if (orderType == "LIMIT") {
                    baseVolume = Number((quote_volume / limit_price).toFixed(pairDecimal));
                }
                // client.setTimestampOffset()
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.create({
                        data: {
                            user_id: user_id,
                            pair_id: pair_id,
                            type: side,
                            base_quantity: baseVolume,
                            quote_quantity: quote_volume,
                            order_price: limit_price,
                            executed_base_quantity: 0,
                            executed_quote_quantity: 0,
                            stop_limit_price: stop_limit_price,
                            oco_stop_limit_price: null,
                            order_id: OrderId,
                            order_type: orderType,
                            device: null
                        }
                    })];
            case 3:
                // client.setTimestampOffset()
                _a.sent();
                options = void 0;
                if (orderType == "LIMIT") {
                    options = {
                        price: limit_price,
                        quantity: baseVolume,
                        timeInForce: connector_typescript_1.TimeInForce.GTC,
                        newClientOrderId: OrderId,
                        newOrderRespType: connector_typescript_1.NewOrderRespType.FULL,
                        recvWindow: 5000
                    };
                }
                if (orderType == "MARKET") {
                    options = {
                        quoteOrderQty: quote_volume,
                        newClientOrderId: OrderId,
                        recvWindow: 5000
                    };
                }
                orderData = void 0;
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 8]);
                return [4 /*yield*/, client.newOrder(pairSymbol, (0, constants_1.getSide)(side), (0, constants_1.getOrderType)(orderType), options)];
            case 5:
                orderData = _a.sent();
                console.log("orderData", orderData);
                return [3 /*break*/, 8];
            case 6:
                binanceError_1 = _a.sent();
                console.error("Binance Order Placement Error:", binanceError_1 || binanceError_1);
                // Update the database to mark the order as failed
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                        data: {
                            status: "FAILED",
                            response: binanceError_1.message || binanceError_1
                        },
                        where: {
                            order_id: OrderId
                        }
                    })];
            case 7:
                // Update the database to mark the order as failed
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SERVER_ERROR).send({
                        status_code: config_1.config.HTTP_SERVER_ERROR,
                        status: false,
                        message: "Order failed to place."
                    })];
            case 8:
                status_1 = orderData.status;
                OrderResponse = orderData;
                return [4 /*yield*/, prisma_client_1.prisma.$transaction([
                        prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                            data: {
                                order_price: orderData.price,
                                base_quantity: orderData.origQty,
                                quote_quantity: quote_volume,
                                api_order_id: orderData.orderId.toString(),
                                executed_base_quantity: orderData.executedQty,
                                executed_quote_quantity: orderData.cummulativeQuoteQty,
                                status: status_1
                            },
                            where: {
                                order_id: orderData.clientOrderId
                            }
                        }),
                        prisma_client_1.prisma.buy_sell_order_response.create({
                            data: {
                                order_id: orderData.clientOrderId,
                                api_order_id: orderData.orderId.toString(),
                                response: JSON.stringify(OrderResponse)
                            }
                        }),
                    ])];
            case 9:
                _a.sent();
                responseData = {
                    order_id: orderData.clientOrderId,
                    base_quantity: orderData.origQty,
                    quote_quantity: orderData.cummulativeQuoteQty,
                    order_price: orderData.price,
                    type: orderData.side,
                    order_type: orderData.type,
                    executed_base_quantity: orderData.executedQty,
                    executed_quote_quantity: orderData.cummulativeQuoteQty,
                    status: orderData.status,
                    created_at: orderData.transactTime
                };
                console.log(7, ip_address, device_type, device_info);
                return [4 /*yield*/, prisma_client_1.prisma.activity_logs.create({
                        data: {
                            user_id: user_id,
                            activity_type: "Placed buy order",
                            ip_address: ip_address,
                            device_type: device_type,
                            device_info: device_info
                        }
                    })];
            case 10:
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                        status_code: config_1.config.HTTP_SUCCESS,
                        status: "1",
                        message: "Order Placed Successfully",
                        Data: [responseData]
                    })];
            case 11:
                e_1 = _a.sent();
                console.log(e_1);
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_1, Data: [] })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.placeBuyOrder = placeBuyOrder;
var placeSellOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody, user_id, pair_id, base_volume, limit_price, order_type, stop_limit_price, ip_address, device_type, device_info, orderType, getPairData, side, pairDecimal, pairSymbol, minBaseVolume, maxBaseVolume, base_asset_id, userAssetBalance, userBalance, validateBaseeVolume, base_quantity, OrderId, options, orderData, binanceError_2, status_2, OrderResponse, responseData, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                reqBody = req.body;
                user_id = reqBody.user_id, pair_id = reqBody.pair_id, base_volume = reqBody.base_volume, limit_price = reqBody.limit_price, order_type = reqBody.order_type, stop_limit_price = reqBody.stop_limit_price, ip_address = reqBody.ip_address, device_type = reqBody.device_type, device_info = reqBody.device_info;
                orderType = order_type.toUpperCase();
                return [4 /*yield*/, prisma_client_1.prisma.crypto_pair.findMany({
                        where: {
                            pair_id: pair_id
                        },
                        select: {
                            base_asset_id: true,
                            quote_asset_id: true,
                            pair_id: true,
                            pair_symbol: true,
                            current_price: true,
                            min_quote_qty: true,
                            min_base_qty: true,
                            max_base_qty: true,
                            max_quote_qty: true,
                            trade_fee: true,
                            quantity_decimal: true,
                            price_decimal: true,
                            status: true
                        }
                    })];
            case 1:
                getPairData = _a.sent();
                side = "SELL";
                if (!getPairData.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_BAD_REQUEST).send({
                            status_code: config_1.config.HTTP_BAD_REQUEST,
                            status: "3",
                            message: "Invalid pair id"
                        })];
                }
                pairDecimal = getPairData[0].quantity_decimal;
                pairSymbol = getPairData[0].pair_symbol;
                minBaseVolume = getPairData[0].min_base_qty;
                maxBaseVolume = getPairData[0].max_base_qty;
                base_asset_id = getPairData[0].base_asset_id;
                return [4 /*yield*/, prisma_client_1.prisma.balances.findMany({
                        where: {
                            user_id: user_id,
                            currency_id: base_asset_id
                        },
                        select: {
                            current_balance: true
                        }
                    })];
            case 2:
                userAssetBalance = _a.sent();
                if (!userAssetBalance.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "User balance not found"
                        })];
                }
                userBalance = userAssetBalance[0].current_balance;
                if (Number(userBalance) < Number(base_volume)) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Sorry, your quote balance is insufficient."
                        })];
                }
                validateBaseeVolume = joi_1["default"].object({
                    base_volume: joi_1["default"].number()
                        .precision(pairDecimal)
                        .min(minBaseVolume)
                        .max(maxBaseVolume)
                        .required()
                }).validate({ base_volume: base_volume });
                if (validateBaseeVolume.error) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Base volume must be greater then or equal to ".concat(minBaseVolume, " and less then or equal to ").concat(minBaseVolume)
                        })];
                }
                base_quantity = Number(Number(base_volume).toFixed(pairDecimal));
                OrderId = (0, generator_1.GenerateUniqueID)(10, (0, crypto_1.randomUUID)(), "".concat(user_id, "-"));
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.create({
                        data: {
                            user_id: user_id,
                            pair_id: pair_id,
                            type: side,
                            base_quantity: base_quantity,
                            quote_quantity: base_quantity * limit_price,
                            order_price: limit_price,
                            executed_base_quantity: 0,
                            executed_quote_quantity: 0,
                            stop_limit_price: stop_limit_price,
                            oco_stop_limit_price: null,
                            order_id: OrderId,
                            order_type: orderType,
                            device: null
                        }
                    })];
            case 3:
                _a.sent();
                options = void 0;
                if (orderType == "LIMIT") {
                    options = {
                        price: limit_price,
                        quantity: base_quantity,
                        timeInForce: connector_typescript_1.TimeInForce.GTC,
                        newClientOrderId: OrderId
                    };
                }
                if (orderType == "MARKET") {
                    options = {
                        quantity: base_quantity,
                        newClientOrderId: OrderId
                    };
                }
                orderData = void 0;
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 8]);
                return [4 /*yield*/, client.newOrder(pairSymbol, (0, constants_1.getSide)(side), (0, constants_1.getOrderType)(orderType), options)];
            case 5:
                orderData = _a.sent();
                return [3 /*break*/, 8];
            case 6:
                binanceError_2 = _a.sent();
                console.error("Binance Order Placement Error:", binanceError_2.message || binanceError_2);
                // Update the database to mark the order as failed
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                        data: {
                            status: "FAILED",
                            response: binanceError_2.message || binanceError_2
                        },
                        where: {
                            order_id: OrderId
                        }
                    })];
            case 7:
                // Update the database to mark the order as failed
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SERVER_ERROR).send({
                        status_code: config_1.config.HTTP_SERVER_ERROR,
                        status: false,
                        message: "Order failed to place."
                    })];
            case 8:
                status_2 = orderData.status;
                if (orderData.status === undefined) {
                    throw new Error("Order status is undefined");
                }
                OrderResponse = orderData;
                return [4 /*yield*/, prisma_client_1.prisma.$transaction([
                        prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                            data: {
                                order_price: orderData.price,
                                base_quantity: orderData.origQty,
                                quote_quantity: (base_quantity * limit_price).toFixed(pairDecimal),
                                api_order_id: orderData.orderId.toString(),
                                executed_base_quantity: orderData.executedQty,
                                executed_quote_quantity: orderData.cummulativeQuoteQty,
                                status: status_2
                            },
                            where: {
                                order_id: orderData.clientOrderId
                            }
                        }),
                        prisma_client_1.prisma.buy_sell_order_response.create({
                            data: {
                                order_id: orderData.clientOrderId,
                                api_order_id: orderData.orderId.toString(),
                                response: JSON.stringify(OrderResponse)
                            }
                        }),
                    ])];
            case 9:
                _a.sent();
                responseData = {
                    order_id: orderData.clientOrderId,
                    base_quantity: orderData.origQty,
                    quote_quantity: orderData.cummulativeQuoteQty,
                    order_price: orderData.price,
                    type: orderData.side,
                    order_type: orderData.type,
                    executed_base_quantity: orderData.executedQty,
                    executed_quote_quantity: orderData.cummulativeQuoteQty,
                    status: orderData.status,
                    created_at: orderData.transactTime
                };
                return [4 /*yield*/, prisma_client_1.prisma.activity_logs.create({
                        data: {
                            user_id: user_id,
                            activity_type: "Placed Sell order",
                            ip_address: ip_address,
                            device_type: device_type,
                            device_info: device_info
                        }
                    })];
            case 10:
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                        status_code: config_1.config.HTTP_SUCCESS,
                        status: "1",
                        message: "Order Placed Successfully",
                        Data: [responseData]
                    })];
            case 11:
                e_2 = _a.sent();
                console.log("error", e_2);
                // await prisma.$transaction.rollback();
                // throw e;
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_2, Data: [] })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.placeSellOrder = placeSellOrder;
var placeBuyStopLimit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody, user_id, pair_id, quote_volume, limit_price, stop_price, ip_address, device_type, device_info, side, getPairData, pairDecimal, pairSymbol, currentMarketPrice, ordertype, minQuoteVolume, maxQuoteVolume, quote_asset_id, userAssetBalance, userBalance, validateQuoteVolume, OrderId, baseVolume, options, orderResponse, binanceError_3, orderData, responseData, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                reqBody = req.body;
                user_id = reqBody.user_id, pair_id = reqBody.pair_id, quote_volume = reqBody.quote_volume, limit_price = reqBody.limit_price, stop_price = reqBody.stop_price, ip_address = reqBody.ip_address, device_type = reqBody.device_type, device_info = reqBody.device_info;
                side = "BUY";
                return [4 /*yield*/, prisma_client_1.prisma.crypto_pair.findMany({
                        where: {
                            pair_id: pair_id
                        },
                        select: {
                            base_asset_id: true,
                            quote_asset_id: true,
                            pair_id: true,
                            pair_symbol: true,
                            current_price: true,
                            min_quote_qty: true,
                            min_base_qty: true,
                            max_base_qty: true,
                            max_quote_qty: true,
                            trade_fee: true,
                            quantity_decimal: true,
                            price_decimal: true,
                            status: true
                        }
                    })];
            case 1:
                getPairData = _a.sent();
                if (!getPairData.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_BAD_REQUEST).send({
                            status_code: config_1.config.HTTP_BAD_REQUEST,
                            status: "3",
                            message: "Invalid pair id"
                        })];
                }
                pairDecimal = getPairData[0].quantity_decimal;
                pairSymbol = getPairData[0].pair_symbol;
                return [4 /*yield*/, client.symbolPriceTicker({ symbol: pairSymbol })];
            case 2:
                currentMarketPrice = _a.sent();
                console.log('currentMarketPrice', currentMarketPrice);
                ordertype = void 0;
                if (stop_price < currentMarketPrice.price) {
                    ordertype = "TAKE_PROFIT_LIMIT";
                }
                else {
                    ordertype = 'STOP_LOSS_LIMIT';
                }
                minQuoteVolume = getPairData[0].min_quote_qty;
                maxQuoteVolume = getPairData[0].max_quote_qty;
                quote_asset_id = getPairData[0].quote_asset_id;
                return [4 /*yield*/, prisma_client_1.prisma.balances.findMany({
                        where: {
                            user_id: user_id,
                            currency_id: quote_asset_id
                        },
                        select: {
                            current_balance: true
                        }
                    })];
            case 3:
                userAssetBalance = _a.sent();
                if (!userAssetBalance.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "User balance not found"
                        })];
                }
                userBalance = userAssetBalance[0].current_balance;
                if (Number(userBalance) < Number(quote_volume)) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Sorry, your quote balance is insufficient."
                        })];
                }
                validateQuoteVolume = joi_1["default"].object({
                    quote_volume: joi_1["default"].number()
                        .precision(pairDecimal)
                        .min(minQuoteVolume)
                        .max(maxQuoteVolume)
                        .required()
                }).validate({ quote_volume: quote_volume });
                if (validateQuoteVolume.error) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Quote volume must be greater then or equal to ".concat(minQuoteVolume, " and less then or equal to ").concat(maxQuoteVolume)
                        })];
                }
                OrderId = (0, generator_1.GenerateUniqueID)(10, (0, crypto_1.randomUUID)(), "".concat(user_id, "-"));
                baseVolume = Number((quote_volume / limit_price).toFixed(pairDecimal));
                // client.setTimestampOffset()
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.create({
                        data: {
                            user_id: user_id,
                            pair_id: pair_id,
                            type: side,
                            base_quantity: baseVolume,
                            quote_quantity: quote_volume,
                            order_price: limit_price,
                            executed_base_quantity: 0,
                            executed_quote_quantity: 0,
                            stop_limit_price: stop_price,
                            oco_stop_limit_price: null,
                            order_type: ordertype,
                            order_id: OrderId,
                            device: null
                        }
                    })];
            case 4:
                // client.setTimestampOffset()
                _a.sent();
                options = {
                    quantity: baseVolume,
                    price: limit_price,
                    stopPrice: stop_price,
                    newClientOrderId: OrderId,
                    timeInForce: connector_typescript_1.TimeInForce.GTC,
                    recvWindow: 5000,
                    timestamp: Date.now()
                };
                orderResponse = void 0;
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 9]);
                return [4 /*yield*/, client.newOrder(pairSymbol, (0, constants_1.getSide)(side), (0, constants_1.getOrderType)(ordertype), options)];
            case 6:
                orderResponse = _a.sent();
                console.log("orderResponse", orderResponse);
                return [3 /*break*/, 9];
            case 7:
                binanceError_3 = _a.sent();
                console.error("Binance Order Placement Error:", binanceError_3.message || binanceError_3);
                // Update the database to mark the order as failed
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                        data: {
                            status: "FAILED",
                            response: binanceError_3.message || binanceError_3
                        },
                        where: {
                            order_id: OrderId
                        }
                    })];
            case 8:
                // Update the database to mark the order as failed
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SERVER_ERROR).send({
                        status_code: config_1.config.HTTP_SERVER_ERROR,
                        status: false,
                        message: "Order failed to place."
                    })];
            case 9: 
            // sleep for 1 second
            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 10:
                // sleep for 1 second
                _a.sent();
                return [4 /*yield*/, client.getOrder(orderResponse.symbol, {
                        orderId: orderResponse.orderId
                    })];
            case 11:
                orderData = _a.sent();
                console.log("orderData", orderData);
                return [4 /*yield*/, prisma_client_1.prisma.$transaction([
                        prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                            data: {
                                order_price: orderData.price,
                                api_order_id: orderData.orderId.toString(),
                                executed_base_quantity: orderData.executedQty,
                                executed_quote_quantity: orderData.cummulativeQuoteQty,
                                status: orderData.status,
                                order_type: ordertype
                            },
                            where: {
                                order_id: orderData.clientOrderId
                            }
                        }),
                        prisma_client_1.prisma.buy_sell_order_response.create({
                            data: {
                                order_id: orderData.clientOrderId,
                                api_order_id: orderData.orderId.toString(),
                                response: JSON.stringify(orderData)
                            }
                        }),
                    ])];
            case 12:
                _a.sent();
                responseData = {
                    order_id: orderData.clientOrderId,
                    base_quantity: orderData.origQty,
                    quote_quantity: orderData.cummulativeQuoteQty,
                    order_price: orderData.price,
                    type: orderData.side,
                    order_type: orderData.type,
                    executed_base_quantity: orderData.executedQty,
                    executed_quote_quantity: orderData.cummulativeQuoteQty,
                    status: orderData.status,
                    created_at: orderData.time
                };
                return [4 /*yield*/, prisma_client_1.prisma.activity_logs.create({
                        data: {
                            user_id: user_id,
                            activity_type: "Placed Buy stop limit order.",
                            ip_address: ip_address,
                            device_type: device_type,
                            device_info: device_info
                        }
                    })];
            case 13:
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                        status_code: config_1.config.HTTP_SUCCESS,
                        status: "1",
                        message: "Order Placed Successfully",
                        Data: [responseData]
                    })];
            case 14:
                e_3 = _a.sent();
                console.log(e_3);
                if (e_3 === "Stop price would trigger immediately.") {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: "0",
                            message: "Stop price must be greater then market price."
                        })];
                }
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_3, Data: [] })];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.placeBuyStopLimit = placeBuyStopLimit;
// Key Validations for SELL Take Profit Order:
// Stop price > Current market price
// Stop price > Limit price (already handled in your code)
var placeSellStopLimit = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody, user_id, pair_id, base_volume, limit_price, stop_price, ip_address, device_type, device_info, side, getPairData, pairDecimal, pairSymbol, minBaseVolume, maxBaseVolume, base_asset_id, currentMarketPrice, ordertype, userAssetBalance, userBalance, validateBaseeVolume, base_quantity, OrderId, options, orderResponse, binanceError_4, orderData, responseData, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 14, , 15]);
                reqBody = req.body;
                user_id = reqBody.user_id, pair_id = reqBody.pair_id, base_volume = reqBody.base_volume, limit_price = reqBody.limit_price, stop_price = reqBody.stop_price, ip_address = reqBody.ip_address, device_type = reqBody.device_type, device_info = reqBody.device_info;
                side = "SELL";
                return [4 /*yield*/, prisma_client_1.prisma.crypto_pair.findMany({
                        where: {
                            pair_id: pair_id
                        },
                        select: {
                            base_asset_id: true,
                            quote_asset_id: true,
                            pair_id: true,
                            pair_symbol: true,
                            current_price: true,
                            min_quote_qty: true,
                            min_base_qty: true,
                            max_base_qty: true,
                            max_quote_qty: true,
                            trade_fee: true,
                            quantity_decimal: true,
                            price_decimal: true,
                            status: true
                        }
                    })];
            case 1:
                getPairData = _a.sent();
                if (!getPairData.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_BAD_REQUEST).send({
                            status_code: config_1.config.HTTP_BAD_REQUEST,
                            status: "3",
                            message: "Invalid pair id"
                        })];
                }
                pairDecimal = getPairData[0].quantity_decimal;
                pairSymbol = getPairData[0].pair_symbol;
                minBaseVolume = getPairData[0].min_base_qty;
                maxBaseVolume = getPairData[0].max_base_qty;
                base_asset_id = getPairData[0].base_asset_id;
                return [4 /*yield*/, client.symbolPriceTicker({ symbol: pairSymbol })];
            case 2:
                currentMarketPrice = _a.sent();
                ordertype = void 0;
                if (stop_price > currentMarketPrice.price) {
                    ordertype = "TAKE_PROFIT_LIMIT";
                }
                else {
                    ordertype = 'STOP_LOSS_LIMIT';
                }
                return [4 /*yield*/, prisma_client_1.prisma.balances.findMany({
                        where: {
                            user_id: user_id,
                            currency_id: base_asset_id
                        },
                        select: {
                            current_balance: true
                        }
                    })];
            case 3:
                userAssetBalance = _a.sent();
                if (!userAssetBalance.length) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "User balance not found"
                        })];
                }
                userBalance = userAssetBalance[0].current_balance;
                if (Number(userBalance) < Number(base_volume)) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Sorry, your quote balance is insufficient."
                        })];
                }
                validateBaseeVolume = joi_1["default"].object({
                    base_volume: joi_1["default"].number()
                        .precision(pairDecimal)
                        .min(minBaseVolume)
                        .max(maxBaseVolume)
                        .required()
                }).validate({ base_volume: base_volume });
                if (validateBaseeVolume.error) {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: 0,
                            message: "Base volume must be greater then or equal to ".concat(minBaseVolume, " and less then or equal to ").concat(minBaseVolume)
                        })];
                }
                base_quantity = Number(Number(base_volume).toFixed(pairDecimal));
                OrderId = (0, generator_1.GenerateUniqueID)(10, (0, crypto_1.randomUUID)(), "".concat(user_id, "-"));
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.create({
                        data: {
                            user_id: user_id,
                            pair_id: pair_id,
                            type: side,
                            base_quantity: base_quantity,
                            quote_quantity: base_quantity * limit_price,
                            order_price: limit_price,
                            executed_base_quantity: 0,
                            executed_quote_quantity: 0,
                            stop_limit_price: stop_price,
                            oco_stop_limit_price: null,
                            order_id: OrderId,
                            order_type: ordertype,
                            device: null
                        }
                    })];
            case 4:
                _a.sent();
                options = {
                    quantity: base_quantity,
                    price: limit_price,
                    stopPrice: stop_price,
                    newClientOrderId: OrderId,
                    timeInForce: connector_typescript_1.TimeInForce.GTC,
                    recvWindow: 5000,
                    timestamp: Date.now()
                };
                orderResponse = void 0;
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 9]);
                return [4 /*yield*/, client.newOrder(pairSymbol, (0, constants_1.getSide)(side), (0, constants_1.getOrderType)(ordertype), options)];
            case 6:
                orderResponse = _a.sent();
                return [3 /*break*/, 9];
            case 7:
                binanceError_4 = _a.sent();
                console.error("Binance Order Placement Error:", binanceError_4.message || binanceError_4);
                // Update the database to mark the order as failed
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                        data: {
                            status: "FAILED",
                            response: binanceError_4.message || binanceError_4
                        },
                        where: {
                            order_id: OrderId
                        }
                    })];
            case 8:
                // Update the database to mark the order as failed
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SERVER_ERROR).send({
                        status_code: config_1.config.HTTP_SERVER_ERROR,
                        status: false,
                        message: "Order failed to place."
                    })];
            case 9: 
            //sleep for 5 seconds
            return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 10:
                //sleep for 5 seconds
                _a.sent();
                return [4 /*yield*/, client.getOrder(pairSymbol, {
                        orderId: orderResponse.orderId
                    })];
            case 11:
                orderData = _a.sent();
                return [4 /*yield*/, prisma_client_1.prisma.$transaction([
                        prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                            data: {
                                order_price: orderData.price,
                                base_quantity: orderData.origQty,
                                api_order_id: orderData.orderId.toString(),
                                executed_base_quantity: orderData.executedQty,
                                executed_quote_quantity: orderData.cummulativeQuoteQty,
                                status: orderData.status
                            },
                            where: {
                                order_id: orderData.clientOrderId
                            }
                        }),
                        prisma_client_1.prisma.buy_sell_order_response.create({
                            data: {
                                order_id: orderData.clientOrderId,
                                api_order_id: orderData.orderId.toString(),
                                response: JSON.stringify(orderResponse)
                            }
                        }),
                    ])];
            case 12:
                _a.sent();
                responseData = {
                    order_id: orderData.clientOrderId,
                    base_quantity: orderData.origQty,
                    quote_quantity: orderData.cummulativeQuoteQty,
                    order_price: orderData.price,
                    type: orderData.side,
                    order_type: orderData.type,
                    executed_base_quantity: orderData.executedQty,
                    executed_quote_quantity: orderData.cummulativeQuoteQty,
                    status: orderData.status,
                    created_at: orderData.time
                };
                return [4 /*yield*/, prisma_client_1.prisma.activity_logs.create({
                        data: {
                            user_id: user_id,
                            activity_type: "Placed sell stop limit order",
                            ip_address: ip_address,
                            device_type: device_type,
                            device_info: device_info
                        }
                    })];
            case 13:
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                        status_code: config_1.config.HTTP_SUCCESS,
                        status: "1",
                        message: "Order Placed Successfully",
                        Data: [responseData]
                    })];
            case 14:
                e_4 = _a.sent();
                console.log(e_4);
                if (e_4 === "Stop price would trigger immediately.") {
                    return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                            status_code: config_1.config.HTTP_SUCCESS,
                            status: "0",
                            message: "Stop price must be greater then market price."
                        })];
                }
                // await prisma.$transaction.rollback();
                // throw e;
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_4, Data: [] })];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.placeSellStopLimit = placeSellStopLimit;
var cancelOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reqBody, user_id, order_id, pair_id, ip_address, device_type, device_info, getPairData, order_type, pair_data, symbol, base_asset_id, quote_asset_id, orderData, origQty, executedQty, price, remainingQty, amountToUnlock, amountToUnlock, responseData, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                reqBody = req.body;
                user_id = reqBody.user_id, order_id = reqBody.order_id, pair_id = reqBody.pair_id, ip_address = reqBody.ip_address, device_type = reqBody.device_type, device_info = reqBody.device_info;
                console.log(reqBody);
                if (!user_id || !pair_id || !order_id || !ip_address || !device_type || !device_info) {
                    return [2 /*return*/, res.status(400).send({
                            status_code: 400,
                            status: "0",
                            message: "Please provide all fields.",
                            Data: []
                        })];
                }
                console.log(1);
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.findFirst({
                        where: {
                            order_id: order_id,
                            status: {
                                "in": ["NEW", "PARTIALLY_FILLED", "OPEN"]
                            }
                        },
                        select: {
                            status: true,
                            type: true
                        }
                    })];
            case 1:
                getPairData = _a.sent();
                if (!getPairData) {
                    return [2 /*return*/, res.status(400).send({
                            status_code: 400,
                            status: "0",
                            message: "Invalid Order Id or Order Already Cancelled",
                            Data: []
                        })];
                }
                order_type = getPairData.type;
                return [4 /*yield*/, prisma_client_1.prisma.crypto_pair.findFirst({
                        where: {
                            pair_id: pair_id
                        },
                        select: {
                            pair_symbol: true,
                            base_asset_id: true,
                            quote_asset_id: true
                        }
                    })];
            case 2:
                pair_data = _a.sent();
                if (!pair_data) {
                    return [2 /*return*/, res.status(400).send({
                            status_code: 400,
                            status: "0",
                            message: "Invalid Pair Id",
                            Data: []
                        })];
                }
                symbol = pair_data.pair_symbol;
                base_asset_id = pair_data.base_asset_id;
                quote_asset_id = pair_data.quote_asset_id;
                return [4 /*yield*/, client.cancelOrder(symbol, {
                        origClientOrderId: order_id
                    })];
            case 3:
                orderData = _a.sent();
                if (!(orderData.status === "CANCELED")) return [3 /*break*/, 10];
                origQty = orderData.origQty;
                executedQty = orderData.executedQty;
                price = orderData.price;
                remainingQty = Number(origQty) - Number(executedQty);
                if (!(order_type === "BUY")) return [3 /*break*/, 5];
                amountToUnlock = Number(price) * remainingQty;
                return [4 /*yield*/, prisma_client_1.prisma.balances.update({
                        data: {
                            current_balance: {
                                increment: Number(amountToUnlock)
                            },
                            locked_balance: {
                                decrement: Number(amountToUnlock)
                            }
                        },
                        where: {
                            user_id_currency_id: {
                                user_id: user_id,
                                currency_id: quote_asset_id
                            }
                        }
                    })];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                if (!(order_type === "SELL")) return [3 /*break*/, 7];
                amountToUnlock = remainingQty;
                return [4 /*yield*/, prisma_client_1.prisma.balances.update({
                        data: {
                            current_balance: {
                                increment: Number(amountToUnlock)
                            },
                            locked_balance: {
                                decrement: Number(amountToUnlock)
                            }
                        },
                        where: {
                            user_id_currency_id: {
                                user_id: user_id,
                                currency_id: base_asset_id
                            }
                        }
                    })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [4 /*yield*/, prisma_client_1.prisma.$transaction([
                    prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                        data: {
                            status: "CANCELLED",
                            date_time: orderData.transactTime,
                            cancelled_date_time: orderData.transactTime
                        },
                        where: {
                            order_id: order_id
                        }
                    }),
                    prisma_client_1.prisma.buy_sell_order_response.create({
                        data: {
                            order_id: order_id,
                            response: JSON.stringify(orderData)
                        }
                    }),
                ])];
            case 8:
                _a.sent();
                responseData = {
                    order_id: orderData.origClientOrderId,
                    base_quantity: orderData.origQty,
                    quote_quantity: orderData.cummulativeQuoteQty,
                    order_price: orderData.price,
                    type: orderData.side,
                    order_type: orderData.type,
                    executed_base_quantity: orderData.executedQty,
                    executed_quote_quantity: orderData.cummulativeQuoteQty,
                    status: orderData.status,
                    created_at: orderData.transactTime
                };
                return [4 /*yield*/, prisma_client_1.prisma.activity_logs.create({
                        data: {
                            user_id: user_id,
                            activity_type: "cancelled ".concat(order_type, " order"),
                            ip_address: ip_address,
                            device_type: device_type,
                            device_info: device_info
                        }
                    })];
            case 9:
                _a.sent();
                return [2 /*return*/, res.status(config_1.config.HTTP_SUCCESS).send({
                        status_code: config_1.config.HTTP_SUCCESS,
                        status: "1",
                        message: "Order Canceled Successfully",
                        Data: [responseData]
                    })];
            case 10: return [3 /*break*/, 12];
            case 11:
                e_5 = _a.sent();
                console.log("error", e_5);
                // await prisma.$transaction.rollback();
                // throw e;
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_5, Data: [] })];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.cancelOrder = cancelOrder;
function formatDate(timestamp) {
    var date = new Date(Number(timestamp)); // Convert to Date
    var istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (+5:30)
    var istDate = new Date(date.getTime() + istOffset); // Add offset
    var yyyy = istDate.getFullYear();
    var mm = String(istDate.getMonth() + 1).padStart(2, "0");
    var dd = String(istDate.getDate()).padStart(2, "0");
    var hh = String(istDate.getHours()).padStart(2, "0");
    var min = String(istDate.getMinutes()).padStart(2, "0");
    var ss = String(istDate.getSeconds()).padStart(2, "0");
    return "".concat(yyyy, "-").concat(mm, "-").concat(dd, " ").concat(hh, ":").concat(min, ":").concat(ss);
}
exports.formatDate = formatDate;
var get_open_orders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, pair_id, data, responseFormat_1, e_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, user_id = _a.user_id, pair_id = _a.pair_id;
                if (!user_id) {
                    return [2 /*return*/, res
                            .status(400)
                            .send({ status_code: 400, status: "3", msg: "provide user id" })];
                }
                if (!pair_id) {
                    return [2 /*return*/, res
                            .status(400)
                            .send({ status_code: 400, status: "3", msg: "provide pair id" })];
                }
                console.log(user_id, pair_id);
                return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.findMany({
                        where: {
                            user_id: user_id,
                            pair_id: pair_id,
                            status: { "in": ["OPEN", "NEW", "PARTIALLY_FILLED"] }
                        },
                        orderBy: {
                            // assuming you want to sort by a specific field, e.g. "created_at"
                            created_at: "desc"
                        }
                    })];
            case 1:
                data = _b.sent();
                responseFormat_1 = [];
                data.forEach(function (item) {
                    responseFormat_1.push({
                        user_id: item.user_id,
                        order_id: item.order_id,
                        pair_id: item.pair_id,
                        type: item.type,
                        order_type: item.order_type,
                        base_quantity: item.base_quantity,
                        quote_quantity: item.quote_quantity,
                        order_price: item.order_price,
                        stop_limit_price: item.stop_limit_price,
                        oco_stop_limit_price: item.oco_stop_limit_price,
                        executed_base_quantity: item.executed_base_quantity,
                        executed_quote_quantity: item.executed_quote_quantity,
                        status: item.status,
                        created_at: item.created_at,
                        updated_at: item.updated_at
                    });
                });
                return [2 /*return*/, res.status(200).send({
                        status_code: 200,
                        status: "1",
                        message: "Open orders of all user.",
                        data: responseFormat_1
                    })];
            case 2:
                e_6 = _b.sent();
                console.log('husaain zindabad.');
                console.log(e_6);
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_6, Data: [] })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_open_orders = get_open_orders;
var get_pair_data = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, pair_id, data, e_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, user_id = _a.user_id, pair_id = _a.pair_id;
                if (!user_id) {
                    return [2 /*return*/, res
                            .status(400)
                            .send({ status_code: 400, status: "3", msg: "provide user id" })];
                }
                if (!pair_id) {
                    return [2 /*return*/, res
                            .status(400)
                            .send({ status_code: 400, status: "3", msg: "provide pair id" })];
                }
                console.log(user_id, pair_id);
                return [4 /*yield*/, prisma_client_1.prisma.crypto_pair.findMany({
                        where: {
                            pair_id: pair_id
                        },
                        orderBy: {
                            // assuming you want to sort by a specific field, e.g. "created_at"
                            created_at: "desc"
                        }
                    })];
            case 1:
                data = _b.sent();
                console.log(data);
                return [2 /*return*/, res.status(200).send({
                        status_code: 200,
                        status: "1",
                        message: "Open orders of all user.",
                        data: data
                    })];
            case 2:
                e_7 = _b.sent();
                console.log(e_7);
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_7, Data: [] })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get_pair_data = get_pair_data;
var rawQuery = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, OrderId, query, result, e_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                data = req.body.data;
                console.log(data);
                OrderId = (0, generator_1.GenerateUniqueID)(16, (0, crypto_1.randomUUID)(), "");
                query = "INSERT INTO crypto_pair (\n      pair_id,\n      base_asset_id,\n      quote_asset_id,\n      pair_symbol,\n      current_price,\n      min_base_qty,\n      max_base_qty,\n      min_quote_qty,\n      max_quote_qty,\n      trade_fee,\n      quantity_decimal,\n      price_decimal,\n      status,\n      created_at\n    )\n    SELECT\n      ".concat(OrderId, ",\n      c.currency_id,\n      (SELECT currency_id FROM currencies WHERE symbol = 'USDT'),\n      c.symbol + 'USDT',\n      c.usdtprice,\n      0.001,\n      1000,\n      1,\n      1000,\n      0.1,\n      c.qty_decimal,\n      c.price_decimal,\n      c.status,\n      DATE.now()\n    FROM\n      currencies c\n    WHERE\n      c.symbol != 'USDT'");
                return [4 /*yield*/, prisma_client_1.prisma.$queryRawUnsafe(query)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(200).send({
                        status_code: 200,
                        status: true,
                        msg: "Raw Query",
                        Data: [result]
                    })];
            case 2:
                e_8 = _a.sent();
                return [2 /*return*/, res
                        .status(500)
                        .send({ status_code: 500, status: false, msg: e_8, Data: [] })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.rawQuery = rawQuery;
// export const placeSellOrder = async (req: any, res: any) => {
//   try {
//     const reqBody = req.body;
//     const {
//       user_id,
//       pair_id,
//       base_volume,
//       limit_price,
//       order_type,
//       stop_limit_price,
//     } = reqBody;
//     const getPairData = await prisma.crypto_pair.findMany({
//       where: {
//         pair_id: pair_id,
//       },
//       select: {
//         base_asset_id: true,
//         quote_asset_id: true,
//         pair_id: true,
//         pair_symbol: true,
//         current_price: true,
//         min_quote_qty: true,
//         min_base_qty: true,
//         max_base_qty: true,
//         max_quote_qty: true,
//         trade_fee: true,
//         quantity_decimal: true,
//         price_decimal: true,
//         status: true,
//       },
//     });
//     const side = "SELL";
//     if (!getPairData.length) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: "Invalid pair id",
//       });
//     }
//     // console.log('getpairdata',getPairData)
//     const pairDecimal = getPairData[0].price_decimal;
//     const pairSymbol = getPairData[0].pair_symbol;
//     const minBaseVolume = getPairData[0].min_base_qty;
//     const maxBaseVolume = getPairData[0].max_base_qty;
//     const base_asset_id = getPairData[0].base_asset_id;
//     //get user balance from balances table
//     const userAssetBalance = await prisma.balances.findMany({
//       where: {
//         user_id: user_id,
//         currency_id: base_asset_id,
//       },
//       select: {
//         current_balance: true,
//       },
//     });
//     if (!userAssetBalance.length) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: "User balance not found",
//       });
//     }
//     const userBalance = userAssetBalance[0].current_balance;
//     if (Number(userBalance) < Number(base_volume)) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: "Sorry, your quote balance is insufficient.",
//       });
//     }
//     const validateQuoteVolume = Joi.object({
//       base_volume: Joi.number()
//         .precision(pairDecimal)
//         .min(minBaseVolume)
//         .max(maxBaseVolume)
//         .required(),
//     }).validate({ base_volume: base_volume });
//     if (validateQuoteVolume.error) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: `Quote volume must be greater then or equal to ${minBaseVolume}`,
//       });
//     }
//     const validateBaseeVolume = Joi.object({
//       base_volume: Joi.number()
//         .precision(pairDecimal)
//         .min(minBaseVolume)
//         .max(maxBaseVolume)
//         .required(),
//     }).validate({ base_volume: base_volume });
//     if (validateBaseeVolume.error) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: `Base volume must be greater then or equal to ${minBaseVolume} and less then or equal to ${minBaseVolume}`,
//       });
//     }
//     const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//     //TDS AND FEES Calculation
//     const usdtFees = (base_volume * Number(fees?.buy_fees)) / 100;
//     const usdtTds = ((base_volume - usdtFees) * Number(fees?.tds)) / 100;
//     const baseAfterFees = Number(base_volume - (usdtFees + usdtTds));
//     const quoteAmountAfterFees = Number(
//       (baseAfterFees * limit_price).toFixed(pairDecimal)
//     );
//     const baseAmountAfterFees = Number(baseAfterFees.toFixed(pairDecimal));
//     console.log("baseAmountAfterFees", baseAmountAfterFees);
//     console.log("quoteAmountAfterFees", quoteAmountAfterFees);
//     console.log("usdtFees", usdtFees);
//     console.log("usdtTds", usdtTds);
//     const OrderId = GenerateUniqueID(25, randomUUID(), "TRD");
//     await prisma.$transaction([
//        prisma.buy_sell_pro_limit_open.create({
//         data: {
//           user_id: user_id,
//           pair_id: pair_id,
//           type: side,
//           base_quantity: base_volume,
//           quote_quantity: quoteAmountAfterFees,
//           order_price: limit_price,
//           executed_quantity: 0,
//           stop_limit_price: stop_limit_price,
//           oco_stop_limit_price: null,
//           tds: usdtTds,
//           fees: usdtFees,
//           final_amount: quoteAmountAfterFees,
//           order_id: OrderId,
//           order_type: order_type,
//           buy_sell_fees: fees?.buy_fees,
//           device: null,
//         },
//       }),
//       prisma.balances.update({
//        where: {
//          user_id_currency_id: {
//            user_id: user_id,
//            currency_id: base_asset_id,
//          },
//        },
//         data: {
//           current_balance: {
//             decrement: base_volume,
//           },
//           locked_balance: {
//             increment: base_volume,
//           },
//         },
//       })
//     ]);
//     let options;
//     if (order_type == "LIMIT") {
//       options = {
//         price: limit_price,
//         quantity: baseAmountAfterFees,
//         timeInForce: TimeInForce.GTC,
//         newClientOrderId: OrderId,
//       };
//     }
//     if (order_type == "MARKET") {
//       options = {
//         quantity: baseAmountAfterFees,
//         newClientOrderId: OrderId,
//       };
//     }
//     //Place new order to Binance.
//     const orderData = await client.newOrder(
//       pairSymbol,
//       getSide(side),
//       getOrderType(order_type),
//       options
//     );
//     const status = orderData.status;
//     const OrderResponse = orderData
//     await prisma.$transaction([
//        prisma.buy_sell_pro_limit_open.update({
//         data: {
//           order_id: orderData.clientOrderId,//
//           api_order_id: orderData.orderId.toString(),//
//           status: status,
//           date_time: orderData.transactTime,
//         },
//         where: {
//           order_id: orderData.clientOrderId,
//         }
//       }),
//       prisma.buy_sell_order_response.create({
//         data: {
//           order_id: orderData.clientOrderId,
//           api_order_id: (orderData.orderId).toString(),
//           response: JSON.stringify(OrderResponse),
//         },
//       })
//     ]);
//     return res.status(200).send({
//       status_code: 200,
//       status: true,
//       msg: "SellOrder Placed Successfully",
//       Data: [orderData],
//     });
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .send({ status_code: 500, status: false, msg: e, Data: [] });
//   }
// };
// export const get_open_orders = async (req:any, res:any) => {
//   try {
//     const { user_id, pair_id } = req.query;
//     console.log(user_id, pair_id);
//     const data = await prisma.buy_sell_pro_limit_open.findMany({
//       where: {
//         user_id: user_id,
//         pair_id: pair_id,
//         status: "OPEN"
//       }
//     });
//     return res.status(200).send({
//       status_code: 200,
//       status: true,
//       msg: "Open orders of all user.",
//       Data: [data],
//     });
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .send({ status_code: 500, status: false, msg: e, Data: [] });
//   }
// };
// module.exports.buy_asset_pro = async (req, res) => {
//   // Process - 1) Check user Fiat balance 2) Lock user fiat balance 3)Insert order into open orders
//   try {
//     const {
//       user_id,
//       pair_id,
//       quote_volume,
//       base_price_rate,
//       order_type,
//       stop_limit_price,
//       ip,
//       coordinate
//     } = req.body;
//     const validateQuoteVolume = Joi.object({
//       quote_volume : Joi.number().min(0.0000000001).required(),
//     }).validate({quote_volume:quote_volume});
//     if (validateQuoteVolume.error) {
//     return  res.status(config).send({
//         status_code: config.HTTP_SUCCESS,
//         status : false,
//         msg: 'Quote volume must be greater then or equal to 0.0000000001'
//       });
//     }
//     // "market_order",  // stop_limit_order  // limit_order
//     if (
//       order_type != "market_order" &&
//       order_type != "limit_order" &&
//       order_type != "stop_limit_order"
//     ) {
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.invalid_ordertype,
//         status: false,
//       });
//     }
//     const user_active = await db.Get_Where_Universal_Data('status','tbl_user_registration_master' , {cuser_id_btx:user_id})
//     if (!user_active || user_active.length==0 || user_active == undefined){
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.user_not_found,
//         status: false
//       });
//     }
//     if(user_active.length || user_active){
//       const status = user_active[0].status
//       if(status == null){
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.database_error,
//           status: false
//         });
//       }
//       const checkStatus =configValidate.checkStatus(status)
//       if(checkStatus != 1){
//         return res.status(config.HTTP_SUCCESS).send({
//           status_code: config.HTTP_SUCCESS,
//           status: false,
//           msg:checkStatus
//         });
//       }
//     }
//     var pair_type;
//     var base_asset_id;
//     var quote_asset_id;
//     var pair_symbol;
//     var base_volume;
//     var at_price;
//     const pair_data = await db.Get_Where_Universal_Data(
//       "base_asset_id_btx,quote_asset_id_btx,pair_symbol_btx",
//       "tbl_registered_asset_pair_master",
//       { pair_id_btx: pair_id }
//     );
//     if (pair_data.length) {
//       base_asset_id = pair_data[0].base_asset_id_btx;
//       quote_asset_id = pair_data[0].quote_asset_id_btx;
//       pair_symbol = pair_data[0].pair_symbol_btx;
//       pair_type = "crypto_pair";
//     }
//     if (!pair_data || pair_data.length==0) {
//       const pair_data2 = await db.Get_Where_Universal_Data(
//         "base_asset_id,quote_asset_id,pair_symbol_btx",
//         "tbl_resigtered_asset_fiat_pair_master",
//         { pair_id: pair_id }
//       );
//       if (pair_data2.length) {
//         base_asset_id = pair_data2[0].base_asset_id;
//         quote_asset_id = pair_data2[0].quote_asset_id;
//         pair_symbol = pair_data2[0].pair_symbol_btx;
//         pair_type = "fiat_pair";
//         console.log(quote_asset_id);
//       } else {
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.pair_not_registered,
//           status: false
//         });
//       }
//     }
//     const pair_rate_data = await db.Get_Where_Universal_Data(
//       "current_price",
//       "tbl_all_assets_portfolio_data",
//       { pair_id: pair_id }
//     );
//     if (!pair_rate_data || pair_rate_data.length==0){
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.curret_rate_not_fetched,
//         status: false
//       });
//     }
//     const pair_rate = pair_rate_data[0].current_price;
//     // if (order_type == "stop_limit_order") {
//     // console.log(base_price_rate , pair_rate , stop_limit_price);
//     //   if (base_price_rate > pair_rate) {
//     //     return res.status(config.HTTP_SUCCESS).send({
//     //       status_code: config.HTTP_SUCCESS,
//     //       status: false,
//     //       msg: `When the traded price is equal to or greater than STOP PRICE:${stop_limit_price}
//     //     then place a BUY order at LIMIT PRICE:${base_price_rate}.`,
//     //     });
//     //   }
//     //   if (stop_limit_price < pair_rate) {
//     //     return res.status(config.HTTP_SUCCESS).send({
//     //       status_code: config.HTTP_SUCCESS,
//     //       status: false,
//     //       msg: `When the traded price is equal to or greater than STOP PRICE:${stop_limit_price}
//     //     then place a BUY order at LIMIT PRICE:${base_price_rate}.`,
//     //     });
//     //   }
//     // }
//       const user_fiat_balance_data = await db.Get_Where_Universal_Data(
//         "current_balance_btx",
//         "tbl_user_fiat_wallet_master",
//         { cuser_id_btx: user_id, fiat_asset_id_btx: quote_asset_id }
//       );
//       const user_balance = user_fiat_balance_data[0].current_balance_btx;
//       if (Number(user_balance) < Number(quote_volume)) {
//         return res.status(config.HTTP_SUCCESS).send({
//           status_code: config.HTTP_SUCCESS,
//           status: false,
//           msg: "Sorry, your quote balance is insufficient.",
//         });
//       }
//     if (pair_type == "crypto_pair") {
//       const user_asset_balance_data = await db.Get_Where_Universal_Data(
//         "current_balance_btx",
//         "tbl_user_crypto_assets_balance_details",
//         { cuser_id_btx: user_id, asset_id_btx: quote_asset_id }
//       );
//       if (!user_asset_balance_data || user_asset_balance_data.length==0){
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.user_not_found,
//           status: false
//         });
//       }
//       const user_balance = user_asset_balance_data[0].current_balance_btx;
//       if (Number(user_balance) < Number(quote_volume)) {
//         return res.status(config.HTTP_SUCCESS).send({
//           status_code: config.HTTP_SUCCESS,
//           status: false,
//           msg: "Sorry, your quote balance is insufficient.",
//         });
//       }
//     }
//     if (order_type == "market_order") {
//       at_price = pair_rate;
//       base_volume = quote_volume / pair_rate;
//     }
//     if (order_type == "limit_order" || order_type == "stop_limit_order") {
//       at_price = base_price_rate;
//       base_volume = quote_volume / base_price_rate;
//     }
//     // Generating Unique Order_id for each order..
//     const order_id = GenerateID.GenerateID(20, uuid.v1(), "PO").toUpperCase();
//     // DataBase call to Start mysql transaction to get user data and update balance of User.
//     const DataUpdated = await db.Create_Update_Buy_data_PRO(
//       user_id,
//       order_id,
//       pair_id,
//       pair_symbol,
//       base_asset_id,
//       quote_asset_id,
//       "BUY",
//       order_type,
//       quote_volume,
//       base_volume.toFixed(4),
//       at_price,
//       stop_limit_price,
//       Date.now(),
//       pair_type
//     );
//     if (DataUpdated == "No Data") {
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.HTTP_BAD_REQUEST,
//         status: false
//       });
//     } else if (DataUpdated.affectedRows != 0) {
//       const Data = {
//         user_id: user_id,
//         order_id: order_id,
//         asset_name: base_asset_id,
//         base_value: base_volume.toFixed(4),
//         quote_value: quote_volume,
//         buying_rate: at_price,
//       };
//       const access_log_data = {
//         cuser_id_btx: user_id,
//         module_name_btx: "Trade",
//         action_btx: "Trade Buy pro",
//         ip_address_btx: ip,
//         co_ordinates: coordinate,
//         datetime: Date.now(),
//         c_by: user_id,
//       };
//       await db.Create_Universal_Data("tbl_acess_log", access_log_data);
//       // After Orer Successfully Placing Sending Proper Response
//       return res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
//         status_code: config.HTTP_SUCCESSFULLY_CREATED,
//         status: true,
//         Data: [Data],
//         msg: "Buy order placed successfully!"
//       });
//     }
//   } catch (err) {
//     return res.status(config.HTTP_SERVER_ERROR).send({
//       status_code: config.HTTP_SERVER_ERROR,
//       status: false,
//       msg: err.message,
//     });
//   }
// };
// interface BuyAssetProRequest {
//     user_id: string;
//     pair_id: string;
//     quote_volume: number;
//     base_price_rate: number;
//     order_type: string;
//     stop_limit_price: number;
//     ip: string;
//     coordinate: string;
//   }
//   interface BuyAssetProResponse {
//     status_code: number;
//     status: boolean;
//     msg: string;
//     Data?: any[];
//   }
//   export const  buyAssetPro = async (req: Request, res: Response)=> {
//     try {
//       const {
//         user_id,
//         pair_id,
//         quote_volume,
//         order_type,
//         stop_limit_price,
//         ip,
//         coordinate,
//       } = req.body;
//       const validateQuoteVolume = Joi.object({
//         quote_volume: Joi.number().min(0.0000000001).required(),
//       }).validate({ quote_volume });
//       if (validateQuoteVolume.error) {
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Quote volume must be greater then or equal to 0.0000000001',
//         });
//       }
//       if (
//         order_type !== 'market_order' &&
//         order_type !== 'limit_order' &&
//         order_type !== 'stop_limit_order'
//       ) {
//        return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid order type',
//         });
//       }
//       const user_active = await db.Get_Where_Universal_Data('status', 'tbl_user_registration_master', { cuser_id_btx: user_id });
//       if (!user_active || user_active.length === 0 || user_active === undefined) {
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid user id',
//         })
//       }
//       if (user_active.length || user_active) {
//         const status = user_active[0].status;
//         if (status === null) {
//          return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid user id',
//          })
//         }
//         const checkStatus = configValidate.checkStatus(status);
//         if (checkStatus !== 1) {
//           return res.status(config.HTTP_BAD_REQUEST).send({
//             status_code: config.HTTP_BAD_REQUEST,
//             status: false,
//             msg: checkStatus
//           })
//         }
//       }
//       let base_asset_id;
//       let quote_asset_id;
//       let pair_symbol;
//       let base_volume;
//       let at_price;
//       const pair_data = await db.Get_Where_Universal_Data(
//         'base_asset_id_btx,quote_asset_id_btx,pair_symbol_btx',
//         'tbl_registered_asset_pair_master',
//         { pair_id_btx: pair_id }
//       );
//       if (pair_data.length) {
//         base_asset_id = pair_data[0].base_asset_id_btx;
//         quote_asset_id = pair_data[0].quote_asset_id_btx;
//         pair_symbol = pair_data[0].pair_symbol_btx;
//       }
//       if (!pair_data || pair_data.length === 0) {
//           return res.status(config.HTTP_BAD_REQUEST).send({
//             status_code: config.HTTP_BAD_REQUEST,
//             status: false,
//             msg: 'Invalid pair id',
//           });
//       }
//         const user_asset_balance_data = await db.Get_Where_Universal_Data(
//           'current_balance_btx',
//           'tbl_user_crypto_assets_balance_details',
//           { cuser_id_btx: user_id, asset_id_btx: quote_asset_id }
//         );
//         if (!user_asset_balance_data || user_asset_balance_data.length === 0) {
//          return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid user id',
//          })
//         }
//         const user_balance = user_asset_balance_data[0].current_balance_btx;
//         if (Number(user_balance) < Number(quote_volume)) {
//           return res.status(config.HTTP_BAD_REQUEST).send({
//             status_code: config.HTTP_BAD_REQUEST,
//             status: false,
//             msg: 'Insufficient balance',
//           });
//         }
//       const order_id = GenerateID.GenerateID(20, uuid(), 'PO').toUpperCase();
//       const DataUpdated = await db.Create_Update_Buy_data_PRO(
//         user_id,
//         order_id,
//         pair_id,
//         pair_symbol,
//         base_asset_id,
//         quote_asset_id,
//         'BUY',
//         order_type,
//         quote_volume,
//         base_volume.toFixed(4),
//         at_price,
//         stop_limit_price,
//         Date.now()
//       );
//       if (DataUpdated === 'No Data') {
//         return res.status(config.HTTP_SERVER_ERROR).send({
//           status_code: config.HTTP_SERVER_ERROR,
//           status: false,
//           msg: 'Something went wrong!',
//         })
//       } else if (DataUpdated.affectedRows !== 0) {
//         const Data = {
//           user_id: user_id,
//           order_id: order_id,
//           asset_name: base_asset_id,
//           base_value: base_volume.toFixed(4),
//           quote_value: quote_volume,
//           buying_rate: at_price,
//         };
//          res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
//             status_code: config.HTTP_SUCCESSFULLY_CREATED,
//             status: true,
//             Data: [Data],
//             msg: 'Buy order placed successfully!',
//           });
//       }
//     } catch (err) {
//       return res.status(config.HTTP_SERVER_ERROR).send({
//         status_code: config.HTTP_SERVER_ERROR,
//         status: false,
//         msg: err.message,
//       });
//     }
//   };
exports["default"] = {
    // quick_buy,
    buyAssetPro: exports.placeBuyOrder
};
//# sourceMappingURL=controller.js.map