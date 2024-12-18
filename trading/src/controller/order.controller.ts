// export const addBuySellOrder = async (req: Request, res: Response) => {
//     try {
//       const { id: user_id } = req.body.user;
//       const {
//         symbol,
//         base,
//         order_type,
//         limit_price,
//         stop_price,
//         oco_stop_limit_price,
//         quantity,
//         type,
//       } = req.body;
  
//       const arrayCoinId: ICoinId[] =
//         await prisma.$queryRaw`SELECT id,coin_decimal,qty_decimal,price_decimal,usdtprice from currencies where symbol=${symbol}`;
//       const coin_id = arrayCoinId[0].id;
//       const coin_decimal = arrayCoinId[0].coin_decimal;
//       const qty_decimal = arrayCoinId[0].qty_decimal;
//       const price_decimal = arrayCoinId[0].price_decimal;
//       const usdtPrice = arrayCoinId[0].usdtprice;
  
//       if (!user_id) {
//         throw new Error("You are not authorized or user is not present");
//       }
  
//       const orderId = generateRandomOrderId().toString();
  
//       const mappedOrderType = mapOrderType(order_type.toUpperCase());
  
//       if (mappedOrderType === "LIMIT") {
//         if (quantity === "" || limit_price === "") {
//           throw new Error("All Fields are required");
//         }
//         if (parseFloat(limit_price) <= 0) {
//           throw new Error("Invalid Limit Price");
//         }
//         if (
//           (typeof quantity != "number" && isNaN(quantity)) ||
//           parseFloat(quantity) <= 0
//         ) {
//           throw new Error("Please enter valid Amount");
//         }
//         if (typeof limit_price != "number" && isNaN(limit_price)) {
//           throw new Error("Please enter valid Limit price");
//         }
//       } else if (mappedOrderType === "MARKET") {
//         if (quantity === "") {
//           throw new Error("All Fields are required");
//         }
//         if (
//           (typeof quantity != "number" && isNaN(quantity)) ||
//           parseFloat(quantity) <= 0
//         ) {
//           throw new Error("Please enter valid Amount");
//         }
//       } else if (mappedOrderType === "STOP_LIMIT") {
//         if (stop_price === "" || quantity === "" || limit_price === "") {
//           throw new Error("All Fields are required");
//         }
//         if (parseFloat(limit_price) <= 0) {
//           throw new Error("Invalid Limit Price");
//         }
//         if (parseFloat(stop_price) <= 0) {
//           throw new Error("Invalid Stop Price");
//         }
//         if (
//           (typeof quantity != "number" && isNaN(quantity)) ||
//           parseFloat(quantity) <= 0
//         ) {
//           throw new Error("Please enter valid Amount");
//         }
//         if (typeof limit_price != "number" && isNaN(limit_price)) {
//           throw new Error("Please enter valid Limit price");
//         }
//         if (typeof stop_price != "number" && isNaN(stop_price)) {
//           throw new Error("Please enter valid Stop price");
//         }
//       }
  
//       let availCoinBal: Number;
//       let availUsdtBal: Number;
  
     
  
//       async function useTempCurrCoinPrice(temp_curr_coin_price: number) {
//         try {
//           let temp_oco_limit_price: number = parseFloat(oco_stop_limit_price);
//           let temp_stop_price: number = parseFloat(stop_price);
//           let temp_limit_price: number = parseFloat(limit_price);
//           const temp_quantity: number = Number(
//             parseFloat(quantity).toFixed(qty_decimal)
//           );
//           const today_date = new Date(); // Get the current date and time
//           const timestamp = Math.floor(today_date.getTime() / 1000);
//           const side_type = type.toString() === "1" ? "BUY" : "SELL";
  
//           if (
//             mappedOrderType === "LIMIT" ||
//             mappedOrderType === "MARKET" ||
//             mappedOrderType === "STOP_LIMIT"
//           ) {
//             if (mappedOrderType === "LIMIT") {
//               temp_stop_price = 0;
//               temp_oco_limit_price = 0;
//             } else if (mappedOrderType === "MARKET") {
//               temp_limit_price = temp_curr_coin_price;
//               temp_oco_limit_price = 0;
//               temp_stop_price = 0;
//             } else if (mappedOrderType === "STOP_LIMIT") {
//               temp_oco_limit_price = 0;
//             }
  
