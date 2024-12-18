const { Spot, WebsocketStream } = require("@binance/connector");
const WebSocket = require("ws");
const { sendNotification } = require("./utility/firebaseNotification");

const apiKey =
  "QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
const apiSecret =
  "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";

const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 1000,
});

const wss = new WebSocket.Server({ port: 9002 });
let clients = new Map(); // Store usser_id -> fcm_token mapping

// Handle WebSocket connection for clients
wss.on("connection", (ws) => {
  console.log("Frontend client connected");

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.user_id && data.fcm_token) {
      const { user_id, fcm_token } = data;
      console.log(`User ID: ${user_id} fcm_token: ${fcm_token}`);
      clients.set(user_id, fcm_token); // Store user_id with fcm_token
    }
  });

  ws.on("close", () => {
    console.log("Frontend client disconnected");
    // Optionally, remove the user from clients if needed on disconnection
  });
});

// Function to send notifications to the user
async function notifyUser(user_id, message) {
  const fcmToken = clients.get(user_id);
  if (fcmToken) {
    await sendNotification(fcmToken, "Order Update", message);
  } else {
    console.log(`FCM token for user ${user_id} not found`);
  }
}

// Callbacks for Binance WebSocket stream
const callbacks = {
  open: () => console.log("Connected with Binance WebSocket server"),
  close: () => console.log("Disconnected with Binance WebSocket server"),
  message: async (executionReport) => {
    const data = JSON.parse(executionReport);
    console.log(data);

    if (data.e === "executionReport") {
      // Extract user_id from the custom client order ID (data.c)
      const [userIdFromOrder] = data.c.split("-");
      console.log("User ID from order:", userIdFromOrder);

      const message = generateMessageFromExecutionReport(data); // Generate message based on order status
      if (message) {
        await notifyUser(userIdFromOrder, message); // Send notification to the corresponding user
      }
    }
  },
};

// Helper function to generate the notification message based on the execution report
function generateMessageFromExecutionReport(data) {
  switch (data.X) {
    case "NEW":
      return `New ${data.o} Order Placed. Type: ${data.o}, Price: ${data.p}, Quantity: ${data.q}, Order Id: ${data.c}`;
    case "PARTIALLY_FILLED":
      return `Order Partially Filled at ${data.l}. Filled Quantity: ${data.z}, Order Id: ${data.c}`;
    case "FILLED":
      return `Order Filled at ${data.l}. Filled Quantity: ${data.z}, Order Id: ${data.c}`;
    case "TRADE":
      return `Order Executed at ${data.l}. Filled Quantity: ${data.z}, Order Id: ${data.c}, Trade type: ${data.X}`;
    case "CANCELED":
      return `Cancelled ${data.o} Order. Order Id: ${data.c}`;
    default:
      return null; // If there's no relevant status, return null
  }
}

// Function to connect to Binance execution report stream
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
        websocketStreamClient.userData(ListenKey.data.listenKey);
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

// const { Spot, WebsocketStream } = require("@binance/connector");
// const WebSocket = require("ws");
// const {sendNotification} = require("./utility/firebaseNotification");

// const apiKey =
//   "QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
// const apiSecret =
//   "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";

// const client = new Spot(apiKey, apiSecret, {
//   baseURL: "https://testnet.binance.vision",
//   timeout: 1000,
// });

// const wss = new WebSocket.Server({ port: 9001 });
// let clients = new Map();

// wss.on("connection", (ws) => {
//   console.log("Frontend client connected");

//   ws.on("message", (message) => {
//     const data = JSON.parse(message);
//     if (data.user_id) {
//       const {user_id,fcm_token} = data;
//       console.log(`User ID: ${user_id}`);
//       // Store the user ID for later use
//       clients.set(user_id, fcm_token);
//     }
//   });

//   ws.on("close", () => {
//     console.log("Frontend client disconnected");
//     // frontendClients = frontendClients.filter((client) => client !== ws);
//   });
// });

// // Method to notify the user
// async function notifyUser(user_id, message) {
//     const fcmToken = clients.get(user_id);
//     if (fcmToken) {
//       await sendNotification(fcmToken, 'Order Update', message);
//     }
//   }

// const callbacks = {
//   open: () => console.log("Connected with Binance WebSocket server"),
//   close: () => console.log("Disconnected with Binance WebSocket server"),
//   message: async (executionReport) => {

//     const data = JSON.parse(executionReport);
//     console.log(data);
//   if(data.e === "executionReport"){
//    // Check if data.c exists
//       const [userIdFromOrder, uniquePart] = data.c.split('-');
//       console.log('User ID:', userIdFromOrder);

//     frontendClients.forEach(async (client) => {
//       if (client.userId){
//         if (userIdFromOrder === client.userId) { if (data.X === "NEW") {

//         console.log(
//           `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`
//         );
//         const message = `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`
//         notifyUser(user_id, message);
//       }

//       if (data.X === "PARTIALLY_FILLED") {

//         console.log(
//           `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
//         );

//         const message = `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
//         notifyUser(user_id, message);
//       }
//       if (data.X === "TRADE") {
//         console.log(
//           `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`
//         );

//         const message = `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}, Trade type: ${data.X}`
//         notifyUser(user_id, message);
//       }

//       if (data.X === "FILLED") {
//         console.log(
//           `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
//         );

//         const message = `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`
//         notifyUser(user_id, message);
//       }

//       if (data.X === "CANCELED") {

//         console.log(`Cancelled ${data.o} Order, Order Id: ${data.c}`);

//         const message = `Cancelled ${data.o} Order, Order Id: ${data.c}`
//         notifyUser(user_id, message);
//       }}}
//     });
//  }
//  },
// };

// const connectExecutionReport = async () => {
//   try {
//     const websocketStreamClient = await new WebsocketStream({
//       callbacks,
//       wsURL: "wss://testnet.binance.vision",
//     });
//     const ListenKey = await client.createListenKey();
//     console.log(ListenKey.data.listenKey);
//     websocketStreamClient.userData(ListenKey.data.listenKey);
//   } catch (error) {
//     console.error(error);
//   }
// };

// connectExecutionReport();
