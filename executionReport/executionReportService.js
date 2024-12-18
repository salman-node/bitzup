const { Spot, WebsocketStream } = require("@binance/connector");
const WebSocket = require("ws");
const prisma = require("./config/prisma.client");
const db = require("./db_query");
const { Prisma } = require("@prisma/client");
const { sendNotification } = require("./utility/firebaseNotification");

const apiKey =
  "QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
const apiSecret =
  "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";

const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 1000,
});

const wss = new WebSocket.Server({ port: 9001 });
let frontendClients = [];

wss.on("connection", (ws) => {
  console.log("Frontend client connected");
  frontendClients.push(ws);

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.user_id) {
      const userId = data.user_id;
      console.log(`User ID: ${userId}`);
      // Store the user ID for later use
      ws.userId = userId;
    }
  });

  ws.on("close", () => {
    console.log("Frontend client disconnected");
    // frontendClients = frontendClients.filter((client) => client !== ws);
  });
});

const callbacks = {
  open: () => console.log("Connected with Binance WebSocket server"),
  close: () => console.log("Disconnected with Binance WebSocket server"),
  message: async (executionReport) => {
    const data = JSON.parse(executionReport);
    console.log(data);
    if (data.e === "executionReport") {
      // Check if data.c exists
      const [userIdFromOrder, uniquePart] = data.c.split("-");
      console.log("User ID:", userIdFromOrder);

      frontendClients.forEach(async (client) => {
        if (client.userId) {
          if (userIdFromOrder === client.userId) {
            if (data.X === "NEW") {
              const report = {
                status: "1",
                message: `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`,
                data: {
                  order_id: data.c, // Order ID
                  base_quantity: data.q, // Order quantity
                  quote_quantity: data.Z, // Cumulative quote asset transacted quantity
                  order_price: data.p, // Order price
                  type: data.S, // Order type
                  order_type: data.o, // Order type
                  stop_limit_price: data.P, // Stop price
                  oco_stop_limit_price: null, // Not present in the execution report
                  executed_base_quantity: data.z, // Last executed quantity
                  executed_quote_quantity: data.Z, // Last quote asset transacted quantity
                  status: data.X, // Current order status
                  created_at: data.O, // Order creation time
                },
              };
              client.send(JSON.stringify(report));
              console.log(
                `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`
              );
            }

            if (data.X === "PARTIALLY_FILLED") {
              const report = {
                status: "2",
                message: `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
                data: {
                  order_id: data.c, // Order ID
                  base_quantity: data.q, // Order quantity
                  quote_quantity: data.Q, // Cumulative quote asset transacted quantity
                  order_price: data.p, // Order price
                  type: data.S, // Order type
                  order_type: data.o, // Order type
                  stop_limit_price: data.P, // Stop price
                  oco_stop_limit_price: null, // Not present in the execution report
                  executed_base_quantity: data.z, // Last executed quantity
                  executed_quote_quantity: data.Z, // Last quote asset transacted quantity
                  status: data.X, // Current order status
                  created_at: data.O, // Order creation time
                },
              };
              client.send(JSON.stringify(report));
              console.log(
                `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
              );

              const filterQuery = { order_id: data.c };
              const updatedData = {
                status: data.X,
                base_quantity: data.q,
                quote_quantity: data.Q,
                order_price: data.p,
                executed_base_quantity: data.z,
                executed_quote_quantity: data.Z,
                stop_limit_price: data.P,
                oco_stop_limit_price: 0,
                final_amount: data.Z,
                order_id: data.c,
                api_order_id: data.C,
                order_type: data.o,
                buy_sell_fees: data.N,
                api_status: data.X,
                api_id: data.i,
                response: JSON.stringify(data),
                date_time: data.T,
                response_time: data.E,
              };

              await db.Update_Universal_Data(
                "buy_sell_pro_limit_open",
                updatedData,
                filterQuery
              );
            }
            if (data.X === "TRADE") {
              console.log(
                `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`
              );
              const report = {
                status: "3",
                message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`,
                data: {
                  order_id: data.c, // Order ID
                  base_quantity: data.q, // Order quantity
                  quote_quantity: data.Q, // Cumulative quote asset transacted quantity
                  order_price: data.p, // Order price
                  type: data.S, // Order type
                  order_type: data.o, // Order type
                  stop_limit_price: data.P, // Stop price
                  oco_stop_limit_price: null, // Not present in the execution report
                  executed_base_quantity: data.z, // Last executed quantity
                  executed_quote_quantity: data.Z, // Last quote asset transacted quantity
                  status: data.X, // Current order status
                  created_at: data.O, // Order creation time
                },
              };
              client.send(JSON.stringify(report));

              const filterQuery = { order_id: data.c };
              const updatedData = {
                status: data.X,
                base_quantity: data.q,
                quote_quantity: data.Q,
                order_price: data.p,
                executed_base_quantity: data.z,
                executed_quote_quantity: data.Z,
                stop_limit_price: data.P,
                oco_stop_limit_price: 0,
                final_amount: data.Z,
                order_id: data.c,
                api_order_id: data.C,
                order_type: data.o,
                buy_sell_fees: data.N,
                api_status: data.X,
                api_id: data.i,
                response: JSON.stringify(data),
                date_time: data.T,
                response_time: data.E,
              };

              await db.Update_Universal_Data(
                "buy_sell_pro_limit_open",
                updatedData,
                filterQuery
              );
            }

            if (data.X === "FILLED") {
              console.log(
                `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
              );
              const report = {
                status: "3",
                message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
                data: {
                  order_id: data.c, // Order ID
                  base_quantity: data.q, // Order quantity
                  quote_quantity: data.Q, // Cumulative quote asset transacted quantity
                  order_price: data.p, // Order price
                  type: data.S, // Order type
                  order_type: data.o, // Order type
                  stop_limit_price: data.P, // Stop price
                  oco_stop_limit_price: null, // Not present in the execution report
                  executed_base_quantity: data.z, // Last executed quantity
                  executed_quote_quantity: data.Z, // Last quote asset transacted quantity
                  status: data.X, // Current order status
                  created_at: data.O, // Order creation time
                },
              };
              client.send(JSON.stringify(report));

              const filterQuery = { order_id: data.c };
              const updatedData = {
                status: data.X,
                base_quantity: data.q,
                quote_quantity: data.Q,
                order_price: data.p,
                executed_base_quantity: data.z,
                executed_quote_quantity: data.Z,
                stop_limit_price: data.P,
                oco_stop_limit_price: 0,
                final_amount: data.Z,
                order_id: data.c,
                api_order_id: data.C,
                order_type: data.o,
                buy_sell_fees: data.N,
                api_status: data.X,
                api_id: data.i,
                response: JSON.stringify(data),
                date_time: data.T,
                response_time: data.E,
              };

              await db.Update_Universal_Data(
                "buy_sell_pro_limit_open",
                updatedData,
                filterQuery
              );
            }

            if (data.X === "CANCELED") {
              const report = {
                status: "4",
                message: `Cancelled ${data.o} Order Placed, Order Id: ${data.c}`,
                data: {
                  order_id: data.c, // Order ID
                  base_volume: data.q, // Order quantity
                  quote_volume: data.Z, // Cumulative quote asset transacted quantity
                  order_price: data.p, // Order price
                  stop_limit_price: data.P, // Stop price
                  oco_stop_limit_price: null, // Not present in the execution report
                  executed_base_volume: data.l, // Last executed quantity
                  executed_quote_volume: data.Y, // Last quote asset transacted quantity
                  status: data.X, // Current order status
                  created_at: new Date(data.O).toLocaleString(), // Order creation time
                },
              };
              client.send(JSON.stringify(report));
              console.log(`Cancelled ${data.o} Order, Order Id: ${data.c}`);
            }
          }
        }
      });
    }
  },
};

const connectExecutionReport = async () => {
  try {
    const websocketStreamClient = await new WebsocketStream({
      callbacks,
      wsURL: "wss://testnet.binance.vision",
    });

    const updateListenKey = async () => {
      try {
        const ListenKey = await client.createListenKey();
        console.log(ListenKey.data.listenKey);
        websocketStreamClient.tick(ListenKey.data.listenKey);
      } catch (error) {
        console.error(error);
      }
    };

    await updateListenKey();

    setInterval(updateListenKey, 5 * 60 * 1000); // update listen key every 20 minutes
  } catch (error) {
    console.error(error);
  }
};

connectExecutionReport();
