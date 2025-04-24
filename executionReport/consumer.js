const WebSocket = require("ws");
const { Kafka } = require("kafkajs");
// import { raw_query, Get_Where_Universal_Data, Update_Universal_Data } from "./db_query";
const {updateBalances, raw_query, Get_Where_Universal_Data, Update_Universal_Data,updateOrInsertBalances, Create_Universal_Data } = require("./db_query");

const wss = new WebSocket.Server({ port: 9001 });
let frontendClients = [];

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
      if (!processedOrders.has(data.I)) {
        processedOrders.add(data.I);

        console.log("NEW REPORTT: ", data , topic);
        
      if (topic === "execution-report") {
   
     
        const [userIdFromOrder, uniquePart] = data.c.split("-");
        const canceled_user_id = data.X === "CANCELED" ? data.C.split("-")[0] : userIdFromOrder;

        const reportData = {
          order_id: data.X == "CANCELED" ? data.C : data.c, // Order ID
          base_quantity: data.q, // Order quantity
          quote_quantity: data.S === "BUY" ? data.Q : data.Z, // Cumulative quote asset transacted quantity
          order_price: data.X === "NEW" ? data.p : (data.Z/data.z).toFixed(8), // Order price
          type: data.S, // Order type
          order_type: data.o, // Order type
          stop_limit_price: data.P, // Stop price
          oco_stop_limit_price: null, // Not present in the execution report
          executed_base_quantity: data.z, // Last executed quantity
          executed_quote_quantity: data.Z, // Last quote asset transacted quantity
          status: data.X, // Current order status
          created_at: data.O, // Order creation time
        }
         
        var count = 0;
        if (data.t != -1) {
          let row_count = await raw_query(
            "SELECT COUNT(*) AS count FROM buy_sell_pro_limit_open WHERE trade_id = ?",
            [data.t]
          );
          count = row_count[0].count;
        }
        if (count == 0) {
          const symbol = data.s;
          //get pair_id,base_asset_id,quote_asset_id from crypto_pair table
          const pair_id = await Get_Where_Universal_Data(
            "pair_id,base_asset_id,quote_asset_id",
            "crypto_pair",
            { pair_symbol: symbol }
          );
           //get pair fees from crypto_pair table
           const pair_fees = await Get_Where_Universal_Data(
            "trade_fee",
            "crypto_pair",
            { pair_symbol: symbol }
          );
          const pair_fees_value = pair_fees[0].trade_fee;

          const fees = data.S == 'BUY' ? parseFloat((data.l * pair_fees_value/100).toFixed(8)) : parseFloat((data.Y * pair_fees_value/100).toFixed(8));
          const total_fees = data.S == "BUY" ? parseFloat((data.z * pair_fees_value/100).toFixed(8)) : parseFloat((data.Z * pair_fees_value/100).toFixed(8));
          const base_amount_after_fees = data.S == "BUY" ? parseFloat((data.l - fees).toFixed(8)) : 0
          const quote_amount_after_fees = data.S == "SELL" ? parseFloat((data.Y - fees).toFixed(8)) : 0;
          

          const base_asset_id = pair_id[0].base_asset_id;
          const quote_asset_id = pair_id[0].quote_asset_id;
          const pairId = pair_id[0].pair_id;
          // Handle report data based on `data.X` status and send to clients
          if (data.X === "NEW") {
            const report = {
              status: "1",
              user_id: userIdFromOrder,
              message: `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`,
              data: reportData,
            };
            sendMessageToClients(report);

            if (data.S === "BUY") {
              if (data.o === "LIMIT") {
                const quote_quantity = (data.q * data.p).toFixed(8);
                await updateOrInsertBalances({
                  userId: userIdFromOrder,
                  currencyId: quote_asset_id,
                  currentBalanceChange: -quote_quantity,
                  lockedBalanceChange: quote_quantity,
                });
              }
            }
            if (data.S === "SELL") {
             const updateBalance = await updateOrInsertBalances({
                userId: userIdFromOrder,
                currencyId: base_asset_id,
                currentBalanceChange: -data.q,
                lockedBalanceChange: data.q,
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

            if (data.S === "BUY") {
              if (data.o === "MARKET") {
                const result =await updateBalances(
                  {
                    userId: userIdFromOrder,
                    currencyId: base_asset_id,
                    currentBalanceChange: base_amount_after_fees,
                    mainBalanceChange: base_amount_after_fees,
                    lockedBalanceChange:0
                  },
                  {
                    userId: userIdFromOrder,
                    currencyId: quote_asset_id,
                    mainBalanceChange: -data.Y,
                    currentBalanceChange: -data.Y,
                    lockedBalanceChange:0
                  }
                );
                
              }
              if (data.o === "LIMIT") {
                const order_value = (data.q * data.p).toFixed(8);
                const executed_value = (data.l * data.L).toFixed(8);
                if (order_value === executed_value) {
                  await updateBalances(
                    {
                      userId: userIdFromOrder,
                      currencyId: base_asset_id,
                      mainBalanceChange: base_amount_after_fees,
                      currentBalanceChange: base_amount_after_fees,
                      lockedBalanceChange:0
                    },
                    {
                      userId: userIdFromOrder,
                      currencyId: quote_asset_id,
                      mainBalanceChange: -data.Y,
                      currentBalanceChange: -data.Y,
                      lockedBalanceChange:0
                    }
                  )
                } else {
                  const unlock_volume = order_value;
                  await updateBalances(
                    {
                      userId: userIdFromOrder,
                      currencyId: base_asset_id,
                      mainBalanceChange: base_amount_after_fees,
                      currentBalanceChange: base_amount_after_fees,
                      lockedBalanceChange:0
                    },
                    {
                      userId: userIdFromOrder,
                      currencyId: quote_asset_id,
                      mainBalanceChange: -data.Y,
                      lockedBalanceChange: -parseFloat(unlock_volume),
                      currentBalanceChange: 0,
                    }
                  )
                }
              }
            }
            if (data.S === "SELL") {
              const updatedQuery = await updateBalances(
                {
                  userId: userIdFromOrder,
                  currencyId: base_asset_id,
                  mainBalanceChange: -data.l,
                  lockedBalanceChange: -data.l,
                  currentBalanceChange: 0,
                },
                {
                  userId: userIdFromOrder,
                  currencyId: quote_asset_id,
                  mainBalanceChange: quote_amount_after_fees,
                  currentBalanceChange: quote_amount_after_fees,
                  lockedBalanceChange:0
                }
              )
              
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
            if (data.S === "BUY") {
              if (data.o === "MARKET") {
                await updateBalances(
                  {
                    userId: userIdFromOrder,
                    currencyId: base_asset_id,
                    mainBalanceChange: base_amount_after_fees,
                    currentBalanceChange: base_amount_after_fees,
                    lockedBalanceChange:0
                  },
                  {
                    userId: userIdFromOrder,
                    currencyId: quote_asset_id,
                    mainBalanceChange: -data.Y,
                    currentBalanceChange: -data.Y,
                    lockedBalanceChange:0
                  }
                )   
              }
              if (data.o === "LIMIT") {
                const order_value = (data.q * data.p).toFixed(8);
                const executed_value = (data.l * data.L).toFixed(8);
                if (order_value === executed_value) {
                 await updateBalances(
                  {
                    userId: userIdFromOrder,
                    currencyId: base_asset_id,
                    mainBalanceChange: base_amount_after_fees,
                    currentBalanceChange: base_amount_after_fees,
                    lockedBalanceChange:0
                  },
                  {
                    userId: userIdFromOrder,
                    currencyId: quote_asset_id,
                    mainBalanceChange: -data.Y,
                    lockedBalanceChange: -data.Y,
                    currentBalanceChange: 0
                  }
                 )
                } else {
                  const diff = order_value - executed_value;
                  const unlock_volume = order_value;
                  await updateBalances(
                    {
                      userId: userIdFromOrder,
                      currencyId: base_asset_id,
                      mainBalanceChange: base_amount_after_fees,
                      currentBalanceChange: base_amount_after_fees,
                      lockedBalanceChange:0
                    },
                    {
                      userId: userIdFromOrder,
                      currencyId: quote_asset_id,
                      mainBalanceChange: -data.Y,
                      lockedBalanceChange: -parseFloat(unlock_volume),
                      currentBalanceChange: diff,
                    }
                  )
                }
              }
            }
            if (data.S === "SELL") {
              await updateBalances(
                {
                  userId: userIdFromOrder,
                  currencyId: base_asset_id,
                  mainBalanceChange: -data.l,
                  lockedBalanceChange: -data.l,
                  currentBalanceChange: 0,
                },
                {
                  userId: userIdFromOrder,
                  currencyId: quote_asset_id,
                  mainBalanceChange: quote_amount_after_fees,
                  currentBalanceChange: quote_amount_after_fees,
                  lockedBalanceChange:0
                }
              )
            };
          }
          if (data.X === "FILLED") {

            const report = {
              status: "3",
              user_id: userIdFromOrder,
              message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
              data: reportData,
            };
            sendMessageToClients(report);
            if (data.S === "BUY") {
              if (data.o === "MARKET") {
               const result =  await updateBalances(
                  {
                    userId: userIdFromOrder,
                    currencyId: base_asset_id,
                    mainBalanceChange: base_amount_after_fees,
                    currentBalanceChange: base_amount_after_fees,
                    lockedBalanceChange:0
                  },
                  {
                    userId: userIdFromOrder,
                    currencyId: quote_asset_id,
                    mainBalanceChange: -data.Y, 
                    currentBalanceChange: -data.Y,
                    lockedBalanceChange:0              
                  }
                )
               
              }
              if (data.o === "LIMIT") {
                const order_value = (data.q * data.p).toFixed(8);
                const executed_value = (data.l * data.L).toFixed(8);
                if (order_value === executed_value) {
                 
                  await updateBalances({
                      userId: userIdFromOrder,
                      currencyId: base_asset_id,
                      mainBalanceChange: base_amount_after_fees,
                      currentBalanceChange: base_amount_after_fees,
                      lockedBalanceChange:0
                    },
                    {
                      userId: userIdFromOrder,
                      currencyId: quote_asset_id,
                      mainBalanceChange: -data.Y,
                      lockedBalanceChange: -data.Y,
                      currentBalanceChange: 0
                    }
                  )
                } else {
                  const diff = order_value - executed_value;
                  const unlock_volume = order_value;
                  await updateBalances(
                    {
                      userId: userIdFromOrder,
                      currencyId: base_asset_id,
                      mainBalanceChange: base_amount_after_fees,
                      currentBalanceChange: base_amount_after_fees,
                      lockedBalanceChange:0
                    },
                    {
                      userId: userIdFromOrder,
                      currencyId: quote_asset_id,
                      mainBalanceChange: -data.Y,
                      lockedBalanceChange: -parseFloat(unlock_volume),
                      currentBalanceChange: diff,
                    }
                  )
                };
              }
            }
            if (data.S === "SELL") {
              const result = await updateBalances({
                userId: userIdFromOrder,
                currencyId: base_asset_id,
                mainBalanceChange: -data.l,
                lockedBalanceChange: -data.l,
                currentBalanceChange: 0,
              },
              {
                userId: userIdFromOrder,
                currencyId: quote_asset_id,
                mainBalanceChange: quote_amount_after_fees,
                currentBalanceChange: quote_amount_after_fees,
                lockedBalanceChange:0
              }
            )
            
            }
          }
          if (data.X === "CANCELED") {

            const report = {
              status: "4",
              user_id: canceled_user_id,
              message: `Cancelled ${data.o} Order Placed, Order Id: ${data.c}`,
              data: reportData,
            };
            sendMessageToClients(report);

            if (data.S === "BUY") {
              await updateOrInsertBalances({
                userId: canceled_user_id,
                currencyId: base_asset_id,
                currentBalanceChange: data.Y,
                lockedBalanceChange: -data.Y,
              });
            }
            if (data.S === "SELL"){
              await updateOrInsertBalances({
                userId: canceled_user_id,
                currencyId: quote_asset_id,
                currentBalanceChange: data.l,
                lockedBalanceChange: -data.l,
              });
            }
          }
          if(data.X === "FILLED" || data.X === "PARTIALLY_FILLED" || data.X === "TRADE"){
            const filterQuery = { order_id: data.c };
            const updatedData = {
              status: data.X,
              base_quantity: data.q,
              quote_quantity: data.S === "BUY" ? data.Q : data.Z,
              order_price: (data.Z/data.z).toFixed(8),
              executed_base_quantity: data.z,
              executed_quote_quantity: data.Z,
              stop_limit_price: data.P,
              final_amount: data.S === "BUY" ? base_amount_after_fees : quote_amount_after_fees,
              order_id: data.c,
              trade_id: data.t,
              api_order_id: data.I,
              order_type: data.o,
              buy_sell_fees:  total_fees,
              api_id: data.i,
              response: JSON.stringify(data),
              date_time: data.T,
              response_time: data.E,
            };
            //update if data.I is greater then api_order_id in db 
            const api_order_id = await Get_Where_Universal_Data("api_order_id","buy_sell_pro_limit_open",{order_id:data.c});
            if(api_order_id[0].api_order_id < data.I){
            await Update_Universal_Data(
              "buy_sell_pro_limit_open",
              updatedData,
              filterQuery
            );
          };
          };
          await Create_Universal_Data('buy_sell_pro_in_order',{
            pair_id: pairId,
            status: data.X,
            user_id:data.X === "CANCELED" ? canceled_user_id : userIdFromOrder,
            base_quantity: data.q,
            quote_quantity: data.S === "BUY" ? data.Q : data.Z,
            order_price: 0.0,
            executed_base_quantity: data.z,
            executed_quote_quantity: data.Z,
            stop_limit_price: data.P,
            executed_base_after_fees:base_amount_after_fees,
            executed_quote_after_fees : quote_amount_after_fees,
            order_id: data.c,
            trade_id: data.t,
            api_order_id: data.I,
            order_type: data.o,
            buy_sell_fees:  total_fees,
            api_id: data.i,
            date_time: data.T,
            api:'order consumer report'
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
