const WebSocket = require("ws");
const { Kafka } = require("kafkajs");
const {updateBalances, raw_query, Get_Where_Universal_Data, Update_Universal_Data,updateOrInsertBalances, Create_Universal_Data } = require("../db_query");
const { redisClient } =require('../config/redisConnection');
const wss = new WebSocket.Server({ port: 9001 });
let frontendClients = [];
const Big = require("big.js");

redisClient.connect((err) => {
  if (err) {
    console.error("Redis connection error:", err);
  }
  console.log("Redis client connected");
});

// Kafka client and consumer setup
const kafka = new Kafka({
  clientId: "binance-consumer",
  brokers: ["localhost:9092"],                 // Adjust your Kafka broker address
});

const consumer = kafka.consumer({ groupId: "execution-group" });

// Connect the Kafka consumer
const connectKafka = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "execution-report", fromBeginning: true });
  await consumeMessages();
};

// Function to handle ping-pong mechanism
const startPingPong = () => {
  setInterval(() => {
    frontendClients.forEach((client) => {
      if (client.isAlive === false) {
        console.log(`Frontend client ${client.userId || "unknown"} timed out`);
        client.terminate(); // Forcefully close the connection
        frontendClients = frontendClients.filter((c) => c !== client); // Remove from active clients
      } else {
        client.isAlive = false;
        client.ping(); // Send ping to client
      }
    });
  }, 5000); // Ping interval
};

// Handle WebSocket connection with frontend clients
wss.on("connection", (ws) => {
  console.log("Frontend client connected");
  ws.isAlive = true; // Mark client as alive
  frontendClients.push(ws);

  ws.on("message", (message) => {
    if (message === "pong") {
      ws.isAlive = true;            // Mark client as alive on receiving pong
      return;
    }

    // Handle other messages
    const data = JSON.parse(message);
    if (data.user_id) {
      ws.userId = data.user_id; // Store user ID in WebSocket object
      console.log(`Frontend client ${ws.userId} connected`);
    }
  });

  ws.on("close", () => {
    console.log(`Frontend client ${ws.userId || "unknown"} disconnected`);
    frontendClients = frontendClients.filter((client) => client !== ws);
  });

  ws.on("error", (error) => {
    console.log(`Frontend client ${ws.userId || "unknown"} disconnected due to error`);
    frontendClients = frontendClients.filter((client) => client !== ws);
  });

  ws.on("pong", () => {
    // console.log(`Pong received from frontend client ${ws.userId || "unknown"}`);
    ws.isAlive = true; // Mark client as alive on receiving pong
  });
});

// Start ping-pong mechanism
startPingPong();

// Function to send messages to frontend clients
const sendMessageToClients = (report) => {
  frontendClients.forEach((client) => {
    if (client.userId === report.user_id) {
      client.send(JSON.stringify(report));
    }
  });
};

const processedOrders = new Set();