//             const fixedUsdtPrice = temp_limit_price.toFixed(price_decimal);
  
//             let limitAmount: number =
//               Number(fixedUsdtPrice) * temp_quantity;
  
//             // If Type is BUY
//             if (side_type === "BUY") {
//               const usdtBal = await prisma.balances.findFirst({
//                 where: { user_id: user_id, coin_id: 5 },
//               });
  
//               // Check if User has USDT Balance or not for BUY
//               if (
//                 usdtBal != undefined &&
//                 usdtBal.balance != null &&
//                 Number(usdtBal?.balance) >= limitAmount
//               ) {
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
  
//                 //TDS AND FEES Calculation
//                 const usdtFees = (limitAmount * Number(fees?.buy_fees)) / 100;
//                 const usdtTds =
//                   ((limitAmount - usdtFees) * Number(fees?.tds)) / 100;
//                 const usdtFinalAmt = limitAmount + (usdtFees + usdtTds);
  
//                 if (Number(usdtBal?.balance) < usdtFinalAmt) {
//                   throw new Error("Insufficient Balance");
//                 }
  
//                 const response = {
//                   symbol: `${symbol}${base}`,
//                   clientOrderId: orderId,
//                   price: temp_limit_price.toFixed(coin_decimal),
//                   origQty: quantity,
//                   orderId: orderId,
//                   orderListId: -1,
//                   type: mappedOrderType,
//                   side: "BUY",
//                   status: "OPEN",
//                   executedQty: "0",
//                 };
  
//                 const response_query = Prisma.sql`
//               INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//               VALUES (${orderId}, ${orderId}, ${response})`;
//                 await prisma.$queryRaw(response_query);
  
//                 // Update Balance deduct from usdt balance
//                 const bal_query = Prisma.sql`
//                   UPDATE balances SET balance = balance - ${usdtFinalAmt} 
//                   WHERE user_id=${user_id} AND coin_id=5;`;
//                 await prisma.$queryRaw(bal_query);
  
//                 // Insert to buy sell limit open table
//                 await prisma.buy_sell_pro_limit_open.create({
//                   data: {
//                     user_id,
//                     coin_id,
//                     coin_base: base,
//                     type: "BUY",
//                     usdt_price: fixedUsdtPrice,
//                     quantity: temp_quantity,
//                     stop_limit_price: temp_stop_price,
//                     oco_stop_limit_price: temp_oco_limit_price,
//                     amount: limitAmount,
//                     executed_quantity: 0,
//                     tds: usdtTds,
//                     fees: usdtFees,
//                     final_amount: usdtFinalAmt,
//                     order_id: orderId,
//                     order_type: mappedOrderType,
//                     buy_sell_fees: fees?.buy_fees,
//                     date_time: timestamp,
//                   },
//                 });
  
//                 const bal_inorder_query = Prisma.sql`
//                 INSERT INTO balances_inorder (user_id, coin_id, balances)
//                 VALUES (${user_id}, ${coin_id}, ${temp_quantity})
//                 ON DUPLICATE KEY UPDATE balances = balances+${temp_quantity}`;
  
//                 await prisma.$queryRaw(bal_inorder_query);
  
//                 const totalUsdtBal = Number(usdtBal?.balance) - usdtFinalAmt;
  
//                 availUsdtBal = totalUsdtBal;
  
//                 const insert_wallet_hist_query = Prisma.sql`
//                 INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                 VALUES
//                 (
//                   ${user_id},
//                   5,
//                   'dr',
//                   ${usdtBal.balance},
//                   ${totalUsdtBal},
//                   ${usdtFinalAmt},
//                   'BUY',
//                   ${orderId},
//                   UNIX_TIMESTAMP()  
//                 )   
//                 `;
  
//                 await prisma.$queryRaw(insert_wallet_hist_query);
//               } else {
//                 throw new Error("Insufficient Balance!!");
//               }
//             }
  
//             // If Type is SELL
//             else if (side_type === "SELL") {
//               const coinBal = await prisma.balances.findFirst({
//                 where: { user_id: user_id, coin_id: coin_id },
//               });
  
