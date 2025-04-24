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
exports.getTradeHistory = exports.getTrades = exports.getWalletFunds = exports.getSymbolFunds = exports.getUserWalletAddress = exports.getAllNetwork = exports.getDepositWithdrawList = exports.getAllCurrenciesBalance = exports.getAvgPriceOrder = exports.getBuySellFees = exports.getAllBuySellOrder = exports.formatDate = exports.generateRandomOrderId = exports.getBuySellBalance = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// import winston from "winston";
const client_1 = require("@prisma/client");
// import { IWalletHistory } from '../types/models.types';
const db_query_1 = require("../model/db_query");
const defaults_1 = __importDefault(require("../config/defaults"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
/*----- Get Buy Sell Balance -----*/
const getBuySellBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { user_id: user_id } = req.body.user;
        const { pair_id } = req.body;
        if (!pair_id) {
            return res.status(400).json({
                status: "3",
                message: "Pair id required",
            });
        }
        if (!user_id) {
            return res.json({
                status: "0",
                message: "You are not authorized or user not present",
            });
        }
        const bal_data = yield (0, db_query_1.get_pair_data)(pair_id, user_id);
        // send fetched data to user
        return res.status(200).json({
            status: "1",
            data: {
                quote_balance: (_a = bal_data[0].quote_asset_balance) !== null && _a !== void 0 ? _a : 0,
                base_balance: (_b = bal_data[0].base_asset_balance) !== null && _b !== void 0 ? _b : 0,
                qty_decimal: bal_data[0].qty_decimal,
                price_decimal: bal_data[0].price_decimal,
                trade_fee: bal_data[0].trade_fee,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.getBuySellBalance = getBuySellBalance;
function generateRandomOrderId() {
    const timestamp = new Date().getTime();
    const randomPart = Math.floor(Math.random() * 1000000);
    return `${timestamp}${randomPart}`;
}
exports.generateRandomOrderId = generateRandomOrderId;
// function mapOrderType(orderType: string): buy_sell_order_type {
//   switch (orderType.toUpperCase()) {
//     case "LIMIT":
//       return buy_sell_order_type.LIMIT;
//     case "MARKET":
//       return buy_sell_order_type.MARKET;
//     case "STOP_LOSS_LIMIT":
//       return buy_sell_order_type.STOP_LOSS_LIMIT;
//     case "TAKE_PROFIT_LIMIT":
//       return buy_sell_order_type.TAKE_PROFIT_LIMIT;
//     case "OCO":
//       return buy_sell_order_type.OCO;
//     case "STOP_LIMIT":
//       return buy_sell_order_type.STOP_LIMIT;
//     default:
//       return buy_sell_order_type.LIMIT;
//   }
// }
/*----- Add Buy Sell Order -----*/
// export const addBuySellOrder = async (req: Request, res: Response) => {
//   try {
//     const { id: user_id } = req.body.user;
//     const {
//       symbol,
//       base,
//       order_type,
//       limit_price,
//       stop_price,
//       oco_stop_limit_price,
//       quantity,
//       type,
//     } = req.body;
//     const arrayCoinId: ICoinId[] =
//       await prisma.$queryRaw`SELECT id,coin_decimal,qty_decimal,price_decimal,usdtprice from currencies where symbol=${symbol}`;
//     const coin_id = arrayCoinId[0].id;
//     const coin_decimal = arrayCoinId[0].coin_decimal;
//     const qty_decimal = arrayCoinId[0].qty_decimal;
//     const price_decimal = arrayCoinId[0].price_decimal;
//     const usdtPrice = arrayCoinId[0].usdtprice;
//     if (!user_id) {
//       throw new Error("You are not authorized or user is not present");
//     }
//     const orderId = generateRandomOrderId().toString();
//     const mappedOrderType = mapOrderType(order_type.toUpperCase());
//     if (mappedOrderType === "LIMIT") {
//       if (quantity === "" || limit_price === "") {
//         throw new Error("All Fields are required");
//       }
//       if (parseFloat(limit_price) <= 0) {
//         throw new Error("Invalid Limit Price");
//       }
//       if (
//         (typeof quantity != "number" && isNaN(quantity)) ||
//         parseFloat(quantity) <= 0
//       ) {
//         throw new Error("Please enter valid Amount");
//       }
//       if (typeof limit_price != "number" && isNaN(limit_price)) {
//         throw new Error("Please enter valid Limit price");
//       }
//     } else if (mappedOrderType === "MARKET") {
//       if (quantity === "") {
//         throw new Error("All Fields are required");
//       }
//       if (
//         (typeof quantity != "number" && isNaN(quantity)) ||
//         parseFloat(quantity) <= 0
//       ) {
//         throw new Error("Please enter valid Amount");
//       }
//     } else if (mappedOrderType === "STOP_LIMIT") {
//       if (stop_price === "" || quantity === "" || limit_price === "") {
//         throw new Error("All Fields are required");
//       }
//       if (parseFloat(limit_price) <= 0) {
//         throw new Error("Invalid Limit Price");
//       }
//       if (parseFloat(stop_price) <= 0) {
//         throw new Error("Invalid Stop Price");
//       }
//       if (
//         (typeof quantity != "number" && isNaN(quantity)) ||
//         parseFloat(quantity) <= 0
//       ) {
//         throw new Error("Please enter valid Amount");
//       }
//       if (typeof limit_price != "number" && isNaN(limit_price)) {
//         throw new Error("Please enter valid Limit price");
//       }
//       if (typeof stop_price != "number" && isNaN(stop_price)) {
//         throw new Error("Please enter valid Stop price");
//       }
//     }
//     let availCoinBal: Number;
//     let availUsdtBal: Number;
//     const binanceAPIUrlCoinPrice =
//       "https://www.binance.com/api/v3/ticker/price";
//     axios
//       .get(
//         `${binanceAPIUrlCoinPrice}?symbol=${symbol.toUpperCase()}${base.toUpperCase()}`
//       )
//       .then((response) => {
//         useTempCurrCoinPrice(parseFloat(response.data.price));
//       })
//       .catch(() => {
//         useTempCurrCoinPrice(usdtPrice);
//       });
//     async function useTempCurrCoinPrice(temp_curr_coin_price: number) {
//       try {
//         let temp_oco_limit_price: number = parseFloat(oco_stop_limit_price);
//         let temp_stop_price: number = parseFloat(stop_price);
//         let temp_limit_price: number = parseFloat(limit_price);
//         const temp_quantity: number = Number(
//           parseFloat(quantity).toFixed(qty_decimal)
//         );
//         const today_date = new Date(); // Get the current date and time
//         const timestamp = Math.floor(today_date.getTime() / 1000);
//         const side_type = type.toString() === "1" ? "BUY" : "SELL";
//         if (
//           mappedOrderType === "LIMIT" ||
//           mappedOrderType === "MARKET" ||
//           mappedOrderType === "STOP_LIMIT"
//         ) {
//           if (mappedOrderType === "LIMIT") {
//             temp_stop_price = 0;
//             temp_oco_limit_price = 0;
//           } else if (mappedOrderType === "MARKET") {
//             temp_limit_price = temp_curr_coin_price;
//             temp_oco_limit_price = 0;
//             temp_stop_price = 0;
//           } else if (mappedOrderType === "STOP_LIMIT") {
//             temp_oco_limit_price = 0;
//           }
//           const fixedUsdtPrice = temp_limit_price.toFixed(price_decimal);
//           let limitAmount: number =
//             Number(temp_limit_price.toFixed(price_decimal)) * temp_quantity;
//           // If Type is BUY
//           if (side_type === "BUY") {
//             const usdtBal = await prisma.balances.findFirst({
//               where: { user_id: user_id, coin_id: 5 },
//             });
//             // Check if User has USDT Balance or not for BUY
//             if (
//               usdtBal != undefined &&
//               usdtBal.balance != null &&
//               Number(usdtBal?.balance) >= limitAmount
//             ) {
//               const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//               //TDS AND FEES Calculation
//               const usdtFees = (limitAmount * Number(fees?.buy_fees)) / 100;
//               const usdtTds =
//                 ((limitAmount - usdtFees) * Number(fees?.tds)) / 100;
//               const usdtFinalAmt = limitAmount + (usdtFees + usdtTds);
//               if (Number(usdtBal?.balance) < usdtFinalAmt) {
//                 throw new Error("Insufficient Balance");
//               }
//               const response = {
//                 symbol: `${symbol}${base}`,
//                 clientOrderId: orderId,
//                 price: temp_limit_price.toFixed(coin_decimal),
//                 origQty: quantity,
//                 orderId: orderId,
//                 orderListId: -1,
//                 type: mappedOrderType,
//                 side: "BUY",
//                 status: "OPEN",
//                 executedQty: "0",
//               };
//               const response_query = Prisma.sql`
//             INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//             VALUES (${orderId}, ${orderId}, ${response})
//               `;
//               await prisma.$queryRaw(response_query);
//               // Update Balance deduct from usdt balance
//               const bal_query = Prisma.sql`
//                 UPDATE balances SET balance = balance - ${usdtFinalAmt}
//                 WHERE user_id=${user_id} AND coin_id=5;
//               `;
//               await prisma.$queryRaw(bal_query);
//               // Insert to buy sell limit open table
//               await prisma.buy_sell_pro_limit_open.create({
//                 data: {
//                   user_id,
//                   coin_id,
//                   coin_base: base,
//                   type: "BUY",
//                   usdt_price: fixedUsdtPrice,
//                   quantity: temp_quantity,
//                   stop_limit_price: temp_stop_price,
//                   oco_stop_limit_price: temp_oco_limit_price,
//                   amount: limitAmount,
//                   executed_quantity: 0,
//                   tds: usdtTds,
//                   fees: usdtFees,
//                   final_amount: usdtFinalAmt,
//                   order_id: orderId,
//                   order_type: mappedOrderType,
//                   buy_sell_fees: fees?.buy_fees,
//                   date_time: timestamp,
//                 },
//               });
//               const bal_inorder_query = Prisma.sql`
//               INSERT INTO balances_inorder (user_id, coin_id, balances)
//               VALUES (${user_id}, ${coin_id}, ${temp_quantity})
//               ON DUPLICATE KEY UPDATE balances = balances+${temp_quantity}`;
//               await prisma.$queryRaw(bal_inorder_query);
//               const totalUsdtBal = Number(usdtBal?.balance) - usdtFinalAmt;
//               availUsdtBal = totalUsdtBal;
//               const insert_wallet_hist_query = Prisma.sql`
//               INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//               VALUES
//               (
//                 ${user_id},
//                 5,
//                 'dr',
//                 ${usdtBal.balance},
//                 ${totalUsdtBal},
//                 ${usdtFinalAmt},
//                 'BUY',
//                 ${orderId},
//                 UNIX_TIMESTAMP()
//               )
//               `;
//               await prisma.$queryRaw(insert_wallet_hist_query);
//             } else {
//               throw new Error("Insufficient Balance!!");
//             }
//           }
//           // If Type is SELL
//           else if (side_type === "SELL") {
//             const coinBal = await prisma.balances.findFirst({
//               where: { user_id: user_id, coin_id: coin_id },
//             });
//             // Check if User has Coin BAlance or not for BUY
//             if (
//               coinBal != undefined &&
//               coinBal.balance != null &&
//               Number(coinBal?.balance) >= temp_quantity
//             ) {
//               const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//               //TDS AND FEES Calculation
//               const usdtFees = (limitAmount * Number(fees?.sell_fees)) / 100;
//               const usdtTds =
//                 ((limitAmount - usdtFees) * Number(fees?.tds)) / 100;
//               const usdtFinalAmt = limitAmount - (usdtFees + usdtTds);
//               const response = {
//                 symbol: `${symbol}${base}`,
//                 clientOrderId: orderId,
//                 price: temp_limit_price.toFixed(coin_decimal),
//                 origQty: quantity,
//                 orderId: orderId,
//                 orderListId: -1,
//                 type: mappedOrderType,
//                 side: "SELL",
//                 status: "OPEN",
//                 executedQty: "0",
//               };
//               const response_query = Prisma.sql`
//             INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//             VALUES (${orderId}, ${orderId}, ${response})
//               `;
//               await prisma.$queryRaw(response_query);
//               // Update Balance deduct from usdt balance
//               const bal_query = Prisma.sql`
//                 UPDATE balances SET balance = balance - ${temp_quantity}
//                 WHERE user_id=${user_id} AND coin_id=${coin_id};
//               `;
//               await prisma.$queryRaw(bal_query);
//               // Insert to buy sell limit open table
//               await prisma.buy_sell_pro_limit_open.create({
//                 data: {
//                   user_id,
//                   coin_id,
//                   coin_base: base,
//                   type: "SELL",
//                   usdt_price: fixedUsdtPrice,
//                   quantity: temp_quantity,
//                   amount: limitAmount,
//                   stop_limit_price: temp_stop_price,
//                   oco_stop_limit_price: temp_oco_limit_price,
//                   executed_quantity: 0,
//                   tds: usdtTds,
//                   fees: usdtFees,
//                   final_amount: usdtFinalAmt,
//                   order_id: orderId,
//                   order_type: mappedOrderType,
//                   buy_sell_fees: fees?.sell_fees,
//                   date_time: timestamp,
//                 },
//               });
//               const bal_inorder_query = Prisma.sql`
//               INSERT INTO balances_inorder (user_id, coin_id, balances)
//               VALUES (${user_id}, ${coin_id}, ${temp_quantity})
//               ON DUPLICATE KEY UPDATE balances = balances+${temp_quantity}`;
//               await prisma.$queryRaw(bal_inorder_query);
//               const totalCoinBal = Number(coinBal?.balance) - temp_quantity;
//               availCoinBal = totalCoinBal;
//               const insert_wallet_hist_query = Prisma.sql`
//               INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//               VALUES
//               (
//                 ${user_id},
//                 ${coin_id},
//                 'dr',
//                 ${coinBal.balance},
//                 ${totalCoinBal},
//                 ${temp_quantity},
//                 'SELL',
//                 ${orderId},
//                 UNIX_TIMESTAMP()
//               )
//               `;
//               await prisma.$queryRaw(insert_wallet_hist_query);
//             } else {
//               throw new Error("Insufficient Balance!!");
//             }
//           }
//         } else {
//           throw new Error("Please select valid OrderType!!");
//         }
//         // Configure winston for combined logging
//         const logger = winston.createLogger({
//           level: "info",
//           format: winston.format.combine(
//             winston.format.timestamp(),
//             winston.format.json()
//           ),
//           transports: [
//             new winston.transports.File({
//               filename: "logs/order_response.log",
//             }),
//           ],
//         });
//         try {
//           const response = await axios.post(
//             `http://192.168.1.129:4001/api/order`,
//             {
//               symbol: `${symbol}${base}`,
//               side: side_type,
//               type: order_type,
//               clientOrderId: orderId,
//               timeinFOrce: "GTC",
//               quantity,
//               limit_price,
//               timestamp: Date.now(),
//               recvWindow: 5000,
//             }
//           );
//           const buySellData = await prisma.buy_sell_pro_limit_open.findFirst({
//             where: {
//               user_id: user_id,
//               order_id: orderId,
//             },
//             select: {
//               final_amount: true,
//             },
//           });
//           const balData: IBalance[] = await prisma.$queryRaw`
//             SELECT COALESCE(balance, 0) AS balance
//             FROM balances
//             WHERE user_id = ${user_id} AND coin_id IN (5,${coin_id})
//             ORDER BY coin_id = 5 DESC;
//             `;
//           // Check if the order was successfull
//           if (response.data.status === "NEW") {
//             logger.info("Order placed successfully:", response.data);
//             const response_query = Prisma.sql`
//                INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                VALUES (${orderId}, ${orderId}, ${response.data})`;
//             await prisma.$queryRaw(response_query);
//             res.status(200).json({
//               status: "1",
//               message: "Successfully order placed",
//               data: {
//                 availableBalance:
//                   side_type === "BUY" ? availUsdtBal : availCoinBal,
//               },
//             });
//             return;
//           } else {
//             logger.error("Order failed. Response:", response.data);
//             const response_query = Prisma.sql`
//                INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                VALUES (${orderId}, ${orderId}, ${response})`;
//             await prisma.$queryRaw(response_query);
//             const bal_inorder_query = Prisma.sql`
//               UPDATE balances_inorder
//               SET balances = CASE
//                     WHEN balances - ${quantity} < 0 THEN 0
//                     ELSE balances - ${quantity}
//               END
//               WHERE user_id = ${user_id} AND coin_id = ${coin_id};
//               `;
//             await prisma.$queryRaw(bal_inorder_query);
//             let balAddBack;
//             let returncoinId;
//             let opening_balance;
//             let remaining_balance;
//             if (side_type === "BUY") {
//               balAddBack = buySellData?.final_amount;
//               opening_balance = balData[0].balance;
//               remaining_balance =
//                 Number(balData[0].balance) + Number(buySellData?.final_amount);
//               returncoinId = 5;
//               //availUsdtBal = Number(availUsdtBal) + Number(balAddBack);
//             } else if (side_type === "SELL") {
//               balAddBack = quantity;
//               opening_balance = balData[1].balance;
//               remaining_balance =
//                 Number(balData[1].balance) + Number(buySellData?.final_amount);
//               returncoinId = coin_id;
//               //availCoinBal = Number(availCoinBal) + Number(balAddBack);
//             }
//             const update_bal_query = Prisma.sql`
//               UPDATE balances SET balance=balance+${balAddBack} WHERE user_id=${user_id} AND coin_id=${returncoinId}`;
//             await prisma.$queryRaw(update_bal_query);
//             const insert_wallet_query = Prisma.sql`
//               INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//               VALUES
//               (
//                 ${user_id},
//                 ${returncoinId},
//                 'cr',
//                 ${opening_balance},
//                 ${remaining_balance},
//                 ${balAddBack},
//                 ${side_type},
//                 ${orderId},
//                 UNIX_TIMESTAMP()
//               )`;
//             await prisma.$queryRaw(insert_wallet_query);
//             await prisma.$queryRaw`
//               UPDATE buy_sell_pro_limit_open SET status='CANCELLED' WHERE user_id=${user_id} AND order_id=${orderId};
//               `;
//             throw new Error(`Order failed. Response:', ${response.data}`);
//           }
//         } catch (error) {
//           logger.error("Error placing order:", (error as Error).message);
//           res
//             .status(200)
//             .json({ status: "0", message: (error as Error).message });
//           return;
//         }
//       } catch (error) {
//         res
//           .status(200)
//           .json({ status: "0", message: (error as Error).message });
//       }
//     }
//   } catch (err) {
//     res.status(500).json({ status: "0", message: (err as Error).message });
//   }
// };
// Function to convert Unix timestamp to yyyy-mm-dd hh-mm-ss format
function formatDate(timestamp) {
    const date = new Date(Number(timestamp)); // Convert to Date
    const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (+5:30)
    const istDate = new Date(date.getTime() + istOffset); // Add offset
    const yyyy = istDate.getFullYear();
    const mm = String(istDate.getMonth() + 1).padStart(2, "0");
    const dd = String(istDate.getDate()).padStart(2, "0");
    const hh = String(istDate.getHours()).padStart(2, "0");
    const min = String(istDate.getMinutes()).padStart(2, "0");
    const ss = String(istDate.getSeconds()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
exports.formatDate = formatDate;
/*----- Get Buy Sell Order -------*/
// export const getBuySellOrder = async (req: Request, res: Response) => {
//   const { id: user_id } = req.body.user;
//   try {
//     const { base, order_type, side_type, symbol } = req.body;
//     if (!user_id) {
//       return res.json({
//         status: "0",
//         message: "You are not authorized or user not present",
//       });
//     }
//     const arrayCoinId: ICoinId[] =
//       await prisma.$queryRaw`SELECT id from currencies where symbol=${symbol.toUpperCase()}`;
//     const coin_id = arrayCoinId[0].id;
//     var result: IGetBuySellOrder[];
//     if (side_type.toUpperCase() === "BUY") {
//       result = await prisma.$queryRaw`
//       SELECT id, coin_base, type, usdt_price, quantity, amount,executed_quantity, status, order_type, date_time, order_id FROM buy_sell_pro_limit_open
//       WHERE coin_id = ${coin_id}
//       AND user_id = ${user_id} AND order_type = ${order_type.toUpperCase()} AND status = 'OPEN' AND coin_base =${base.toUpperCase()} AND type = 'BUY' ORDER BY id DESC;`;
//     } else if (side_type.toUpperCase() === "SELL") {
//       result = await prisma.$queryRaw`
//       SELECT id, coin_base, type, usdt_price, quantity, amount,executed_quantity, status, order_type, date_time, order_id FROM buy_sell_pro_limit_open
//       WHERE coin_id = ${coin_id}
//       AND user_id = ${user_id} AND order_type = ${order_type.toUpperCase()} AND status = 'OPEN' AND coin_base =${base.toUpperCase()} AND type = 'SELL' ORDER BY id DESC;`;
//     } else {
//       result = await prisma.$queryRaw`
//        SELECT id,coin_base,type,usdt_price,quantity,amount,executed_quantity,status,order_type,date_time,order_id FROM buy_sell_pro_limit_open
//        WHERE coin_id = ${coin_id} and user_id=${user_id} and order_type=${order_type.toUpperCase()}
//        and status="OPEN" and coin_base=${base.toUpperCase()} Order by id DESC;`;
//     }
//     // Convert each date_time in the buy sell order array
//     const convertedTrades: IGetBuySellOrder[] = result.map((trade) => ({
//       ...trade,
//       date_time: formatDate(trade.date_time),
//     }));
//     // send fetched data to user
//     res.status(200).json({
//       status: "1",
//       data: convertedTrades,
//     });
//   } catch (error: any) {
//     res.status(200).json({ status: "0", message: error.message });
//   }
// };
/*----- Get All Buy Sell Order -------*/
const getAllBuySellOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: user_id } = req.body.user;
    try { // remove symbol,order type
        if (!user_id) {
            return res.status(200).json({
                status: "0",
                message: "You are not authorized or user not present",
            });
        }
        const result = yield prisma.$queryRaw `
    SELECT bs.id,cc.pair_symbol,bs.type,bs.stop_limit_price,bs.order_price,bs.base_quantity,bs.final_amount,bs.executed_base_quantity,bs.status,bs.order_type,bs.fees,bs.date_time,bs.cancelled_date_time,bs.order_id 
    FROM buy_sell_pro_limit_open AS bs    
    JOIN crypto_pair AS cc ON bs.pair_id=cc.pair_id
    WHERE bs.user_id=${user_id} and bs.status IN ("FILLED", "CANCELLED")  Order by bs.id DESC;`;
        // Convert each date_time in the buy sell order array
        const convertedTrades = result.map((trade) => (Object.assign(Object.assign({}, trade), { date_time: formatDate(parseInt(trade.date_time)), cancelled_date_time: trade.cancelled_date_time === null ? null : formatDate(parseInt(trade.cancelled_date_time)), total: Number(trade.executed_quantity) * Number(trade.order_price), average: Number(trade.executed_quantity) != 0 ? trade.order_price : 0 })));
        // send fetched data to user
        res.status(200).json({
            status: "1",
            data: convertedTrades,
        });
    }
    catch (error) {
        console.log('all orders err', error);
        res.status(200).json({ status: "0", message: error.message });
    }
});
exports.getAllBuySellOrder = getAllBuySellOrder;
// export const getAllBuySellOrder = async (req: Request, res: Response) => {
//   try{
//   const { user_id: user_id } = req.body.user;
//   try {
//     if (!user_id) {
//       return res.status(200).json({
//         status: "0",
//         message: "You are not authorized or user not present",
//       });
//     }
//   } catch (error: any) {
//     console.log('all orders err',error);
//     res.status(200).json({ status: "0", message: error.message });
//   }
// };
/*----- Get Buy Sell Fees -------*/
const getBuySellFees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user_id } = req.body.user;
    try {
        if (!user_id) {
            return res.json({
                status: "0",
                message: "You are not authorized or user not present",
            });
        }
        const result = yield prisma.$queryRaw `
    SELECT * from fees;`;
        // send fetched data to user
        res.status(200).json({
            status: "1",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({ status: "0", message: error.message });
    }
});
exports.getBuySellFees = getBuySellFees;
/*----- Get Average Price Order -------*/
const getAvgPriceOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user_id } = req.body.user;
    const { order_id } = req.body;
    try {
        if (!user_id) {
            return res.json({
                status: "0",
                message: "You are not authorized or user not present",
            });
        }
        const avgPrice = yield prisma.$queryRaw `
     SELECT AVG(usdt_price) AS average_usdt_price
     FROM buy_sell_pro_in_order
     WHERE order_id = ${order_id};
    `;
        // send fetched data to user
        res.status(200).json({
            status: "1",
            data: avgPrice,
        });
    }
    catch (error) {
        res.status(200).json({ status: "0", message: error.message });
    }
});
exports.getAvgPriceOrder = getAvgPriceOrder;
// const cancelOrderFunc = async (order_id: any, user_id: any, timestamp: any) => {
//   const buySellData = await prisma.buy_sell_pro_limit_open.findMany({
//     where: {
//       order_id: order_id,
//       user_id: user_id,
//       status: 'OPEN',
//     },
//     select: {
//       coin_id: true,
//       quantity: true,
//       api: true,
//       usdt_price: true,
//       executed_quantity: true,
//       final_amount: true,
//       type: true,
//       status: true,
//       buy_sell_fees: true,
//     },
//   });
//   if (buySellData.length === 0) {
//     throw new Error(
//       'No matching open buy/sell order found for the specified criteria.',
//     );
//   }
//   if (buySellData[0].type.toUpperCase() === 'BUY') {
//     // if executed =0
//     if (Number(buySellData[0].executed_quantity) == 0) {
//       const update_bal_inorder_query = Prisma.sql`
//         UPDATE balances_inorder SET balances=balances-${buySellData[0].quantity}
//         WHERE user_id=${user_id} AND coin_id=${buySellData[0].coin_id};
//       `;
//       await prisma.$executeRaw(update_bal_inorder_query);
//       const update_bal_query = Prisma.sql`
//         UPDATE balances SET balance=balance+${buySellData[0].final_amount}
//         WHERE user_id=${user_id} AND coin_id=5;
//       `;
//       await prisma.$executeRaw(update_bal_query);
//       const balData = await prisma.balances.findFirst({
//         where: {
//           user_id: user_id,
//           currency_id: '5',
//         },
//         select: {
//           main_balance: true,
//         },
//       });
//       const opening_balance =
//         Number(balData?.main_balance) - Number(buySellData[0].final_amount);
//       const insert_wallet_hist_query = Prisma.sql`
//       INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//       VALUES
//       (
//         ${user_id},
//         5,
//         'cr',
//         ${opening_balance},
//         ${balData?.main_balance},
//         ${buySellData[0].final_amount},
//         'CANCELLED',
//         ${order_id},
//         UNIX_TIMESTAMP()
//       )
//       `;
//       await prisma.$executeRaw(insert_wallet_hist_query);
//     }
//     // if executed !=0
//     else if (Number(buySellData[0].executed_quantity) > 0) {
//       //TDS AND FEES Calculation
//       const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//       const remBal =
//         Number(buySellData[0].quantity) -
//         Number(buySellData[0].executed_quantity);
//       const execAmt = remBal * Number(buySellData[0].usdt_price);
//       const usdtExecFees =
//         (execAmt * Number(buySellData[0].buy_sell_fees)) / 100;
//       const usdtExecTds = ((execAmt - usdtExecFees) * Number(fees?.tds)) / 100;
//       const usdtExecFinalAmt = execAmt + (usdtExecFees + usdtExecTds);
//       await prisma.$queryRaw`
//       UPDATE balances SET balance=balance+${usdtExecFinalAmt}
//       WHERE user_id=${user_id} AND coin_id=5;
//     `;
//       await prisma.$queryRaw`
//       UPDATE balances_inorder SET balances=balances-${remBal}
//       WHERE user_id=${user_id} AND coin_id=${buySellData[0].coin_id};
//     `;
//       const balData = await prisma.balances.findFirst({
//         where: {
//           user_id: user_id,
//           currency_id: "5",
//         },
//         select: {
//           main_balance: true,
//         },
//       });
//       const opening_balance =
//         Number(balData?.main_balance) -
//         (Number(buySellData[0].final_amount) - usdtExecFinalAmt);
//       const creditBal = Number(buySellData[0].final_amount) - usdtExecFinalAmt;
//       await prisma.$queryRaw`
//     INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//     VALUES
//     (
//       ${user_id},
//       5,
//       'cr',
//       ${opening_balance},
//       ${balData?.main_balance},
//       ${creditBal},
//       'CANCELLED',
//       ${order_id},
//       UNIX_TIMESTAMP()
//     )
//     `;
//     }
//     await prisma.$queryRaw`
//        UPDATE buy_sell_pro_limit_open SET status='CANCELLED', cancelled_date_time=${timestamp} WHERE order_id=${order_id} AND user_id=${user_id};
//      `;
//     const response = {
//       symbol: `SOLUSDT`,
//       clientOrderId: order_id,
//       price: buySellData[0].usdt_price,
//       origQty: buySellData[0].quantity,
//       orderId: order_id,
//       orderListId: -1,
//       type: buySellData[0].type,
//       side: 'BUY',
//       status: 'CANCELED',
//       executedQty: buySellData[0].executed_quantity,
//     };
//     const response_query = Prisma.sql`
//   INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//   VALUES (${order_id}, ${order_id}, ${response})
//     `;
//     await prisma.$queryRaw(response_query);
//   }
//   // type is SELL
//   else if (buySellData[0].type.toUpperCase() === 'SELL') {
//     // if executed =0
//     if (Number(buySellData[0].executed_quantity) == 0) {
//       await prisma.$queryRaw`
//         UPDATE balances_inorder SET balances=balances-${buySellData[0].quantity}
//         WHERE user_id=${user_id} AND coin_id=${buySellData[0].coin_id};
//       `;
//       await prisma.$queryRaw`
//         UPDATE balances SET balance=balance+${buySellData[0].quantity}
//         WHERE user_id=${user_id} AND coin_id=${buySellData[0].coin_id};
//       `;
//       const balData = await prisma.balances.findFirst({
//         where: {
//           user_id: user_id,
//           currency_id: buySellData[0].coin_id,
//         },
//         select: {
//           balance: true,
//         },
//       });
//       const opening_balance =
//         Number(balData?.balance) - Number(buySellData[0].quantity);
//       await prisma.$queryRaw`
//       INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//       VALUES
//       (
//         ${user_id},
//         ${buySellData[0].coin_id},
//         'cr',
//         ${opening_balance},
//         ${balData?.balance},
//         ${buySellData[0].quantity},
//         'CANCELLED',
//         ${order_id},
//         UNIX_TIMESTAMP()
//       )
//       `;
//     }
//     // if executed !=0
//     else {
//       const remCoinBal =
//         Number(buySellData[0].quantity) -
//         Number(buySellData[0].executed_quantity);
//       await prisma.$queryRaw`
//       UPDATE balances SET balance=balance+${remCoinBal}
//       WHERE user_id=${user_id} AND coin_id=${buySellData[0].coin_id};
//     `;
//       await prisma.$queryRaw`
//       UPDATE balances_inorder SET balances=balances-${remCoinBal}
//       WHERE user_id=${user_id} AND coin_id=${buySellData[0].coin_id};
//     `;
//       const balData = await prisma.balances.findFirst({
//         where: {
//           user_id: user_id,
//           coin_id: buySellData[0].coin_id,
//         },
//         select: {
//           balance: true,
//         },
//       });
//       const opening_balance = Number(balData?.balance) - remCoinBal;
//       await prisma.$queryRaw`
//     INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//     VALUES
//     (
//       ${user_id},
//       ${buySellData[0].coin_id},
//       'cr',
//       ${opening_balance},
//       ${balData?.balance},
//       ${remCoinBal},
//       'CANCELLED',
//       ${order_id},
//       UNIX_TIMESTAMP()
//     )
//     `;
//     }
//     await prisma.$executeRaw`
//        UPDATE buy_sell_pro_limit_open SET status='CANCELLED', cancelled_date_time=${timestamp} WHERE order_id=${order_id} AND user_id=${user_id};
//      `;
//     const response = {
//       symbol: `SOLUSDT`,
//       clientOrderId: order_id,
//       price: buySellData[0].usdt_price,
//       origQty: buySellData[0].quantity,
//       orderId: order_id,
//       orderListId: -1,
//       type: buySellData[0].type,
//       side: 'SELL',
//       status: 'CANCELED',
//       executedQty: buySellData[0].executed_quantity,
//     };
//     const response_query = Prisma.sql`
//   INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//   VALUES (${order_id}, ${order_id}, ${response})
//     `;
//     await prisma.$queryRaw(response_query);
//   }
// };
/*----- Cancel Buy Sell Order -------*/
// export const cancelBuySellOrder = async (req: Request, res: Response) => {
//   const { id: user_id } = req.body.user;
//   try {
//     const { order_id } = req.body;
//     if (!user_id) {
//       return res.json({
//         status: '0',
//         message: 'You are not authorized or user not present',
//       });
//     }
//     const today_date = new Date(); // Get the current date and time
//     const timestamp = Math.floor(today_date.getTime() / 1000);
//     await cancelOrderFunc(order_id, user_id, timestamp);
//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'Order Cancelled',
//     });
//   } catch (error: any) {
//     res.status(200).json({ status: '0', message: error.message });
//   }
// };
/*----- Cancel Buy Sell Order -------*/
// export const cancelAllBuySellOrder = async (req: Request, res: Response) => {
//   const { id: user_id } = req.body.user;
//   try {
//     const { orders }: { orders: ICancelOrders[] } = req.body;
//     if (!user_id) {
//       return res.json({
//         status: '0',
//         message: 'You are not authorized or user not present',
//       });
//     }
//     const today_date = new Date(); // Get the current date and time
//     const timestamp = Math.floor(today_date.getTime() / 1000);
//     async function updateBalancesAndCancelOrders(
//       orders: ICancelOrders[],
//       user_id: number,
//     ) {
//       for (const order of orders) {
//         await cancelOrderFunc(order.order_id, user_id, timestamp);
//       }
//       // Return status response
//       return {
//         status: '1',
//         message: 'All Orders successfully cancelled',
//       };
//     }
//     await updateBalancesAndCancelOrders(orders, user_id);
//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'All Orders Successfully Cancelled',
//     });
//   } catch (error: any) {
//     res.status(200).json({ status: '0', message: error.message });
//   }
// };
// Get All Currencies Balance Query Change
const getAllCurrenciesBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: user_id } = req.body.user;
    try {
        if (req.body.login === "True") {
            if (!user_id) {
                return res.status(400).send({
                    status: "3",
                    message: "You are not authorized or user not present",
                });
            }
        }
        const currenciesWithBalances = yield prisma.$queryRaw `
      SELECT 
        c.currency_id,
        c.coin,
        c.symbol,
        c.icon,
        c.status,
        c.coin_decimal,
        c.qty_decimal,
        c.price_decimal,
        c.deposit,
        c.withdraw,
        c.withdrawl_fees,
        c.usdtprice,
        c.change_in_price,
        COALESCE(b.current_balance, 0) AS main_balance
      FROM 
        currencies c
      LEFT JOIN balances b ON c.currency_id = b.currency_id AND b.user_id = ${user_id}
      WHERE 
        c.symbol != 'INR'`;
        let usdtInvestedSum = 0;
        let coin_price;
        let btc_decimal = 0;
        let usdt_decimal = 0;
        const formattedData = currenciesWithBalances.map((currency) => {
            if (currency.symbol === "BTC") {
                coin_price = currency.usdtprice;
                btc_decimal = currency.qty_decimal;
            }
            if (currency.symbol === "USDT") {
                usdt_decimal = currency.qty_decimal;
            }
            const balance = currency.main_balance ? currency.main_balance : 0.0;
            const usdtPrice = currency.usdtprice;
            const usdtInvested = balance * usdtPrice;
            usdtInvestedSum += usdtInvested;
            return {
                currency_id: currency.currency_id,
                coin: currency.coin,
                symbol: currency.symbol,
                icon: currency.icon,
                withdrawl_fees: currency.withdrawl_fees,
                usdtprice: currency.usdtprice,
                qty_decimal: currency.qty_decimal,
                price_decimal: currency.price_decimal,
                balance: balance,
                usdtInvested: usdtInvested,
            };
        });
        formattedData.sort((a, b) => b.usdtInvested - a.usdtInvested);
        res.status(200).json({
            status: "1",
            iconPath: `${defaults_1.default.ICON_URL}/icon/`,
            iconPath1: `${defaults_1.default.ICON_URL1}/icon/`,
            totalBalance: usdtInvestedSum,
            btc_decimal: btc_decimal,
            usdt_decimal: usdt_decimal,
            totalCoinBalance: usdtInvestedSum / coin_price,
            data: formattedData,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: "0", message: error.message });
    }
});
exports.getAllCurrenciesBalance = getAllCurrenciesBalance;
const getDepositWithdrawList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: user_id } = req.body.user;
    const { type: type } = req.query;
    try {
        if (type !== 'deposit' && type !== 'withdraw') {
            return res.status(400).send({
                status: "3",
                message: "Invalid type parameter. Expected 'deposit' or 'withdraw'.",
            });
        }
        const currenciesWithBalances = type === "deposit"
            ? yield prisma.$queryRaw `
        SELECT 
          c.currency_id,
          c.coin,
          c.symbol,
          c.icon,
          c.coin_decimal,
          c.qty_decimal,
          c.price_decimal,
          c.withdrawl_fees,
          c.usdtprice,
          COALESCE(b.current_balance, 0) AS main_balance
        FROM 
          currencies c
        LEFT JOIN balances b ON c.currency_id = b.currency_id AND b.user_id = ${user_id}
        WHERE 
          c.deposit = 'Active'
      `
            : yield prisma.$queryRaw `
        SELECT 
          c.currency_id,
          c.coin,
          c.symbol,
          c.icon,
          c.coin_decimal,
          c.qty_decimal,
          c.price_decimal,
          c.withdrawl_fees,
          c.usdtprice,
          COALESCE(b.current_balance, 0) AS main_balance
        FROM 
          currencies c
        LEFT JOIN balances b ON c.currency_id = b.currency_id AND b.user_id = ${user_id}
        WHERE 
          c.withdraw = 'Active'
      `;
        res.status(200).json({
            status: "1",
            iconPath: `${defaults_1.default.ICON_URL}/icon/`,
            data: currenciesWithBalances,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: "0", message: error.message });
    }
});
exports.getDepositWithdrawList = getDepositWithdrawList;
const getAllNetwork = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: user_id } = req.body.user;
    const { currency_id: currency_id, type: type } = req.query;
    try {
        if (!currency_id) {
            return res.status(400).send({
                status: "0",
                message: "currency_id is required",
            });
        }
        if (type !== 'deposit' && type !== 'withdraw') {
            return res.status(400).send({
                status: "0",
                message: "Invalid type parameter. Expected 'deposit' or 'withdraw'.",
            });
        }
        if (!user_id) {
            return res.status(400).send({
                status: "0",
                message: "You are not authorized or user not present",
            });
        }
        const networkData = type === "deposit" ? yield prisma.$queryRaw `SELECT 
               c.id,
               cn.network_id,
               cn.contract_address,
               ch.evm_compatible,
               ch.chain_name AS chain_name,
               ch.chain_id,
               ch.netw_fee AS network_fee,
               ch.min_dep AS min_deposit
               FROM 
                 currencies c
               JOIN 
                 currency_network cn ON c.id = cn.currency_id
               JOIN 
                 chains ch ON cn.network_id = ch.id 
               WHERE 
                c.currency_id = ${currency_id} and ch.deposit_status = 'Active'` :
            yield prisma.$queryRaw `SELECT 
                c.id,
                cn.network_id,
                cn.contract_address,
                ch.evm_compatible,
                ch.chain_name AS chain_name,
                ch.chain_id,
                ch.netw_fee as network_fee,
                ch.min_with AS min_withdraw
                FROM 
                  currencies c
                JOIN 
                  currency_network cn ON c.id = cn.currency_id
                JOIN 
                  chains ch ON cn.network_id = ch.id
                WHERE 
                 c.currency_id = ${currency_id} and ch.withdrawal_status = 'Active'`;
        res.status(200).json({
            status: "1",
            data: networkData,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ status: "0", message: error.message });
    }
});
exports.getAllNetwork = getAllNetwork;
const getUserWalletAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { user_id } = req.body.user || {};
        const { currency_id, evm_compatible, chain_id } = req.body;
        // Validation
        if (!user_id) {
            return res.status(401).json({ status: "0", message: "Unauthorized or user not present" });
        }
        if (!currency_id) {
            return res.status(400).json({ status: "0", message: "currency_id is required" });
        }
        if (chain_id === undefined || chain_id === null || chain_id === "") {
            return res.status(400).json({ status: "0", message: "chain_id is required" });
        }
        if (evm_compatible !== 0 && evm_compatible !== 1) {
            return res.status(400).json({ status: "0", message: "evm_compatible must be 0 or 1" });
        }
        // Check if address exists in DB
        const existingWallet = yield prisma.user_wallet.findFirst({
            where: {
                user_id,
                currency_id: currency_id,
                chain_id: Number(chain_id),
            },
            select: {
                address: true,
            },
        });
        console.log('existingWallet', existingWallet);
        if (existingWallet) {
            return res.status(200).json({ status: "1", data: existingWallet });
        }
        const url = defaults_1.default.Wallet_server_getAddress_url;
        const headers = {
            'Authorization': `Bearer ${defaults_1.default.wallet_server_token}`,
            'Content-Type': 'application/json'
        };
        const body = {
            user_id: user_id,
            evm_compatible: evm_compatible,
            chain_id: chain_id
        };
        console.log('body', body);
        const response = yield axios_1.default.post(url, body, { headers });
        console.log('response', response.data);
        if (((_c = response === null || response === void 0 ? void 0 : response.data) === null || _c === void 0 ? void 0 : _c.success) == "1") {
            const newWallet = yield prisma.user_wallet.create({
                data: {
                    user_id: user_id,
                    currency_id: currency_id,
                    chain_id: Number(chain_id),
                    memo: "N/A",
                    address: response.data.data.address,
                    destination_tag: "N/A"
                },
            });
            if (newWallet) {
                return res.status(200).json({ status: "1", data: { address: response.data.data.address } });
            }
            return res.status(500).json({ status: "0", message: "Failed to create wallet address" });
        }
        else {
            return res.status(500).json({ status: "0", message: "Failed to get address from wallet server" });
        }
    }
    catch (error) {
        console.error("getUserWalletAddress error:", error.message);
        return res.status(500).json({ status: "0", message: "Internal Server Error", error: error.message });
    }
});
exports.getUserWalletAddress = getUserWalletAddress;
/*----- Get All Funds -------*/
// export const getAllFunds = async (req: Request, res: Response) => {
//   const { id: user_id } = req.body.user;
//   const { symbol } = req.body;
//   try {
//     if (!user_id) {
//       return res.status(400).send({
//         status: "0",
//         message: "You are not authorized or user not present",
//       });
//     }
//     // Function to fetch data with retry mechanism
//     async function fetchDataWithRetry() {
//       const maxRetries = 5;
//       let retries = 0;
//       while (retries < maxRetries) {
//         try {
//           // Fetch data from Binance API
//           const response = await axios.get(
//             "https://api.binance.com/api/v3/ticker/24hr"
//           );
//           // Filter and map the response to extract relevant data
//           const cryptocurrenciesTicker: ICryptocurrency[] = response.data
//             .filter((item: any) => item.symbol.endsWith("USDT"))
//             .map((item: any) => {
//               return { ...item, symbol: item.symbol.replace("USDT", "") };
//             });
//           const balanceData: IFunds[] = await prisma.$queryRaw`
//           WITH TotalAmountCTE AS ( SELECT b.coin_id, COALESCE(SUM(amount) / NULLIF((SELECT main_balance FROM balances WHERE user_id = ${user_id} AND coin_id = b.coin_id), 0), 0) AS avg_cost
//           FROM buy_sell_pro_limit_open b WHERE user_id = ${user_id} AND type = 'BUY' AND status = 'FILLED' GROUP BY b.coin_id )
//           SELECT cc.id, cc.symbol, cc.coin, cc.icon,cc.withdrawl_fees,cc.usdtprice, b.balance, ta.avg_cost FROM currencies AS cc
//           LEFT JOIN balances AS b ON cc.id = b.coin_id AND b.user_id = ${user_id}
//           LEFT JOIN TotalAmountCTE ta ON cc.id = ta.coin_id WHERE cc.symbol IS NOT NULL AND b.balance IS NOT NULL;`;
//           const usdtBalanceData = balanceData.filter(
//             (item) => item.symbol.toUpperCase() === "USDT"
//           );
//           const symbolToBalanceMap: { [key: string]: IFundsMap } = {};
//           balanceData.forEach((item) => {
//             symbolToBalanceMap[item.symbol.toUpperCase()] = {
//               bal: item.balance,
//               coin_name: item.coin,
//               withdrawl_fees: item.withdrawl_fees,
//               usdtprice: item.usdtprice,
//               icon: item.icon,
//               avg_cost: item.avg_cost === null ? 0.0 : item.avg_cost,
//               id: item.id,
//               coin_symbol: item.symbol,
//             };
//           });
//           /* const mergedData = cryptocurrenciesTicker
//             .filter(item =>
//               symbolToBalanceMap.hasOwnProperty(item.symbol.toUpperCase()),
//             )
//             .map(item => {
//               const balanceDataItem =
//                 symbolToBalanceMap[item.symbol.toUpperCase()];
//               const dailyPnl =
//                 balanceDataItem.bal *
//                 (parseFloat(item.lastPrice) - parseFloat(item.openPrice));
//               const dailyPnlPerc =
//                 dailyPnl / (balanceDataItem.bal * parseFloat(item.lastPrice));
//               return {
//                 ...item,
//                 balance: balanceDataItem.bal,
//                 dailyPnl: dailyPnl.toFixed(2),
//                 dailyPnlPerc: (dailyPnlPerc * 100).toFixed(2) + '%',
//                 coin_name: balanceDataItem.coin_name,
//                 icon: balanceDataItem.icon,
//                 id: balanceDataItem.id,
//                 avg_cost: balanceDataItem.avg_cost,
//                 investedUsdt: balanceDataItem.bal * parseFloat(item.lastPrice),
//               };
//             }); */
//           const mergedData = cryptocurrenciesTicker
//             .filter((item) =>
//               symbolToBalanceMap.hasOwnProperty(item.symbol.toUpperCase())
//             )
//             .map((item) => {
//               const balanceDataItem =
//                 symbolToBalanceMap[item.symbol.toUpperCase()];
//               const dailyPnl =
//                 balanceDataItem.bal *
//                 (parseFloat(item.lastPrice) - parseFloat(item.openPrice));
//               const dailyPnlPerc =
//                 dailyPnl / (balanceDataItem.bal * parseFloat(item.lastPrice));
//               return {
//                 usdtprice: balanceDataItem.usdtprice,
//                 balance: balanceDataItem.bal,
//                 withdrawl_fees: balanceDataItem.withdrawl_fees,
//                 dailyPnl: dailyPnl.toFixed(2),
//                 dailyPnlPerc: (dailyPnlPerc * 100).toFixed(2) + "%",
//                 coin_name: balanceDataItem.coin_name,
//                 icon: balanceDataItem.icon,
//                 id: balanceDataItem.id,
//                 symbol: balanceDataItem.coin_symbol,
//                 avg_cost: balanceDataItem.avg_cost.toFixed(2),
//                 investedUsdt: balanceDataItem.bal * balanceDataItem.usdtprice,
//               };
//             })
//             .sort((a, b) =>
//               a.symbol.toUpperCase() === symbol.toUpperCase()
//                 ? -1
//                 : b.investedUsdt - a.investedUsdt
//             );
//           const finalFunds = mergedData.filter((item) => item.balance > 0);
//           // send fetched data to user
//           res.status(200).json({
//             status: "1",
//             data: finalFunds,
//             usdtData: usdtBalanceData,
//             iconPath: `${process.env.ICON_URL}/icon/`,
//           });
//           return; // Exit the function after successful response
//         } catch (error) {
//           console.error("Error fetching data:", (error as Error).message);
//           retries++;
//           // Wait for a 5 sec before retrying
//           await new Promise((resolve) => setTimeout(resolve, 5000));
//         }
//       }
//       console.error("Maximum retries reached. Unable to fetch data.");
//       res.status(400).send({
//         status: "3",
//         message: "Unable to fetch data from Binance API",
//       });
//     }
//     // Call the function to fetch data with retry
//     await fetchDataWithRetry();
//   } catch (error: any) {
//     res.status(500).send({ status: "0", message: error.message });
//   }
// };
const getSymbolFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g;
    const { user_id: user_id } = req.body.user;
    const { currency_id } = req.body;
    try {
        if (!user_id) {
            return res.status(400).send({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        if (!currency_id) {
            return res.status(400).send({
                status: "3",
                message: "provide currency_id",
            });
        }
        //query to get user main_balance and locked_balance from balances tables using user_id and  currency_id
        const currencyData = yield prisma.balances.findMany({
            select: {
                main_balance: true,
                locked_balance: true,
            },
            where: {
                user_id: user_id,
                currency_id: currency_id,
            },
        });
        const data = {
            available: (_e = (_d = currencyData[0]) === null || _d === void 0 ? void 0 : _d.main_balance) !== null && _e !== void 0 ? _e : 0.0,
            unavailable: (_g = (_f = currencyData[0]) === null || _f === void 0 ? void 0 : _f.locked_balance) !== null && _g !== void 0 ? _g : 0.0,
        };
        return res.status(200).json({
            status: "1",
            data: [data],
        });
    }
    catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).send({
            status: "0",
            message: "Unable to fetch data from Binance API",
        });
    }
});
exports.getSymbolFunds = getSymbolFunds;
/*----- Get Symbol All Funds -------*/
// export const getSymbolFunds = async (req: Request, res: Response) => {
//   const { id: user_id } = req.body.user;
//   //const user_id = "2";
//   const { symbol } = req.body;
//   try {
//     if (!user_id) {
//       return res.json({
//         status: "0",
//         message: "You are not authorized or user not present",
//       });
//     }
//     // return res.status(200).json({
//     //   data: [
//     //     {
//     //       avg_cost: 0,
//     //       balance: "11300",
//     //       coin_name: "TRON",
//     //       dailyPnl: "-30.51",
//     //       dailyPnlPerc: "-1.79%",
//     //       icon: "trx.png",
//     //       id: 8,
//     //       investedUsdt: 1706.3,
//     //       symbol: "TRX",
//     //       usdtprice: "0.07875",
//     //       withdrawl_fees: "0",
//     //     },
//     //   ],
//     //   iconPath: `http://192.168.1.129:4002/icon/${symbol}.png`,
//     //   status: "1",
//     // });
//     // Function to fetch data with retry mechanism
//     async function fetchDataWithRetry() {
//       const maxRetries = 5;
//       let retries = 0;
//       while (retries < maxRetries) {
//         try {
//           // Fetch data from Binance API
//           const response = await axios.get(
//             "https://api.binance.com/api/v3/ticker/24hr"
//           );
//           // Filter and map the response to extract relevant data
//           const cryptocurrenciesTicker: ICryptocurrency[] = response.data
//             .filter((item: any) => item.symbol.endsWith("USDT"))
//             .map((item: any) => {
//               return { ...item, symbol: item.symbol.replace("USDT", "") };
//             });
//             // console.log(cryptocurrenciesTicker)
//           const arrayCoinId: ICoinId[] =
//             await prisma.$queryRaw`SELECT currency_id from currencies where symbol=${symbol.toUpperCase()}`;
//           const currency_id = arrayCoinId[0].currency_id;
//           const balanceData: IFunds[] = await prisma.$queryRaw`
//           WITH TotalAmountCTE AS (
//             SELECT
//               b.currency_id,
//               COALESCE(SUM(amount) / NULLIF((SELECT main_balance FROM balances WHERE user_id = ${user_id} AND currency_id = b.currency_id), 0), 0) AS avg_cost
//             FROM
//               buy_sell_pro_limit_open b
//             WHERE
//               user_id = ${user_id} AND type = 'BUY' AND status = 'FILLED' AND b.currency_id = ${currency_id}
//             GROUP BY
//               b.currency_id
//           )
//           SELECT
//             cc.currency_id,
//             cc.symbol,
//             cc.withdrawl_fees,
//             cc.usdtprice,
//             cc.coin,
//             cc.icon,
//             b.main_balance,b.locked_balance,
//             ta.avg_cost
//           FROM
//             currencies AS cc
//           LEFT JOIN
//             balances AS b ON cc.id = b.currency_id AND b.user_id = ${user_id}
//           LEFT JOIN
//             TotalAmountCTE ta ON cc.id = ta.currency_id
//           WHERE
//             cc.symbol IS NOT NULL AND b.main_balance IS NOT NULL AND cc.id = ${currency_id};
//           `;
//           console.log(balanceData)
//           const usdtBalanceData = balanceData.filter(
//             (item) => item.symbol.toUpperCase() === "USDT"
//           );
//           const symbolToBalanceMap = balanceData[0];
//           const mergedData = cryptocurrenciesTicker
//             .filter((item) => {
//               const mapSymbol =
//                 symbolToBalanceMap && symbolToBalanceMap.symbol.toUpperCase();
//               const itemSymbol = item.symbol.toUpperCase();
//               return mapSymbol === itemSymbol;
//             })
//             .map((item) => {
//               const dailyPnl =
//                 symbolToBalanceMap.balance *
//                 (parseFloat(item.lastPrice) - parseFloat(item.openPrice));
//               const dailyPnlPerc =
//                 dailyPnl /
//                 (symbolToBalanceMap.balance * parseFloat(item.lastPrice));
//               return {
//                 usdtprice: symbolToBalanceMap.usdtprice,
//                 withdrawl_fees: symbolToBalanceMap.withdrawl_fees,
//                 balance: symbolToBalanceMap.balance,
//                 dailyPnl: dailyPnl.toFixed(2),
//                 dailyPnlPerc: (dailyPnlPerc * 100).toFixed(2) + "%",
//                 coin_name: symbolToBalanceMap.coin,
//                 icon: symbolToBalanceMap.icon,
//                 id: symbolToBalanceMap.id,
//                 symbol: symbolToBalanceMap.symbol,
//                 avg_cost:
//                   symbolToBalanceMap.avg_cost === null
//                     ? 0.0
//                     : symbolToBalanceMap.avg_cost.toFixed(2),
//                 investedUsdt:
//                   symbolToBalanceMap.balance * parseFloat(item.lastPrice),
//               };
//             });
//           // send fetched data to user
//           res.status(200).json({
//             status: "1",
//             data:
//               symbol.toUpperCase() === "USDT" ? usdtBalanceData : mergedData,
//             iconPath: `${process.env.ICON_URL}/icon/`,
//           });
//           return; // Exit the function after successful response
//         } catch (error) {
//           console.error("Error fetching data:", (error as Error).message);
//           retries++;
//           // Wait for a 5 sec before retrying
//           await new Promise((resolve) => setTimeout(resolve, 5000));
//         }
//       }
//       console.error("Maximum retries reached. Unable to fetch data.");
//       res.status(400).json({
//         status: "3",
//         message: "Unable to fetch data from Binance API",
//       });
//     }
//     // Call the function to fetch data with retry
//     await fetchDataWithRetry();
//   } catch (error: any) {
//     res.status(200).json({ status: "0", message: error.message });
//   }
// };
/*----- Get Wallet Funds -------*/
const getWalletFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user_id } = req.body.user;
    const { symbol, base } = req.body;
    try {
        if (!user_id) {
            return res.status(400).send({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        const arrayCoinId = yield prisma.$queryRaw `SELECT currency_id from currencies where symbol=${symbol.toUpperCase()}`;
        const currency_id = arrayCoinId[0].currency_id;
        const balanceData = yield prisma.$queryRaw `
    SELECT bs.type, wh.currency_id,bs.id,wh.id,wh.balance
FROM buy_sell_pro_limit_open bs
JOIN wallet_history wh ON wh.order_id = bs.order_id
WHERE wh.order_id IN (
    SELECT order_id
    FROM buy_sell_pro_limit_open
    WHERE user_id = ${user_id}
      AND status = 'OPEN'
)
AND wh.user_id = ${user_id}
AND bs.user_id = ${user_id}
AND (
    (bs.type = 'BUY' AND wh.currency_id = ${currency_id})
    OR
    (bs.type = 'SELL' AND wh.currency_id IN 
    (SELECT currency_id FROM balances WHERE user_id = ${user_id} 
    AND currency_id != 5))
);`;
        let usdt_bal = 0.0;
        let usdt_coin_id;
        let coin_balances = {};
        balanceData.forEach((entry) => {
            const type = entry.type.toUpperCase();
            const balance = parseFloat(entry.balance);
            const coin_id = entry.coin_id;
            if (type === "BUY") {
                usdt_coin_id = coin_id;
                usdt_bal += balance;
            }
            else if (type === "SELL" && coin_id !== undefined) {
                coin_balances[coin_id] = (coin_balances[coin_id] || 0) + balance;
            }
        });
        if (usdt_coin_id !== undefined) {
            coin_balances[usdt_coin_id] =
                (coin_balances[usdt_coin_id] || 0) + usdt_bal;
        }
        const balData = yield prisma.$queryRaw `
        SELECT bal.coin_id,bal.balance, curr.symbol,curr.usdtprice
        FROM balances AS bal
        LEFT JOIN currencies AS curr ON bal.coin_id = curr.id
        WHERE bal.user_id = ${user_id};
    `;
        const currUsdtPrice = balData[0].usdtprice;
        const binanceAPIUrlCoinPrice = `https://www.binance.com/api/v3/ticker/price?symbol=BTC${base.toUpperCase()}`;
        axios_1.default
            .get(binanceAPIUrlCoinPrice)
            .then((response) => {
            useBtcCoinPrice(parseFloat(response.data.price));
        })
            .catch(() => {
            useBtcCoinPrice(currUsdtPrice);
        });
        function useBtcCoinPrice(btc_coin_price) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const updatedBalData = balData
                        .map((entry) => (Object.assign(Object.assign({}, entry), { tot_bal: parseFloat(entry.balance.toString()) +
                            parseFloat((coin_balances[entry.coin_id] || "0")), in_order: parseFloat(entry.balance.toString()) +
                            parseFloat((coin_balances[entry.coin_id] || "0")) -
                            entry.balance, usdt: entry.usdtprice *
                            (parseFloat(entry.balance.toString()) +
                                parseFloat((coin_balances[entry.coin_id] || "0"))), btc_value: (entry.usdtprice *
                            (parseFloat(entry.balance.toString()) +
                                parseFloat((coin_balances[entry.coin_id] || "0")))) /
                            btc_coin_price })))
                        .sort((a, b) => a.symbol.toUpperCase() === symbol.toUpperCase()
                        ? -1
                        : b.usdt - a.usdt);
                    res.status(200).json({
                        status: "1",
                        data: updatedBalData,
                    });
                }
                catch (error) {
                    res
                        .status(200)
                        .json({ status: "0", message: error.message });
                }
            });
        }
    }
    catch (error) {
        res.status(500).json({ status: "0", message: error.message });
    }
});
exports.getWalletFunds = getWalletFunds;
// Get Trades Data
const getTrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user_id } = req.body.user;
    const { symbol } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        const arrayCoinId = yield prisma.$queryRaw `SELECT id from currencies where symbol=${symbol.toUpperCase()}`;
        const coin_id = arrayCoinId[0].currency_id;
        // use buy sell order
        const tradeData = yield prisma.$queryRaw `
    SELECT date_time,quantity,usdt_price FROM buy_sell_pro_in_order 
    WHERE user_id=${user_id} AND coin_id = ${coin_id} AND status="FILLED";
    `;
        const formattedData = tradeData
            .map((trade) => {
            return {
                time: formatDate(parseInt(trade.date_time, 10)),
                quantity: parseFloat(trade.quantity).toFixed(2),
                price: trade.usdt_price,
                timestamp: trade.date_time,
            };
        })
            .sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
        res.status(200).json({
            status: "1",
            data: formattedData.slice(0, 10),
        });
    }
    catch (error) {
        res.status(500).json({ status: "0", message: error.message });
    }
});
exports.getTrades = getTrades;
// Get Trade History data
const getTradeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: user_id } = req.body.user;
    //const { type } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        const tradeHistData = yield prisma.$queryRaw `
    SELECT currencies.symbol AS symbol,
       buy_sell_pro_in_order.quantity AS quantity,
       buy_sell_pro_in_order.fees AS fees,
       buy_sell_pro_in_order.type AS type,
       buy_sell_pro_in_order.date_time AS date_time,
       buy_sell_pro_in_order.usdt_price AS usdt_price
    FROM buy_sell_pro_in_order
    JOIN currencies ON buy_sell_pro_in_order.coin_id = currencies.id
    WHERE buy_sell_pro_in_order.user_id = ${user_id};
    `;
        const formattedData = tradeHistData
            .map((trade) => {
            return {
                date: formatDate(parseInt(trade.date_time, 10)),
                pair: `${trade.symbol}/${trade.coin_base}`,
                symbol: trade.symbol,
                type: trade.type,
                price: trade.usdt_price,
                executed: trade.quantity,
                fees: trade.fees,
                role: "--",
                sor: "--",
                realized_pnl: "--",
                total: trade.quantity,
                totalInUsdt: parseFloat(trade.quantity) * parseFloat(trade.usdt_price),
                timestamp: trade.date_time,
            };
        })
            .sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
        res.status(200).json({
            status: "1",
            data: formattedData,
        });
    }
    catch (error) {
        res.status(500).json({ status: "0", message: error.message });
    }
});
exports.getTradeHistory = getTradeHistory;
// export const getwalletHistory = async (req: Request, res: Response) => {
//   const { id: userID } = req.body.user;
//   const user_id = "2";
//   try {
//     // const { symbol, type } = req.body;
//     if (!user_id) {
//       return res.json({
//         status: "0",
//         message: "You are not authorized or user not present",
//       });
//     }
//     // const idData = await prisma.currencies.findFirst({
//     //   where: {
//     //     symbol: symbol,
//     //   },
//     //   select: {
//     //     id: true,
//     //   },
//     // });
//     // var typeQuery: string = `SELECT * from wallet_history WHERE user_id=${user_id} AND coin_id = ${idData?.id}`;
//     // if (type.toString().toUpperCase() === 'ALL') {
//     //   typeQuery += ' order by id DESC';
//     // } else if (type.toString().toUpperCase() === 'DEPOSIT') {
//     //   typeQuery += " AND remark = 'DEPOSIT' order by id DESC";
//     // } else if (type.toString().toUpperCase() === 'WITHDRAW') {
//     //   typeQuery += " AND remark = 'WITHDRAW' order by id DESC";
//     // } else if (type.toString().toUpperCase() === 'BUYSELL') {
//     //   typeQuery += " AND remark in ('BUY','SELL','CANCELLED') order by id DESC";
//     // }
//     // const stringsArray: any = [...[typeQuery]];
//     // // Use the `raw` property to impersonate a tagged template
//     // stringsArray.raw = [typeQuery];
//     // const result: IWalletHistory[] = await prisma.$queryRaw(stringsArray);
//     // // Convert each date_time in the Wallet history array
//     // const convertedHist = result.map(history => ({
//     //   ...history,
//     //   date_time: formatDate(history.date_time),
//     // }));
//     // send fetched data to user
//     res.status(200).json({
//       status: "1",
//       data: [
//         {
//           balance: "0.1",
//           coin_id: 8,
//           date_time: "2024-08-17 17:33:13",
//           id: 1099,
//           opening_balance: "11299.9",
//           order_id: "1723896186824119351",
//           remaining_balance: "11300",
//           remark: "CANCELLED",
//           type: "cr",
//           user_id: 2,
//         },
//         {
//           balance: "0.1",
//           coin_id: 8,
//           date_time: "2024-08-17 17:33:06",
//           id: 1098,
//           opening_balance: "11300",
//           order_id: "1723896186824119351",
//           remaining_balance: "11299.9",
//           remark: "SELL",
//           type: "dr",
//           user_id: 2,
//         },
//         {
//           balance: "100",
//           coin_id: 8,
//           date_time: "2024-08-17 15:54:12",
//           id: 1097,
//           opening_balance: "11400",
//           order_id: "1723890252651283061",
//           remaining_balance: "11300",
//           remark: "WITHDRAW",
//           type: "dr",
//           user_id: 2,
//         },
//         {
//           balance: "150",
//           coin_id: 8,
//           date_time: "2024-08-17 15:44:21",
//           id: 1096,
//           opening_balance: "11550",
//           order_id: "1723889661764716268",
//           remaining_balance: "11400",
//           remark: "WITHDRAW",
//           type: "dr",
//           user_id: 2,
//         },
//       ],
//     });
//   } catch (error: any) {
//     console.log(error.message);
//     res.status(200).json({ status: "0", message: error.message });
//   }
// };
/*----- Callback for executed order -------*/
// Remove executed and partially from buy sell pro inorder table
// export const executedBuySellOrder = async (req: Request, res: Response) => {
//   const {
//     // symbol,
//     // clientOrderId, // order id
//     // price, // usdt price
//     // origQty, // original qty
//     executedQty, // resp executed
//     orderId, // api order id
//     // orderListId,
//     type, // LIMIT,MARKET...
//     status, // NEW, FILLED, PF...
//     // side, // BUY, SELL
//   } = req.body;
//   try {
//     // const apiKey = 'your_api_key';
//     // const apiSecret = 'your_api_secret';
//     // const endpoint = 'https://api.binance.com/api/v3/order';
//     // const payload = {
//     //   symbol: 'BTCUSDT',
//     //   side: 'BUY',
//     //   type: 'LIMIT',
//     //   timeInForce: 'GTC', // Time in force (Good Till Cancelled)
//     //   quantity: 1,
//     //   price: 40000,
//     //   timestamp: Date.now(),
//     // };
//     // Get Data from Buy Sell Pro Limit Open
//     // const buySellData = await prisma.buy_sell_pro_limit_open.findMany({
//     //   where: {
//     //     order_id: clientOrderId,
//     //   },
//     //   select: {
//     //     coin_id: true,
//     //     quantity: true,
//     //     api: true,
//     //     usdt_price: true,
//     //     executed_quantity: true,
//     //     final_amount: true,
//     //     type: true,
//     //     status: true,
//     //   },
//     // });
//     // get order id in response tab using apiorder id
//     const respOrderId = await prisma.buy_sell_order_response.findMany({
//       where: {
//         api_order_id: orderId.toString(),
//       },
//       select: {
//         order_id: true,
//       },
//     });
//     if (
//       type.toUpperCase() === 'LIMIT' ||
//       type.toUpperCase() === 'MARKET' ||
//       type.toUpperCase() == 'STOP_LIMIT'
//     ) {
//       const orderData: IBuySellOpenData[] = await prisma.$queryRaw`
//       SELECT bs.*, bal_in.balances
//       FROM buy_sell_pro_limit_open bs
//       JOIN balances_inorder bal_in ON bal_in.coin_id = bs.coin_id AND bal_in.user_id = bs.user_id
//       WHERE bs.order_id = ${respOrderId[0].order_id} AND bs.status='OPEN';
//       `;
//       //const fixedPrice = orderData[0].usdt_price.toFixed(coin_decimal);
//       const today_date = new Date(); // Get the current date and time
//       const timestamp = Math.floor(today_date.getTime() / 1000);
//       if (orderData[0].type.toUpperCase() === 'BUY') {
//         if (
//           status == 'FILLED' ||
//           status == 'PARTIALLY_FILLED' ||
//           status == 'CANCELED'
//         ) {
//           if (status == 'FILLED') {
//             if (
//               orderData[0].quantity - executedQty <= orderData[0].balances &&
//               orderData[0].quantity == executedQty
//             ) {
//               if (orderData[0].executed_quantity == 0) {
//                 await prisma.$queryRaw`
//                     UPDATE balances_inorder SET balances = balances - ${executedQty}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                   `;
//                 await prisma.$queryRaw`
//                     UPDATE buy_sell_pro_limit_open SET status='FILLED',executed_quantity=${executedQty},
//                     api_order_id=${orderId} WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id}
//                   `;
//                 await prisma.$queryRaw`
//                    INSERT INTO balances (user_id, coin_id, balance)
//                    VALUES (${orderData[0].user_id}, ${orderData[0].coin_id}, ${orderData[0].quantity})
//                    ON DUPLICATE KEY UPDATE balance = balance + ${orderData[0].quantity};
//                   `;
//                 const coinBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: orderData[0].coin_id,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(coinBalData?.balance) - orderData[0].quantity;
//                 await prisma.$queryRaw`
//                    INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                    VALUES
//                    (
//                      ${orderData[0].user_id},
//                      ${orderData[0].coin_id},
//                      'cr',
//                      ${opening_balance},
//                      ${coinBalData?.balance},
//                      ${orderData[0].quantity},
//                      'BUY',
//                      ${respOrderId[0].order_id},
//                      UNIX_TIMESTAMP()
//                    )
//                    `;
//                 await prisma.$queryRaw`
//                    INSERT INTO buy_sell_pro_in_order (user_id, coin_id, coin_base,type,usdt_price,quantity,amount,fees,tds,final_amount,
//                     order_id,api_order_id,order_type,status,date_time)
//                   VALUES
//                   (
//                     ${orderData[0].user_id},
//                     ${orderData[0].coin_id},
//                     ${orderData[0].coin_base},
//                     ${orderData[0].type},
//                     ${orderData[0].usdt_price},
//                     ${executedQty},
//                     ${orderData[0].amount},
//                     ${orderData[0].fees},
//                     ${orderData[0].tds},
//                     ${orderData[0].final_amount},
//                     ${respOrderId[0].order_id},
//                     ${orderId},${orderData[0].order_type.toUpperCase()},
//                     'FILLED',${timestamp}
//                     )
//                    `;
//                 // remove duplicate
//                 const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//                 await prisma.$queryRaw(insert_order_response);
//                 //TDS AND FEES Calculation
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//                 const insert_crypto_tds = Prisma.sql`
//                    INSERT INTO crypto_tds (user_id,coin_id,order_id,tds,tds_perc)
//                    VALUES (${orderData[0].user_id},${orderData[0].coin_id},${respOrderId[0].order_id},
//                     ${orderData[0].tds},${fees?.tds})
//                    `;
//                 await prisma.$queryRaw(insert_crypto_tds);
//               } else {
//                 // remove calc from query
//                 const remCoinQnty =
//                   executedQty - orderData[0].executed_quantity;
//                 await prisma.$queryRaw`
//                   UPDATE balances_inorder SET balances = balances - ${remCoinQnty}
//                   WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                 `;
//                 await prisma.$queryRaw`
//                   UPDATE buy_sell_pro_limit_open SET status='FILLED',executed_quantity=${executedQty}
//                   ,api_order_id=${orderId} WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id}
//                 `;
//                 await prisma.$queryRaw`
//                    UPDATE balances SET balance = balance + ${remCoinQnty}
//                    WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                  `;
//                 const coinBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: orderData[0].coin_id,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(coinBalData?.balance) - remCoinQnty;
//                 await prisma.$queryRaw`
//                  INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                  VALUES
//                  (
//                    ${orderData[0].user_id},
//                    ${orderData[0].coin_id},
//                    'cr',
//                    ${opening_balance},
//                    ${coinBalData?.balance},
//                    ${remCoinQnty},
//                    'BUY',
//                    ${respOrderId[0].order_id},
//                    UNIX_TIMESTAMP()
//                  )
//                  `;
//                 //TDS AND FEES Calculation
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//                 const execAmt = remCoinQnty * Number(orderData[0].usdt_price);
//                 const usdtExecFees =
//                   (execAmt * orderData[0].buy_sell_fees) / 100;
//                 const usdtExecTds =
//                   ((execAmt - usdtExecFees) * Number(fees?.tds)) / 100;
//                 const usdtExecFinalAmt = execAmt + (usdtExecFees + usdtExecTds);
//                 await prisma.$queryRaw`
//                  INSERT INTO buy_sell_pro_in_order (user_id, coin_id, coin_base,type,usdt_price,quantity,amount,fees,tds,final_amount,
//                   order_id,api_order_id,order_type,status,date_time)
//                 VALUES
//                 (
//                   ${orderData[0].user_id},
//                   ${orderData[0].coin_id},
//                   ${orderData[0].coin_base},
//                   ${orderData[0].type},
//                   ${orderData[0].usdt_price},
//                   ${remCoinQnty},
//                   ${execAmt},
//                   ${usdtExecFees},
//                   ${usdtExecTds},
//                   ${usdtExecFinalAmt},
//                   ${orderData[0].order_id},
//                   ${orderId},${orderData[0].order_type.toUpperCase()},
//                   'FILLED',${timestamp}
//                   )
//                  `;
//                 const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//                 await prisma.$queryRaw(insert_order_response);
//                 const insert_crypto_tds = Prisma.sql`
//                    INSERT INTO crypto_tds (user_id,coin_id,order_id,tds,tds_perc)
//                    VALUES (${orderData[0].user_id},${orderData[0].coin_id},${respOrderId[0].order_id},
//                     ${usdtExecTds},${fees?.tds})
//                    `;
//                 await prisma.$queryRaw(insert_crypto_tds);
//               }
//             }
//           }
//           //remove exec =0
//           else if (status === 'PARTIALLY_FILLED') {
//             if (orderData[0].quantity - executedQty <= orderData[0].balances) {
//               const remQty = executedQty - orderData[0].executed_quantity;
//               await prisma.$queryRaw`
//                   UPDATE balances_inorder SET balances = balances - ${remQty}
//                   WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                 `;
//               await prisma.$queryRaw`
//                   UPDATE buy_sell_pro_limit_open SET executed_quantity=${executedQty},
//                   api_order_id=${orderId} WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id};
//                 `;
//               await prisma.$queryRaw`
//                    INSERT INTO balances (user_id, coin_id, balance)
//                    VALUES (${orderData[0].user_id}, ${orderData[0].coin_id}, ${remQty})
//                    ON DUPLICATE KEY UPDATE balance = balance + ${remQty};
//                   `;
//               const coinBalData = await prisma.balances.findFirst({
//                 where: {
//                   user_id: orderData[0].user_id,
//                   coin_id: orderData[0].coin_id,
//                 },
//                 select: {
//                   balance: true,
//                 },
//               });
//               const opening_balance = Number(coinBalData?.balance) - remQty;
//               await prisma.$queryRaw`
//                  INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                  VALUES
//                  (
//                    ${orderData[0].user_id},
//                    ${orderData[0].coin_id},
//                    'cr',
//                    ${opening_balance},
//                    ${coinBalData?.balance},
//                    ${remQty},
//                    'BUY',
//                    ${respOrderId[0].order_id},
//                    UNIX_TIMESTAMP()
//                  )
//                  `;
//               //TDS AND FEES Calculation
//               const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//               const execAmt = remQty * Number(orderData[0].usdt_price);
//               const usdtExecFees =
//                 (execAmt * Number(orderData[0].buy_sell_fees)) / 100;
//               const usdtExecTds =
//                 ((execAmt - usdtExecFees) * Number(fees?.tds)) / 100;
//               const usdtExecFinalAmt = execAmt + (usdtExecFees + usdtExecTds);
//               await prisma.$queryRaw`
//                  INSERT INTO buy_sell_pro_in_order (user_id, coin_id, coin_base,type,usdt_price,quantity,amount,fees,tds,final_amount,
//                   order_id,api_order_id,order_type,status,date_time)
//                 VALUES
//                 (
//                   ${orderData[0].user_id},
//                   ${orderData[0].coin_id},
//                   ${orderData[0].coin_base},
//                   ${orderData[0].type},
//                   ${orderData[0].usdt_price},
//                   ${remQty},
//                   ${execAmt},
//                   ${usdtExecFees},
//                   ${usdtExecTds},
//                   ${usdtExecFinalAmt},
//                   ${orderData[0].order_id},
//                   ${orderId},${orderData[0].order_type.toUpperCase()},
//                   'FILLED',${timestamp}
//                   )
//                  `;
//               const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body});
//                    `;
//               await prisma.$queryRaw(insert_order_response);
//               const insert_crypto_tds = Prisma.sql`
//                    INSERT INTO crypto_tds (user_id,coin_id,order_id,tds,tds_perc)
//                    VALUES (${orderData[0].user_id},${orderData[0].coin_id},${respOrderId[0].order_id},
//                     ${usdtExecTds},${fees?.tds})
//                    `;
//               await prisma.$queryRaw(insert_crypto_tds);
//             }
//           } else if (status === 'CANCELED') {
//             if (orderData[0].quantity - executedQty <= orderData[0].balances) {
//               if (orderData[0].executed_quantity == 0) {
//                 const update_bal_inorder_query = Prisma.sql`
//                   UPDATE balances_inorder SET balances=balances-${orderData[0].quantity}
//                   WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                 `;
//                 await prisma.$executeRaw(update_bal_inorder_query);
//                 const update_bal_query = Prisma.sql`
//                     UPDATE balances SET balance=balance+${orderData[0].final_amount}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=5;
//                   `;
//                 await prisma.$executeRaw(update_bal_query);
//                 const usdtBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: 5,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(usdtBalData?.balance) - orderData[0].final_amount;
//                 const insert_wallet_hist_query = Prisma.sql`
//                   INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                   VALUES
//                   (
//                     ${orderData[0].user_id},
//                     5,
//                     'cr',
//                     ${opening_balance},
//                     ${usdtBalData?.balance},
//                     ${orderData[0].final_amount},
//                     'CANCELLED',
//                     ${orderData[0].order_id},
//                     UNIX_TIMESTAMP()
//                   )
//                   `;
//                 await prisma.$executeRaw(insert_wallet_hist_query);
//                 await prisma.$queryRaw`
//                     UPDATE buy_sell_pro_limit_open SET status='CANCELLED',cancelled_date_time=UNIX_TIMESTAMP(),
//                     api_order_id=${orderId} WHERE order_id=${orderData[0].order_id} AND user_id=${orderData[0].user_id};
//                     `;
//               }
//               // executed !=0
//               else {
//                 //TDS AND FEES Calculation
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//                 const remQty =
//                   orderData[0].quantity - orderData[0].executed_quantity;
//                 const execAmt = remQty * Number(orderData[0].usdt_price);
//                 const usdtExecFees =
//                   (execAmt * orderData[0].buy_sell_fees) / 100;
//                 const usdtExecTds =
//                   ((execAmt - usdtExecFees) * Number(fees?.tds)) / 100;
//                 const usdtExecFinalAmt = execAmt + (usdtExecFees + usdtExecTds);
//                 const update_bal_inorder_query = Prisma.sql`
//                     UPDATE balances_inorder SET balances=balances-${remQty}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                   `;
//                 await prisma.$executeRaw(update_bal_inorder_query);
//                 const update_bal_query = Prisma.sql`
//                     UPDATE balances
//                     SET balance = balance + ${usdtExecFinalAmt}
//                     WHERE coin_id = 5 AND user_id = ${orderData[0].user_id};
//                     `;
//                 await prisma.$executeRaw(update_bal_query);
//                 const usdtBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: 5,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(usdtBalData?.balance) - usdtExecFinalAmt;
//                 const insert_wallet_hist_query = Prisma.sql`
//                   INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                   VALUES
//                   (
//                     ${orderData[0].user_id},
//                     5,
//                     'cr',
//                     ${opening_balance},
//                     ${usdtBalData?.balance},
//                     ${usdtExecFinalAmt},
//                     'CANCELLED',
//                     ${orderData[0].order_id},
//                     UNIX_TIMESTAMP()
//                   )
//                   `;
//                 await prisma.$executeRaw(insert_wallet_hist_query);
//                 await prisma.$queryRaw`
//                     UPDATE buy_sell_pro_limit_open SET status='CANCELLED', cancelled_date_time=UNIX_TIMESTAMP(),
//                     executed_quantity=${executedQty},api_order_id=${orderId}
//                     WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id};
//                     `;
//               }
//               const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//               await prisma.$queryRaw(insert_order_response);
//             }
//           }
//         }
//       } else if (orderData[0].type.toUpperCase() === 'SELL') {
//         if (
//           status == 'FILLED' ||
//           status == 'PARTIALLY_FILLED' ||
//           status == 'CANCELED'
//         ) {
//           if (status == 'FILLED') {
//             if (
//               orderData[0].quantity - executedQty <= orderData[0].balances &&
//               orderData[0].quantity == executedQty
//             ) {
//               if (orderData[0].executed_quantity == 0) {
//                 await prisma.$queryRaw`
//                     UPDATE balances_inorder SET balances = balances - ${executedQty}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                   `;
//                 await prisma.$queryRaw`
//                     UPDATE buy_sell_pro_limit_open SET status='FILLED',executed_quantity=${executedQty},
//                     api_order_id=${orderId} WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id}
//                   `;
//                 await prisma.$queryRaw`
//                      UPDATE balances SET balance = balance + ${orderData[0].final_amount}
//                      WHERE user_id=${orderData[0].user_id} AND coin_id=5;
//                    `;
//                 const usdtBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: 5,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(usdtBalData?.balance) - orderData[0].final_amount;
//                 await prisma.$queryRaw`
//                    INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                    VALUES
//                    (
//                      ${orderData[0].user_id},
//                      5,
//                      'cr',
//                      ${opening_balance},
//                      ${usdtBalData?.balance},
//                      ${orderData[0].final_amount},
//                      'SELL',
//                      ${respOrderId[0].order_id},
//                      UNIX_TIMESTAMP()
//                    )
//                    `;
//                 await prisma.$queryRaw`
//                    INSERT INTO buy_sell_pro_in_order (user_id, coin_id, coin_base,type,usdt_price,quantity,amount,fees,tds,final_amount,
//                     order_id,api_order_id,order_type,status,date_time)
//                   VALUES
//                   (
//                     ${orderData[0].user_id},
//                     ${orderData[0].coin_id},
//                     ${orderData[0].coin_base},
//                     ${orderData[0].type},
//                     ${orderData[0].usdt_price},
//                     ${executedQty},
//                     ${orderData[0].amount},
//                     ${orderData[0].fees},
//                     ${orderData[0].tds},
//                     ${orderData[0].final_amount},
//                     ${orderData[0].order_id},
//                     ${orderId},${orderData[0].order_type.toUpperCase()},
//                     'FILLED',${timestamp}
//                     )
//                    `;
//                 const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//                 await prisma.$queryRaw(insert_order_response);
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//                 const insert_crypto_tds = Prisma.sql`
//                   INSERT INTO crypto_tds (user_id,coin_id,order_id,tds,tds_perc)
//                   VALUES (${orderData[0].user_id},${orderData[0].coin_id},${respOrderId[0].order_id},
//                    ${orderData[0].tds},${fees?.tds})
//                   `;
//                 await prisma.$queryRaw(insert_crypto_tds);
//               } else {
//                 //TDS AND FEES Calculation
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//                 const remCoinQnty =
//                   executedQty - orderData[0].executed_quantity;
//                 const execAmt = remCoinQnty * Number(orderData[0].usdt_price);
//                 const usdtExecFees =
//                   (execAmt * orderData[0].buy_sell_fees) / 100;
//                 const usdtExecTds =
//                   ((execAmt - usdtExecFees) * Number(fees?.tds)) / 100;
//                 const usdtExecFinalAmt = execAmt - (usdtExecFees + usdtExecTds);
//                 await prisma.$queryRaw`
//                   UPDATE balances_inorder SET balances = balances - ${remCoinQnty}
//                   WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                 `;
//                 await prisma.$queryRaw`
//                   UPDATE buy_sell_pro_limit_open SET status='FILLED',executed_quantity=${executedQty},
//                   api_order_id=${orderId} WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id}
//                 `;
//                 await prisma.$queryRaw`
//                    UPDATE balances SET balance = balance + ${usdtExecFinalAmt}
//                    WHERE user_id=${orderData[0].user_id} AND coin_id=5;
//                  `;
//                 const usdtBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: 5,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(usdtBalData?.balance) - usdtExecFinalAmt;
//                 await prisma.$queryRaw`
//                  INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                  VALUES
//                  (
//                    ${orderData[0].user_id},
//                    5,
//                    'cr',
//                    ${opening_balance},
//                    ${usdtBalData?.balance},
//                    ${usdtExecFinalAmt},
//                    'SELL',
//                    ${respOrderId[0].order_id},
//                    UNIX_TIMESTAMP()
//                  )
//                  `;
//                 await prisma.$queryRaw`
//                  INSERT INTO buy_sell_pro_in_order (user_id, coin_id, coin_base,type,usdt_price,quantity,amount,fees,tds,final_amount,
//                   order_id,api_order_id,order_type,status,date_time)
//                 VALUES
//                 (
//                   ${orderData[0].user_id},
//                   ${orderData[0].coin_id},
//                   ${orderData[0].coin_base},
//                   ${orderData[0].type},
//                   ${orderData[0].usdt_price},
//                   ${remCoinQnty},
//                   ${execAmt},
//                   ${usdtExecFees},
//                   ${usdtExecTds},
//                   ${usdtExecFinalAmt},
//                   ${orderData[0].order_id},
//                   ${orderId},${orderData[0].order_type.toUpperCase()},
//                   'FILLED',${timestamp}
//                   )
//                  `;
//                 const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//                 await prisma.$queryRaw(insert_order_response);
//                 const insert_crypto_tds = Prisma.sql`
//                   INSERT INTO crypto_tds (user_id,coin_id,order_id,tds,tds_perc)
//                   VALUES (${orderData[0].user_id},${orderData[0].coin_id},${respOrderId[0].order_id},
//                    ${usdtExecTds},${fees?.tds})
//                   `;
//                 await prisma.$queryRaw(insert_crypto_tds);
//               }
//             }
//           } else if (status === 'PARTIALLY_FILLED') {
//             if (orderData[0].quantity - executedQty <= orderData[0].balances) {
//               //TDS AND FEES Calculation
//               const tempFees = await prisma.fees.findFirst({
//                 where: { id: 1 },
//               });
//               const remQty = executedQty - orderData[0].executed_quantity;
//               const tempExecAmt = remQty * Number(orderData[0].usdt_price);
//               const tempUsdtExecFees =
//                 (tempExecAmt * orderData[0].buy_sell_fees) / 100;
//               const tempUsdtExecTds =
//                 ((tempExecAmt - tempUsdtExecFees) * Number(tempFees?.tds)) /
//                 100;
//               const tempUsdtExecFinalAmt =
//                 tempExecAmt - (tempUsdtExecFees + tempUsdtExecTds);
//               await prisma.$queryRaw`
//                   UPDATE balances_inorder SET balances = balances - ${remQty}
//                   WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                 `;
//               await prisma.$queryRaw`
//                   UPDATE buy_sell_pro_limit_open SET executed_quantity=${executedQty},
//                   api_order_id=${orderId} WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id};
//                 `;
//               await prisma.$queryRaw`
//                    UPDATE balances SET balance = balance + ${tempUsdtExecFinalAmt}
//                    WHERE user_id=${orderData[0].user_id} AND coin_id=5;
//                  `;
//               const usdtBalData = await prisma.balances.findFirst({
//                 where: {
//                   user_id: orderData[0].user_id,
//                   coin_id: 5,
//                 },
//                 select: {
//                   balance: true,
//                 },
//               });
//               const opening_balance =
//                 Number(usdtBalData?.balance) - tempUsdtExecFinalAmt;
//               await prisma.$queryRaw`
//                  INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                  VALUES
//                  (
//                    ${orderData[0].user_id},
//                    5,
//                    'cr',
//                    ${opening_balance},
//                    ${usdtBalData?.balance},
//                    ${tempUsdtExecFinalAmt},
//                    'SELL',
//                    ${respOrderId[0].order_id},
//                    UNIX_TIMESTAMP()
//                  )
//                  `;
//               await prisma.$queryRaw`
//                  INSERT INTO buy_sell_pro_in_order (user_id, coin_id, coin_base,type,usdt_price,quantity,amount,fees,tds,final_amount,
//                   order_id,api_order_id,order_type,status,date_time)
//                 VALUES
//                 (
//                   ${orderData[0].user_id},
//                   ${orderData[0].coin_id},
//                   ${orderData[0].coin_base},
//                   ${orderData[0].type},
//                   ${orderData[0].usdt_price},
//                   ${remQty},
//                   ${tempExecAmt},
//                   ${tempUsdtExecFees},
//                   ${tempUsdtExecTds},
//                   ${tempUsdtExecFinalAmt},
//                   ${orderData[0].order_id},
//                   ${orderId},${orderData[0].order_type.toUpperCase()},
//                   'FILLED',${timestamp}
//                   )
//                  `;
//               const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//               await prisma.$queryRaw(insert_order_response);
//               const insert_crypto_tds = Prisma.sql`
//                   INSERT INTO crypto_tds (user_id,coin_id,order_id,tds,tds_perc)
//                   VALUES (${orderData[0].user_id},${orderData[0].coin_id},${respOrderId[0].order_id},
//                    ${tempUsdtExecTds},${tempFees?.tds})
//                   `;
//               await prisma.$queryRaw(insert_crypto_tds);
//             }
//           } else if (status === 'CANCELED') {
//             if (orderData[0].quantity - executedQty <= orderData[0].balances) {
//               if (orderData[0].executed_quantity == 0) {
//                 const update_bal_inorder_query = Prisma.sql`
//                     UPDATE balances_inorder SET balances=balances-${orderData[0].quantity}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                   `;
//                 await prisma.$executeRaw(update_bal_inorder_query);
//                 const update_bal_query = Prisma.sql`
//                     UPDATE balances SET balance=balance+${orderData[0].quantity}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                   `;
//                 await prisma.$executeRaw(update_bal_query);
//                 const coinBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: orderData[0].coin_id,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance =
//                   Number(coinBalData?.balance) - orderData[0].quantity;
//                 const insert_wallet_hist_query = Prisma.sql`
//                   INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                   VALUES
//                   (
//                     ${orderData[0].user_id},
//                     ${orderData[0].coin_id},
//                     'cr',
//                     ${opening_balance},
//                     ${coinBalData?.balance},
//                     ${orderData[0].quantity},
//                     'CANCELLED',
//                     ${orderData[0].order_id},
//                     UNIX_TIMESTAMP()
//                   )
//                   `;
//                 await prisma.$executeRaw(insert_wallet_hist_query);
//                 await prisma.$queryRaw`
//                     UPDATE buy_sell_pro_limit_open SET status='CANCELLED',cancelled_date_time=UNIX_TIMESTAMP(),
//                     api_order_id=${orderId}
//                     WHERE order_id=${orderData[0].order_id} AND user_id=${orderData[0].user_id};
//            `;
//               }
//               // executed !=0
//               else {
//                 //TDS AND FEES Calculation
//                 //const fees = await prisma.fees.findFirst({ where: { id: 1 } });
//                 const remQty =
//                   orderData[0].quantity - orderData[0].executed_quantity;
//                 //const execAmt = remQty * Number(orderData[0].usdt_price);
//                 //const usdtExecFees = (execAmt * orderData[0].buy_sell_fees) / 100;
//                 //const usdtExecTds = (execAmt - usdtExecFees) * Number(fees?.tds) / 100;
//                 //const usdtExecFinalAmt = execAmt - (usdtExecFees + usdtExecTds);
//                 const update_bal_inorder_query = Prisma.sql`
//                     UPDATE balances_inorder SET balances=balances-${remQty}
//                     WHERE user_id=${orderData[0].user_id} AND coin_id=${orderData[0].coin_id};
//                   `;
//                 await prisma.$executeRaw(update_bal_inorder_query);
//                 const update_bal_query = Prisma.sql`
//                     UPDATE balances
//                     SET balance = balance + ${remQty}
//                     WHERE coin_id = ${orderData[0].coin_id} AND user_id = ${orderData[0].user_id};
//                     `;
//                 await prisma.$executeRaw(update_bal_query);
//                 const coinBalData = await prisma.balances.findFirst({
//                   where: {
//                     user_id: orderData[0].user_id,
//                     coin_id: orderData[0].coin_id,
//                   },
//                   select: {
//                     balance: true,
//                   },
//                 });
//                 const opening_balance = Number(coinBalData?.balance) - remQty;
//                 const insert_wallet_hist_query = Prisma.sql`
//                   INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                   VALUES
//                   (
//                     ${orderData[0].user_id},
//                     ${orderData[0].coin_id},
//                     'cr',
//                     ${opening_balance},
//                     ${coinBalData?.balance},
//                     ${remQty},
//                     'CANCELLED',
//                     ${orderData[0].order_id},
//                     UNIX_TIMESTAMP()
//                   )
//                   `;
//                 await prisma.$executeRaw(insert_wallet_hist_query);
//                 await prisma.$queryRaw`
//                     UPDATE buy_sell_pro_limit_open SET status='CANCELLED', cancelled_date_time=UNIX_TIMESTAMP(),
//                     executed_quantity=${executedQty},api_order_id=${orderId}
//                     WHERE order_id=${respOrderId[0].order_id} AND user_id=${orderData[0].user_id};
//                     `;
//               }
//               const insert_order_response = Prisma.sql`
//                    INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                    VALUES (${respOrderId[0].order_id}, ${orderId}, ${req.body})
//                    `;
//               await prisma.$queryRaw(insert_order_response);
//             }
//           }
//         }
//       }
//     }
//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: status,
//     });
//   } catch (error: any) {
//     res.status(200).json({ status: '0', message: error.message });
//   }
// };
//# sourceMappingURL=user.wallet.controller.js.map