// Consume messages from Kafka and process them
const consumeMessages = async () => {
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try{
      const data = JSON.parse(message.value.toString());

      const AccountName = data.account
      if (!processedOrders.has(data.I)) {
        processedOrders.add(data.I);
        
      if (topic === "execution-report") {

      const userIdFromOrder = data.X === "CANCELED" ? data.C.split("-")[0] : data.c.split("-")[0];
        const orderPrice = data.X === "NEW" ? data.p : data.X === "CANCELED" ? data.P : new Big(data.Z).div(data.z).toFixed(8); // accurate division
      
        const reportData = {
          order_id: data.X === "CANCELED" ? data.C : data.c,
          base_quantity: data.q,
          quote_quantity: data.S === "BUY" ? data.Q : data.Z,
          order_price: orderPrice,
          type: data.S,
          order_type: data.o,
          stop_limit_price: data.P,
          oco_stop_limit_price: null,
          executed_base_quantity: data.z,
          executed_quote_quantity: data.Z,
          status: data.X,
          created_at: data.O,
        };
      
        let count = 0;
        if (data.t != -1) {
          const row_count = await raw_query(
            "SELECT COUNT(*) AS count FROM buy_sell_pro_limit_open WHERE trade_id = ?",
            [data.t]
          );
          count = row_count[0].count;
        }
      
        if (count == 0) {
          const symbol = data.s;
      
          const pairInfo = await Get_Where_Universal_Data(
            "id,base_asset_id,quote_asset_id",
            "crypto_pair",
            { pair_symbol: symbol }
          );
          const pairId = pairInfo[0].id;
          const base_asset_id = pairInfo[0].base_asset_id;
          const quote_asset_id = pairInfo[0].quote_asset_id;
      
          const userLevelInfo = await Get_Where_Universal_Data(
            "kyc_level",
            "user",
            { user_id: userIdFromOrder }
          );
          const tradingLevel = userLevelInfo[0].kyc_level;
          const feeColumn = `trade_fee_L${tradingLevel}`;
      
          const pairFees = await raw_query(
            `SELECT ${feeColumn} AS trade_fee FROM fees WHERE pair_id = ?`,
            [pairId]
          );
          const pair_fees_value = new Big(pairFees[0].trade_fee); // fee in percent, e.g., 0.1
      
          // Fees and net amount after fees
          const fees = data.S === "BUY"
            ? new Big(data.l).times(pair_fees_value).div(100).toFixed(8)
            : new Big(data.Y).times(pair_fees_value).div(100).toFixed(8);
      
          const total_fees = data.S === "BUY"
            ? new Big(data.z).times(pair_fees_value).div(100).toFixed(8)
            : new Big(data.Z).times(pair_fees_value).div(100).toFixed(8);
      
          const base_amount_after_fees = data.S === "BUY"
            ? new Big(data.l).minus(fees).toFixed(8)
            : "0";
      
          const quote_amount_after_fees = data.S === "SELL"
            ? new Big(data.Y).minus(fees).toFixed(8)
            : "0";
      
        if (data.X === "NEW") {
             await redisClient.incr(`OpenOrderCount:${AccountName}:${pairId}`);
             const report = {
               status: "1",
               user_id: userIdFromOrder,
               message: `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`,
               data: reportData,
             };
             sendMessageToClients(report);
       
             if (data.S === "BUY") {
               if (data.o === "LIMIT") {
                 const quote_quantity = new Big(data.q).times(data.p).toFixed(8);
                 console.log('quote_quantity: ', quote_quantity);
                 await updateOrInsertBalances({
                   userId: userIdFromOrder,
                   currencyId: quote_asset_id,
                   currentBalanceChange: new Big(quote_quantity).neg().toString(),
                   lockedBalanceChange: quote_quantity,
                 });
               }
             }

              if (data.S === "SELL") {
                await updateOrInsertBalances({
                  userId: userIdFromOrder,
                  currencyId: base_asset_id,
                  currentBalanceChange: new Big(data.q).neg().toString(),
                  lockedBalanceChange: new Big(data.q).toString(),
                });
              }
          }

        if (data.X === "PARTIALLY_FILLED") {
               const report = {
                 status: "2",
                 user_id: userIdFromOrder,
                 message: `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
                 data: reportData,
               };
               sendMessageToClients(report);
             
               const dataY = Big(data.Y);
               const dataL = Big(data.l);
               const orderValue = Big(data.q).times(data.p);
               const executedValue = Big(data.l).times(data.L);
               const baseAmountAfterFees = Big(base_amount_after_fees);
               const quoteAmountAfterFees = Big(quote_amount_after_fees);
             
               if (data.S === "BUY") {
                 if (data.o === "MARKET") {
                   await updateBalances(
                     {
                       userId: userIdFromOrder,
                       currencyId: base_asset_id,
                       currentBalanceChange: baseAmountAfterFees.toString(),
                       mainBalanceChange: baseAmountAfterFees.toString(),
                       lockedBalanceChange: "0",
                     },
                     {
                       userId: userIdFromOrder,
                       currencyId: quote_asset_id,
                       mainBalanceChange: dataY.neg().toString(),
                       currentBalanceChange: dataY.neg().toString(),
                       lockedBalanceChange: "0",
                     }
                   );
                 }
                 if (data.o === "LIMIT") {
                   if (orderValue.eq(executedValue)) {
                     await updateBalances(
                       {
                         userId: userIdFromOrder,
                         currencyId: base_asset_id,
                         mainBalanceChange: baseAmountAfterFees.toString(),
                         currentBalanceChange: baseAmountAfterFees.toString(),
                         lockedBalanceChange: "0",
                       },
                       {
                         userId: userIdFromOrder,
                         currencyId: quote_asset_id,
                         mainBalanceChange: dataY.neg().toString(),
                         currentBalanceChange: dataY.neg().toString(),
                         lockedBalanceChange: "0",
                       }
                     );
                   } else {
                     await updateBalances(
                       {
                         userId: userIdFromOrder,
                         currencyId: base_asset_id,
                         mainBalanceChange: baseAmountAfterFees.toString(),
                         currentBalanceChange: baseAmountAfterFees.toString(),
                         lockedBalanceChange: "0",
                       },
                       {
                         userId: userIdFromOrder,
                         currencyId: quote_asset_id,
                         mainBalanceChange: dataY.neg().toString(),
                         lockedBalanceChange: orderValue.neg().toString(),
                         currentBalanceChange: "0",
                       }
                     );
                   }
    }
  }

  if (data.S === "SELL") {
    await updateBalances(
      {
        userId: userIdFromOrder,
        currencyId: base_asset_id,
        mainBalanceChange: dataL.neg().toString(),
        lockedBalanceChange: dataL.neg().toString(),
        currentBalanceChange: "0",
      },
      {
        userId: userIdFromOrder,
        currencyId: quote_asset_id,
        mainBalanceChange: quoteAmountAfterFees.toString(),
        currentBalanceChange: quoteAmountAfterFees.toString(),
        lockedBalanceChange: "0",
      }
    );
  }
        }
          
        if (data.X === "TRADE") {
             const report = {
               status: "3",
               user_id: userIdFromOrder,
               message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`,
               data: reportData,
             };
             sendMessageToClients(report);
           
             const orderValue = Big(data.q).times(data.p);
             const executedValue = Big(data.l).times(data.L);
             const diff = orderValue.minus(executedValue);
             const dataY = Big(data.Y);
             const baseAmountAfterFees = Big(base_amount_after_fees);
             const quoteAmountAfterFees = Big(quote_amount_after_fees);
           
             if (data.S === "BUY") {
    if (data.o === "MARKET") {
      await updateBalances(
        {
          userId: userIdFromOrder,
          currencyId: base_asset_id,
          mainBalanceChange: baseAmountAfterFees.toString(),
          currentBalanceChange: baseAmountAfterFees.toString(),
          lockedBalanceChange: "0",
        },
        {
          userId: userIdFromOrder,
          currencyId: quote_asset_id,
          mainBalanceChange: dataY.neg().toString(),
          currentBalanceChange: dataY.neg().toString(),
          lockedBalanceChange: "0",
        }
      );
    }

    if (data.o === "LIMIT") {
      if (orderValue.eq(executedValue)) {
        await updateBalances(
          {
            userId: userIdFromOrder,
            currencyId: base_asset_id,
            mainBalanceChange: baseAmountAfterFees.toString(),
            currentBalanceChange: baseAmountAfterFees.toString(),
            lockedBalanceChange: "0",
          },
          {
            userId: userIdFromOrder,
            currencyId: quote_asset_id,
            mainBalanceChange: dataY.neg().toString(),
            lockedBalanceChange: dataY.neg().toString(),
            currentBalanceChange: "0",
          }
        );
      } else {
        await updateBalances(
          {
            userId: userIdFromOrder,
            currencyId: base_asset_id,
            mainBalanceChange: baseAmountAfterFees.toString(),
            currentBalanceChange: baseAmountAfterFees.toString(),
            lockedBalanceChange: "0",
          },
          {
            userId: userIdFromOrder,
            currencyId: quote_asset_id,
            mainBalanceChange: dataY.neg().toString(),
            lockedBalanceChange: orderValue.neg().toString(),
            currentBalanceChange: diff.toString(),
          }
        );
      }
    }
             }
           
             if (data.S === "SELL") {
    await updateBalances(
      {
        userId: userIdFromOrder,
        currencyId: base_asset_id,
        mainBalanceChange: Big(data.l).neg().toString(),
        lockedBalanceChange: Big(data.l).neg().toString(),
        currentBalanceChange: "0",
      },
      {
        userId: userIdFromOrder,
        currencyId: quote_asset_id,
        mainBalanceChange: quoteAmountAfterFees.toString(),
        currentBalanceChange: quoteAmountAfterFees.toString(),
        lockedBalanceChange: "0",
      }
    );
             }
        }
          
        if (data.X === "FILLED") {
             await redisClient.decr(`OpenOrderCount:${AccountName}:${pairId}`);
             const report = {
               status: "3",
               user_id: userIdFromOrder,
               message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
               data: reportData,
             };
             sendMessageToClients(report);
           
             const orderValue = Big(data.q).times(data.p);
             const executedValue = Big(data.l).times(data.L);
             const dataY = Big(data.Y);
             const baseAmountAfterFees = Big(base_amount_after_fees);
             const quoteAmountAfterFees = Big(quote_amount_after_fees);
           
             if (data.S === "BUY") {
               if (data.o === "MARKET") {
                 await updateBalances(
                   {
                     userId: userIdFromOrder,
                     currencyId: base_asset_id,
                     mainBalanceChange: baseAmountAfterFees.toString(),
                     currentBalanceChange: baseAmountAfterFees.toString(),
                     lockedBalanceChange: "0",
                   },
                   {
                     userId: userIdFromOrder,
                     currencyId: quote_asset_id,
                     mainBalanceChange: dataY.neg().toString(),
                     currentBalanceChange: dataY.neg().toString(),
                     lockedBalanceChange: "0",
                   }
                 );
               }
               if (data.o === "LIMIT") {
                 if (orderValue.eq(executedValue)) {
                   await updateBalances(
                     {
                       userId: userIdFromOrder,
                       currencyId: base_asset_id,
                       mainBalanceChange: baseAmountAfterFees.toString(),
                       currentBalanceChange: baseAmountAfterFees.toString(),
                       lockedBalanceChange: "0",
                     },
                     {
                       userId: userIdFromOrder,
                       currencyId: quote_asset_id,
                       mainBalanceChange: dataY.neg().toString(),
                       lockedBalanceChange: dataY.neg().toString(),
                       currentBalanceChange: "0",
                     }
                   );
                 } else {
                   const diff = orderValue.minus(executedValue);
                   await updateBalances(
                     {
                       userId: userIdFromOrder,
                       currencyId: base_asset_id,
                       mainBalanceChange: baseAmountAfterFees.toString(),
                       currentBalanceChange: baseAmountAfterFees.toString(),
                       lockedBalanceChange: "0",
                     },
                     {
                       userId: userIdFromOrder,
                       currencyId: quote_asset_id,
                       mainBalanceChange: dataY.neg().toString(),
                       lockedBalanceChange: orderValue.neg().toString(),
                       currentBalanceChange: diff.toString(),
                     }
                   );
                 }
               }
             }
           
             if (data.S === "SELL") {
               await updateBalances(
                 {
                   userId: userIdFromOrder,
                   currencyId: base_asset_id,
                   mainBalanceChange: Big(data.l).neg().toString(),
                   lockedBalanceChange: Big(data.l).neg().toString(),
                   currentBalanceChange: "0",
                 },
                 {
                   userId: userIdFromOrder,
                   currencyId: quote_asset_id,
                   mainBalanceChange: quoteAmountAfterFees.toString(),
                   currentBalanceChange: quoteAmountAfterFees.toString(),
                   lockedBalanceChange: "0",
                 }
               );
             }
        }
          
        if (data.X === "CANCELED") {
            await redisClient.decr(`OpenOrderCount:${AccountName}:${pairId}`);
            const report = {
              status: "4",
              user_id: userIdFromOrder,
              message: `Cancelled ${data.o} Order Placed, Order Id: ${data.c}`,
              data: reportData,
            };
            sendMessageToClients(report);
          
            if (data.S === "BUY") {
    await updateOrInsertBalances({
      userId: userIdFromOrder,
      currencyId: base_asset_id,
      currentBalanceChange: Big(data.Y).toString(),
      lockedBalanceChange: Big(data.Y).neg().toString(),
    });
            }
          
            if (data.S === "SELL") {
    await updateOrInsertBalances({
      userId: userIdFromOrder,
      currencyId: quote_asset_id,
      currentBalanceChange: Big(data.l).toString(),
      lockedBalanceChange: Big(data.l).neg().toString(),
    });
            }
        }
          
        if (data.X === "FILLED" || data.X === "PARTIALLY_FILLED" || data.X === "TRADE") {
            const filterQuery = { order_id: data.c };

            const baseQty = new Big(data.q || 0);
            const quoteQty = new Big(data.S === "BUY" ? data.Q : data.Z || 0);
            const execBaseQty = new Big(data.z || 0);
            const execQuoteQty = new Big(data.Z || 0);
            const orderPrice = execBaseQty.gt(0) ? execQuoteQty.div(execBaseQty).toFixed(8) : "0.00000000";
          
            const updatedData = {
    status: data.X,
    base_quantity: baseQty.toString(),
    quote_quantity: quoteQty.toString(),
    order_price: orderPrice,
    executed_base_quantity: execBaseQty.toString(),
    executed_quote_quantity: execQuoteQty.toString(),
    stop_limit_price: data.P,
    final_amount: (data.S === "BUY" ? new Big(base_amount_after_fees) : new Big(quote_amount_after_fees)).toString(),
    order_id: data.c,
    trade_id: data.t,
    api_order_id: data.I,
    order_type: data.o,
    buy_sell_fees: total_fees.toString(),
    api_id: data.i,
    response: JSON.stringify(data),
    date_time: data.T,
    response_time: data.E
            };
          
            // Check if new API order id is greater
            const api_order_id = await Get_Where_Universal_Data("api_order_id", "buy_sell_pro_limit_open", { order_id: data.c });
          
            if (api_order_id.length > 0 && new Big(api_order_id[0].api_order_id || 0).lt(data.I)) {
              await Update_Universal_Data("buy_sell_pro_limit_open", updatedData, filterQuery);
          
              await Create_Universal_Data('trade_fee', {
                order_id: data.c,
                user_id: userIdFromOrder,
                pair_id: parseInt(pairId),
                currency_id: data.S === "BUY" ? base_asset_id : quote_asset_id,
                amount: (data.S === "BUY" ? new Big(data.l) : new Big(data.Y)).toString(),
                          fee: new Big(fees).toString(),
                        });
                      }
        }
          
          // Always create a record in buy_sell_pro_in_order
        await Create_Universal_Data('buy_sell_pro_in_order', {
            pair_id: pairId,
            status: data.X,
            user_id: userIdFromOrder,
            base_quantity: new Big(data.q || 0).toString(),
            quote_quantity: new Big(data.S === "BUY" ? data.Q : data.Z || 0).toString(),
            order_price: "0.0",
            executed_base_quantity: new Big(data.z || 0).toString(),
            executed_quote_quantity: new Big(data.Z || 0).toString(),
            stop_limit_price: data.P,
            executed_base_after_fees: new Big(base_amount_after_fees).toString(),
            executed_quote_after_fees: new Big(quote_amount_after_fees).toString(),
            order_id: data.X === "CANCELED" ? data.C : data.c,
            trade_id: data.t,
            api_order_id: data.I,
            order_type: data.o,
            buy_sell_fees: new Big(total_fees).toString(),
            api_id: data.i,
            date_time: data.T,
            api: 'order consumer report'
          });
      }
      };
      }
    }catch(e){
      console.log('Error in consumer: ',e)
    }
    },
  });
};