//               // Check if User has Coin BAlance or not for BUY
//               if (
//                 coinBal != undefined &&
//                 coinBal.balance != null &&
//                 Number(coinBal?.balance) >= temp_quantity
//               ) {
//                 const fees = await prisma.fees.findFirst({ where: { id: 1 } });
  
//                 //TDS AND FEES Calculation
//                 const usdtFees = (limitAmount * Number(fees?.sell_fees)) / 100;
//                 const usdtTds =
//                   ((limitAmount - usdtFees) * Number(fees?.tds)) / 100;
//                 const usdtFinalAmt = limitAmount - (usdtFees + usdtTds);
  
//                 const response = {
//                   symbol: `${symbol}${base}`,
//                   clientOrderId: orderId,
//                   price: temp_limit_price.toFixed(coin_decimal),
//                   origQty: quantity,
//                   orderId: orderId,
//                   orderListId: -1,
//                   type: mappedOrderType,
//                   side: "SELL",
//                   status: "OPEN",
//                   executedQty: "0",
//                 };
  
//                 const response_query = Prisma.sql`
//               INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//               VALUES (${orderId}, ${orderId}, ${response})
//                 `;
//                 await prisma.$queryRaw(response_query);
  
//                 // Update Balance deduct from usdt balance
//                 const bal_query = Prisma.sql`
//                   UPDATE balances SET balance = balance - ${temp_quantity} 
//                   WHERE user_id=${user_id} AND coin_id=${coin_id};
//                 `;
//                 await prisma.$queryRaw(bal_query);
  
//                 // Insert to buy sell limit open table
//                 await prisma.buy_sell_pro_limit_open.create({
//                   data: {
//                     user_id,
//                     coin_id,
//                     coin_base: base,
//                     type: "SELL",
//                     usdt_price: fixedUsdtPrice,
//                     quantity: temp_quantity,
//                     amount: limitAmount,
//                     stop_limit_price: temp_stop_price,
//                     oco_stop_limit_price: temp_oco_limit_price,
//                     executed_quantity: 0,
//                     tds: usdtTds,
//                     fees: usdtFees,
//                     final_amount: usdtFinalAmt,
//                     order_id: orderId,
//                     order_type: mappedOrderType,
//                     buy_sell_fees: fees?.sell_fees,
//                     date_time: timestamp,
//                   },
//                 });
  
//                 const bal_inorder_query = Prisma.sql`
//                 INSERT INTO balances_inorder (user_id, coin_id, balances)
//                 VALUES (${user_id}, ${coin_id}, ${temp_quantity})
//                 ON DUPLICATE KEY UPDATE balances = balances+${temp_quantity}`;
  
//                 await prisma.$queryRaw(bal_inorder_query);
  
//                 const totalCoinBal = Number(coinBal?.balance) - temp_quantity;
  
//                 availCoinBal = totalCoinBal;
  
//                 const insert_wallet_hist_query = Prisma.sql`
//                 INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                 VALUES
//                 (
//                   ${user_id},
//                   ${coin_id},
//                   'dr',
//                   ${coinBal.balance},
//                   ${totalCoinBal},
//                   ${temp_quantity},
//                   'SELL',
//                   ${orderId},
//                   UNIX_TIMESTAMP()   
//                 )   
//                 `;
  
//                 await prisma.$queryRaw(insert_wallet_hist_query);
//               } else {
//                 throw new Error("Insufficient Balance!!");
//               }
//             }
//           } else {
//             throw new Error("Please select valid OrderType!!");
//           }
  
//           // Configure winston for combined logging
//           const logger = winston.createLogger({
//             level: "info",
//             format: winston.format.combine(
//               winston.format.timestamp(),
//               winston.format.json()
//             ),
//             transports: [
//               new winston.transports.File({
//                 filename: "logs/order_response.log",
//               }),
//             ],
//           });
  
//           try {
//             const response = await axios.post(
//               `http://192.168.1.129:4001/api/order`,
//               {
//                 symbol: `${symbol}${base}`,
//                 side: side_type,
//                 type: order_type,
//                 clientOrderId: orderId,
//                 timeinFOrce: "GTC",
//                 quantity,
//                 limit_price,
//                 timestamp: Date.now(),
//                 recvWindow: 5000,
//               }
//             );
  