connectKafka();
// consumeMessages();






// const WebSocket = require("ws");
// const { Kafka } = require("kafkajs");
// const prisma = require("./config/prisma.client");
// const db = require("./db_query");
// const { Prisma } = require("@prisma/client");

// const wss = new WebSocket.Server({ port: 9001 });
// let frontendClients = [];

// // Kafka client and consumer setup
// const kafka = new Kafka({
//   clientId: "binance-consumer",
//   brokers: ["localhost:9092"], // Adjust your Kafka broker address
// });

// const consumer = kafka.consumer({ groupId: "execution-group" });

// // Connect the Kafka consumer
// const connectKafka = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: "execution-report", fromBeginning: false });
//   await consumer.subscribe({
//     topic: "execution-report-update",
//     fromBeginning: false,
//   });
//   await consumeMessages();
// };

// // Handle WebSocket connection with frontend clients
// wss.on("connection", (ws) => {
//   console.log("Frontend client connected");
//   frontendClients.push(ws);

//   ws.on("message", (message) => {
//     const data = JSON.parse(message);
//     if (data.user_id) {
//       const userId = data.user_id;
//       ws.userId = userId;
//     }
//   });

//   ws.on("close", () => {
//     console.log("Frontend client disconnected");
//     frontendClients = frontendClients.filter((client) => client !== ws);
//   });
// });

// // Function to send messages to frontend clients
// const sendMessageToClients = (report) => {
//   frontendClients.forEach((client) => {
//     if (client.userId === report.user_id) {
//       console.log(`Sending message to frontend client.`);
//       client.send(JSON.stringify(report));
//     }
//   });
// };

// // Consume messages from Kafka and process them
// const consumeMessages = async () => {
//   await consumer.run({
//     eachMessage: async ({ topic, message }) => {
//       const data = JSON.parse(message.value.toString());
//       console.log('NEW REPORT: ', data)
//       if (topic === "execution-report") {
//         const [userIdFromOrder, uniquePart] = data.c.split("-");
//         // Handle report data based on `data.X` status and send to clients
//         if (data.X === "NEW") {
//           console.log('NEW ORDER : REPORT');
//           const report = {
//             status: "1",
//             user_id: userIdFromOrder,     
//             message: `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`,
//             data: {
//               order_id: data.c, // Order ID
//               base_quantity: data.q, // Order quantity
//               quote_quantity: data.Q, // Cumulative quote asset transacted quantity
//               order_price: data.p, // Order price
//               type: data.S, // Order type
//               order_type: data.o, // Order type
//               stop_limit_price: data.P, // Stop price
//               oco_stop_limit_price: null, // Not present in the execution report
//               executed_base_quantity: data.z, // Last executed quantity
//               executed_quote_quantity: data.Z, // Last quote asset transacted quantity
//               status: data.X, // Current order status
//               created_at: data.O, // Order creation time
//           },
//           };
//           sendMessageToClients(report);
//           // console.log(
//           //   `\n New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`
//           // );
//         }
//         if (data.X === "PARTIALLY_FILLED") {
//           console.log('PARTIALLY FILLED ORDER : REPORT');
//           const report = {
//             status: "2",
//             user_id: userIdFromOrder,
//             message: `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
//             data: {
//               order_id: data.c, // Order ID
//               base_quantity: data.q, // Order quantity
//               quote_quantity: data.Q, // Cumulative quote asset transacted quantity
//               order_price: data.p, // Order price
//               type: data.S, // Order type
//               order_type: data.o, // Order type
//               stop_limit_price: data.P, // Stop price
//               oco_stop_limit_price: null, // Not present in the execution report
//               executed_base_quantity: data.z, // Last executed quantity
//               executed_quote_quantity: data.Z, // Last quote asset transacted quantity
//               status: data.X, // Current order status
//               created_at: data.O, // Order creation time
//             },
//           };
//           sendMessageToClients(report);
//           // console.log(
//           //   `\nOrder Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
//           // );
//         }
//         if (data.X === "TRADE") {
//           console.log('TRADE ORDER : REPORT');
//           // console.log(
//           //   `\nOrder Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`
//           // );
//           const report = {
//             status: "3",
//             user_id: userIdFromOrder,
//             message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`,
//             data: {
//               order_id: data.c, // Order ID
//               base_quantity: data.q, // Order quantity
//               quote_quantity: data.Q, // Cumulative quote asset transacted quantity
//               order_price: data.p, // Order price
//               type: data.S, // Order type
//               order_type: data.o, // Order type
//               stop_limit_price: data.P, // Stop price
//               oco_stop_limit_price: null, // Not present in the execution report
//               executed_base_quantity: data.z, // Last executed quantity
//               executed_quote_quantity: data.Z, // Last quote asset transacted quantity
//               status: data.X, // Current order status
//               created_at: data.O, // Order creation time
//             },
//           };
//           sendMessageToClients(report);
//         }
//         if (data.X === "FILLED") {
//           console.log('FILLED ORDER : REPORT');
//           // console.log(
//           //   `\nOrder Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
//           // );
//           const report = {
//             status: "3",
//             user_id: userIdFromOrder,
//             message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
//             data: {
//               order_id: data.c, // Order ID
//               base_quantity: data.q, // Order quantity
//               quote_quantity: data.Q, // Cumulative quote asset transacted quantity
//               order_price: data.p, // Order price
//               type: data.S, // Order type
//               order_type: data.o, // Order type
//               stop_limit_price: data.P, // Stop price
//               oco_stop_limit_price: null, // Not present in the execution report
//               executed_base_quantity: data.z, // Last executed quantity
//               executed_quote_quantity: data.Z, // Last quote asset transacted quantity
//               status: data.X, // Current order status
//               created_at: data.O, // Order creation time
//             },
//           };
//           sendMessageToClients(report);
//         }
//         if (data.X === "CANCELED") {
//           console.log('CANCELED ORDER : REPORT');
//           const [userIdFromOrder, uniquePart] = data.C.split("-");