//             const buySellData = await prisma.buy_sell_pro_limit_open.findFirst({
//               where: {
//                 user_id: user_id,
//                 order_id: orderId,
//               },
//               select: {
//                 final_amount: true,
//               },
//             });
  
//             const balData: IBalance[] = await prisma.$queryRaw`
//               SELECT COALESCE(balance, 0) AS balance
//               FROM balances
//               WHERE user_id = ${user_id} AND coin_id IN (5,${coin_id})
//               ORDER BY coin_id = 5 DESC;            
//               `;
  
//             // Check if the order was successfull
//             if (response.data.status === "NEW") {
//               logger.info("Order placed successfully:", response.data);
  
//               const response_query = Prisma.sql`
//                  INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                  VALUES (${orderId}, ${orderId}, ${response.data})`;
  
//               await prisma.$queryRaw(response_query);
//               res.status(200).json({
//                 status: "1",
//                 message: "Successfully order placed",
//                 data: {
//                   availableBalance:
//                     side_type === "BUY" ? availUsdtBal : availCoinBal,
//                 },
//               });
//               return;
//             } else {
//               logger.error("Order failed. Response:", response.data);
  
//               const response_query = Prisma.sql`
//                  INSERT INTO buy_sell_order_response (order_id, api_order_id, response)
//                  VALUES (${orderId}, ${orderId}, ${response})`;
  
//               await prisma.$queryRaw(response_query);
  
//               const bal_inorder_query = Prisma.sql`
//                 UPDATE balances_inorder 
//                 SET balances = CASE 
//                       WHEN balances - ${quantity} < 0 THEN 0 
//                       ELSE balances - ${quantity} 
//                 END 
//                 WHERE user_id = ${user_id} AND coin_id = ${coin_id};
//                 `;
  
//               await prisma.$queryRaw(bal_inorder_query);
  
//               let balAddBack;
//               let returncoinId;
//               let opening_balance;
//               let remaining_balance;
//               if (side_type === "BUY") {
//                 balAddBack = buySellData?.final_amount;
//                 opening_balance = balData[0].balance;
//                 remaining_balance =
//                   Number(balData[0].balance) + Number(buySellData?.final_amount);
//                 returncoinId = 5;
//                 //availUsdtBal = Number(availUsdtBal) + Number(balAddBack);
//               } else if (side_type === "SELL") {
//                 balAddBack = quantity;
//                 opening_balance = balData[1].balance;
//                 remaining_balance =
//                   Number(balData[1].balance) + Number(buySellData?.final_amount);
//                 returncoinId = coin_id;
//                 //availCoinBal = Number(availCoinBal) + Number(balAddBack);
//               }
  
//               const update_bal_query = Prisma.sql`
//                 UPDATE balances SET balance=balance+${balAddBack} WHERE user_id=${user_id} AND coin_id=${returncoinId}`;
  
//               await prisma.$queryRaw(update_bal_query);
  
//               const insert_wallet_query = Prisma.sql`
//                 INSERT INTO wallet_history (user_id, coin_id, type,opening_balance, remaining_balance, balance, remark, order_id, date_time)
//                 VALUES
//                 (
//                   ${user_id},
//                   ${returncoinId},
//                   'cr',
//                   ${opening_balance},
//                   ${remaining_balance},
//                   ${balAddBack},
//                   ${side_type},
//                   ${orderId},
//                   UNIX_TIMESTAMP()   
//                 )`;
  
//               await prisma.$queryRaw(insert_wallet_query);
  
//               await prisma.$queryRaw`
//                 UPDATE buy_sell_pro_limit_open SET status='CANCELLED' WHERE user_id=${user_id} AND order_id=${orderId};
//                 `;
//               throw new Error(`Order failed. Response:', ${response.data}`);
//             }
//           } catch (error) {
//             logger.error("Error placing order:", (error as Error).message);
//             res
//               .status(200)
//               .json({ status: "0", message: (error as Error).message });
//             return;
//           }
//         } catch (error) {
//           res
//             .status(200)
//             .json({ status: "0", message: (error as Error).message });
//         }
//       }
//     } catch (err) {
//       res.status(500).json({ status: "0", message: (err as Error).message });
//     }
//   };
  
//   // Function to convert Unix timestamp to yyyy-mm-dd hh-mm-ss format
  