//           const report = {
//             status: "4",
//             user_id: userIdFromOrder,
//             message: `Cancelled ${data.o} Order Placed, Order Id: ${data.c}`,
//             data: {
//               order_id: data.C, // Order ID
//               base_volume: data.q, // Order quantity
//               type: data.S, // Order type
//               order_type: data.o, // Order type
//               quote_volume: data.Z, // Cumulative quote asset transacted quantity
//               order_price: data.p, // Order price
//               stop_limit_price: data.P, // Stop price
//               oco_stop_limit_price: null, // Not present in the execution report
//               executed_base_volume: data.l, // Last executed quantity
//               executed_quote_volume: data.Y, // Last quote asset transacted quantity
//               status: data.X, // Current order status
//               cancelled_date_time: new Date(data.O).toLocaleString(),
//               created_at: new Date(data.O).toLocaleString(), // Order creation time
//             },
//           };
//           sendMessageToClients(report);
//           // console.log(`\nCancelled ${data.o} Order, Order Id: ${data.c}`);
//         }
//       } else if (topic === "execution-report-update") {
//         const [userIdFromOrder, uniquePart] = data.c.split("-");
//         var count = 0;
//         if (data.t != -1) {
//           let row_count = await db.raw_query(
//             "SELECT COUNT(*) AS count FROM buy_sell_pro_limit_open WHERE trade_id = ?",
//             [data.t]
//           );
//           count = row_count[0].count;
//         }
//         if (count == 0) {
//           const symbol = data.s;
//           //get pair_id,base_asset_id,quote_asset_id from crypto_pair table
//           const pair_id = await db.Get_Where_Universal_Data(
//             "pair_id,base_asset_id,quote_asset_id",
//             "crypto_pair",
//             { pair_symbol: symbol }
//           );
         
//           const base_asset_id = pair_id[0].base_asset_id;
//           const quote_asset_id = pair_id[0].quote_asset_id;
//           // Handle report data based on `data.X` status and send to clients
//           if (data.X === "NEW") {
//             console.log('New Order Placed')
//             // console.log(
//             //   `\nNew ${data.o} Order DATA UPDATED, Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`
//             // );
//             if (data.S === "BUY") {
//               if (data.o === "LIMIT") {
//                 console.log('quantity: ', data.q, 'price: ', data.p);
//                 const quote_quantity = (data.q * data.p).toFixed(8);
//                 console.log('quote_quantity: ', quote_quantity);
//                const updateBalance =  await db.raw_query(
//                   "UPDATE balances SET current_balance = current_balance - ?, locked_balance = locked_balance + ? WHERE user_id = ? AND currency_id = ?",
//                   [
//                     quote_quantity,
//                     quote_quantity,
//                     userIdFromOrder,
//                     quote_asset_id,
//                   ]
//                 );
//               }
//               // else if(data.o === "MARKET"){
//               //   console.log("BUY ORDER CREATED ",userIdFromOrder , base_asset_id, quote_asset_id, data.Z);
//               //   await db.raw_query('UPDATE balances SET current_balance = current_balance - ?, locked_balance = locked_balance + ? WHERE user_id = ? AND currency_id = ?',[data.Z, data.Z, userIdFromOrder, quote_asset_id]);
//               // }
//             }
//             if (data.S === "SELL") {
//              const updateBalance = await db.raw_query(
//                 "UPDATE balances SET current_balance = current_balance - ?, locked_balance = locked_balance + ? WHERE user_id = ? AND currency_id = ?",
//                 [data.q, data.q, userIdFromOrder, base_asset_id]
//               );
//             }
//           }
//           if (data.X === "PARTIALLY_FILLED") {
//             console.log('Order Partially Filled')
//             // console.log(
//             //   `\n Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}\n`
//             // );

//             if (data.S === "BUY") {
//               if (data.o === "MARKET") {
//                 const updatedQuery = await db.raw_query(
//                   "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                   [data.l, data.l, userIdFromOrder, base_asset_id]
//                 );
                // if(updatedQuery.affectedRows == 0){
                //   await db.raw_query(
                //     "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
                //     [userIdFromOrder, base_asset_id, data.l, data.l]
                //   );
                // }
//                 const updatedQuery1 = await db.raw_query(
//                   "UPDATE balances SET main_balance = main_balance - ?, current_balance = current_balance - ? WHERE user_id = ? AND currency_id = ?",
//                   [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//                 );
                // if(updatedQuery1.affectedRows == 0){
                //   await db.raw_query(
                //     "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
                //     [userIdFromOrder, quote_asset_id, data.Y, data.Y]
                //   );
                // }
//               }
//               if (data.o === "LIMIT") {
//                 const order_value = (data.q * data.p).toFixed(8);
//                 const executed_value = (data.l * data.L).toFixed(8);
//                 if (order_value === executed_value) {
//                   const updatedQuery = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [data.l, data.l, userIdFromOrder, base_asset_id]
//                   );
//                   if(updatedQuery.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, base_asset_id, data.l, data.l]
//                     );
//                   }
//                   const updatedQuery1 = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                     [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//                   );
//                   if(updatedQuery1.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                     );
//                   }
//                 } else {
//                   const diff = order_value - executed_value;
//                   const unlock_volume = order_value;
//                   const updatedQuery = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [data.l, data.l, userIdFromOrder, base_asset_id]
//                   );
//                   if(updatedQuery.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, base_asset_id, data.l, data.l]
//                     );
//                   }
//                   const updatedQuery1 = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [
//                       data.Y,
//                       unlock_volume,
//                       diff,
//                       userIdFromOrder,
//                       quote_asset_id,
//                     ]
//                   );
//                   if(updatedQuery1.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, quote_asset_id, diff, diff]
//                     );
//                   }
//                 }
//               }
//             }
//             if (data.S === "SELL") {
//               const updatedQuery = await db.raw_query(
//                 "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                 [data.l, data.l, userIdFromOrder, base_asset_id]
//               );
//               if(updatedQuery.affectedRows == 0){
//                 await db.raw_query(
//                   "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                   [userIdFromOrder, base_asset_id, data.l, data.l]
//                 );
//               }
//               const updatedQuery1 = await db.raw_query(
//                 "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                 [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//               );
//               if(updatedQuery1.affectedRows == 0){
//                 await db.raw_query(
//                   "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                   [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                 );
//               }
//             }

//             const filterQuery = { order_id: data.c };
//             const updatedData = {
//               status: data.X,
//               base_quantity: data.q,
//               quote_quantity: data.Q,
//               order_price: data.p,
//               executed_base_quantity: data.z,
//               executed_quote_quantity: data.Z,
//               stop_limit_price: data.P,
//               oco_stop_limit_price: 0,
//               final_amount: data.Z,
//               order_id: data.c,
//               trade_id: data.t,
//               api_order_id: data.C,
//               order_type: data.o,
//               api_id: data.i,
//               response: JSON.stringify(data),
//               response_time: data.E,
//             };

//             await db.Update_Universal_Data(
//               "buy_sell_pro_limit_open",
//               updatedData,
//               filterQuery
//             );
//           }
//           if (data.X === "TRADE") {
//            console.log('Order Executed as Trade')

//             if (data.S === "BUY") {
//               if (data.o === "MARKET") {
//                 const updatedQuery = await db.raw_query(
//                   "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                   [data.l, data.l, userIdFromOrder, base_asset_id]
//                 );
//                 if(updatedQuery.affectedRows == 0){
//                   await db.raw_query(
//                     "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                     [userIdFromOrder, base_asset_id, data.l, data.l]
//                   );
//                 }
//                 const updatedQuery1 = await db.raw_query(
//                   "UPDATE balances SET main_balance = main_balance - ?, current_balance = current_balance - ? WHERE user_id = ? AND currency_id = ?",
//                   [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//                 );
//                 if(updatedQuery1.affectedRows == 0){
//                   await db.raw_query(
//                     "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                     [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                   );
//                 }
//               }
//               if (data.o === "LIMIT") {
//                 const order_value = (data.q * data.p).toFixed(8);
//                 const executed_value = (data.l * data.L).toFixed(8);
//                 if (order_value === executed_value) {
//                   const updatedQuery = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [data.l, data.l, userIdFromOrder, base_asset_id]
//                   );
//                   if(updatedQuery.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, base_asset_id, data.l, data.l]
//                     );
//                   }
//                   const updatedQuery1 = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                     [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//                   );
//                   if(updatedQuery1.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                     );
//                   }
//                 } else {
//                   const diff = order_value - executed_value;
//                   const unlock_volume = order_value;
//                   const updatedQuery = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [data.l, data.l, userIdFromOrder, base_asset_id]
//                   );
//                   if(updatedQuery.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, base_asset_id, data.l, data.l]
//                     );
//                   }
//                   const updatedQuery1 = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [
//                       data.Y,
//                       unlock_volume,
//                       diff,
//                       userIdFromOrder,
//                       quote_asset_id,
//                     ]
//                   );
//                   if(updatedQuery1.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                     );
//                   }
//                 }
//               }
//             }
//             if (data.S === "SELL") {
//              const updatedQuery = await db.raw_query(
//                 "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                 [data.l, data.l, userIdFromOrder, base_asset_id]
//               );
//               if(updatedQuery.affectedRows == 0){
//                 await db.raw_query(
//                   "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                   [userIdFromOrder, base_asset_id, data.l, data.l]
//                 );
//               }
//               const updatedQuery1 = await db.raw_query(
//                 "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                 [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//               );
//               if(updatedQuery1.affectedRows == 0){
//                 await db.raw_query(
//                   "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                   [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                 );
//               }
//             }

//             const filterQuery = { order_id: data.c };
//             const updatedData = {
//               status: data.X,
//               base_quantity: data.q,
//               quote_quantity: data.Q,
//               order_price: data.p,
//               executed_base_quantity: data.z,
//               executed_quote_quantity: data.Z,
//               stop_limit_price: data.P,
//               oco_stop_limit_price: 0,
//               final_amount: data.Z,
//               order_id: data.c,
//               trade_id: data.t,
//               api_order_id: data.C,
//               order_type: data.o,
//               api_id: data.i,
//               response: JSON.stringify(data),
//               response_time: data.E,
//             };

//             await db.Update_Universal_Data(
//               "buy_sell_pro_limit_open",
//               updatedData,
//               filterQuery
//             );
//           }

//           if (data.X === "FILLED") {
//             console.log('Order Filled.')
//             if (data.S === "BUY") {
//               if (data.o === "MARKET") {
//                 const updatedQuery = await db.raw_query(
//                   "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                   [data.l, data.l, userIdFromOrder, base_asset_id]
//                 );
//                 if(updatedQuery.affectedRows == 0){
//                   await db.raw_query(
//                     "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                     [userIdFromOrder, base_asset_id, data.l, data.l]
//                   );
//                 }
//                 const updatedQuery1 = await db.raw_query(
//                   "UPDATE balances SET main_balance = main_balance - ?, current_balance = current_balance - ? WHERE user_id = ? AND currency_id = ?",
//                   [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//                 );
//                 if(updatedQuery1.affectedRows == 0){
//                   await db.raw_query(
//                     "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                     [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                   );
//                 }
//               }
//               if (data.o === "LIMIT") {
//                 const order_value = (data.q * data.p).toFixed(8);
//                 const executed_value = (data.l * data.L).toFixed(8);
//                 if (order_value === executed_value) {
//                   const updatedQuery = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [data.l, data.l, userIdFromOrder, base_asset_id]
//                   );
//                   if(updatedQuery.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, base_asset_id, data.l, data.l]
//                     );
//                   }
//                   const updatedQuery1 = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                     [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//                   );
//                   if(updatedQuery1.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                     );
//                   }
//                 } else {
//                   const diff = order_value - executed_value;
//                   const unlock_volume = order_value;
//                   const updatedQuery = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [data.l, data.l, userIdFromOrder, base_asset_id]
//                   );
//                   if(updatedQuery.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, base_asset_id, data.l, data.l]
//                     );
//                   }
//                   const updatedQuery1 = await db.raw_query(
//                     "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                     [
//                       data.Y,
//                       unlock_volume,
//                       diff,
//                       userIdFromOrder,
//                       quote_asset_id,
//                     ]
//                   );
//                   if(updatedQuery1.affectedRows == 0){
//                     await db.raw_query(
//                       "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                       [userIdFromOrder, quote_asset_id, diff, diff]
//                     );
//                   }
//                 }
//               }
//             }
//             if (data.S === "SELL") {
//              const updatedQuery = await db.raw_query(
//                 "UPDATE balances SET main_balance = main_balance - ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                 [data.l, data.l, userIdFromOrder, base_asset_id]
//               );
//               if(updatedQuery.affectedRows == 0){
//                 await db.raw_query(
//                   "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                   [userIdFromOrder, base_asset_id, data.l, data.l]
//                 );
//               }
//               const updatedQuery1 = await db.raw_query(
//                 "UPDATE balances SET main_balance = main_balance + ?, current_balance = current_balance + ? WHERE user_id = ? AND currency_id = ?",
//                 [data.Y, data.Y, userIdFromOrder, quote_asset_id]
//               );
//               if(updatedQuery1.affectedRows == 0){
//                 await db.raw_query(
//                   "INSERT INTO balances (user_id, currency_id,main_balance, current_balance) VALUES (?, ?, ?, ?)",
//                   [userIdFromOrder, quote_asset_id, data.Y, data.Y]
//                 );
//               }
//             }

//             const filterQuery = { order_id: data.c };
//             const updatedData = {
//               status: data.X,
//               base_quantity: data.q,
//               quote_quantity: data.Q,
//               order_price: data.p,
//               executed_base_quantity: data.z,
//               executed_quote_quantity: data.Z,
//               stop_limit_price: data.P,
//               oco_stop_limit_price: 0,
//               final_amount: data.Z,
//               order_id: data.c,
//               trade_id: data.t,
//               api_order_id: data.C,
//               order_type: data.o,
//               api_id: data.i,
//               response: JSON.stringify(data),
//               response_time: data.E
//             };

//             await db.Update_Universal_Data(
//               "buy_sell_pro_limit_open",
//               updatedData,
//               filterQuery
//             );
//           }

//           if (data.X === "CANCELED") {
//             console.log("ORDER CANCELLED...");
//             if (data.S === "BUY") {
//               await db.raw_query(
//                 "UPDATE balances SET current_balance = current_balance + ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                 [data.Y, data.Y, userIdFromOrder, base_asset_id]
//               );
//             }
//             if (data.S === "SELL") {
//               await db.raw_query(
//                 "UPDATE balances SET current_balance = current_balance + ?, locked_balance = locked_balance - ? WHERE user_id = ? AND currency_id = ?",
//                 [data.l, data.l, userIdFromOrder, quote_asset_id]
//               );
//             }
//           }
//         } else {
//           console.log("DUPLICATE ORDER...");
//         }
//       }
//     },
//   });
// };

// connectKafka();
// consumeMessages();
