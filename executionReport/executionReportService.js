// const { Spot, WebsocketStream } = require("@binance/connector");

// // const apiKey =
// //   "QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
// // const apiSecret =
// //   "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";

// const apiKey = 'l661KHqi6Wf8vdkgFatyR00aVRyZheo6otKz9hwHAae8B95zPHdmg6Xo0L5ABePr';
// const apiSecret = 'BKNrQgHaTie41nGSiMLeK8wWfR4UF0kE1Q75tI6Mr7PkPFsUzBukvdBZnKt3KW9V';

// const client = new Spot(apiKey, apiSecret, {
//   baseURL: "https://testnet.binance.vision",
//   timeout: 1000,
// });


// const callbacks = {
//   open: () => console.log("Connected with Binance WebSocket server"),
//   close: () => console.log("Disconnected with Binance WebSocket server"),
//   message: async (executionReport) => {
//     const data = JSON.parse(executionReport);
//     console.log(data);
//   },
// };

// const connectExecutionReport = async () => {
//   try {
//     const websocketStreamClient = await new WebsocketStream({
//       callbacks,
//       wsURL: "wss://testnet.binance.vision",
//     });

//     const updateListenKey = async () => {
//       try {
//         const ListenKey = await client.createListenKey();
//         console.log(ListenKey.data.listenKey);
//         websocketStreamClient.ticker(ListenKey.data.listenKey);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     await updateListenKey();

//     setInterval(updateListenKey, 5 * 60 * 1000); // update listen key every 20 minutes
//   } catch (error) {
//     console.error(error);
//   }
// };

// connectExecutionReport();


const axios = require("axios");
const WebSocket = require("ws");
require("dotenv").config();

const apiKey = 'l661KHqi6Wf8vdkgFatyR00aVRyZheo6otKz9hwHAae8B95zPHdmg6Xo0L5ABePr';
const apiSecret = 'BKNrQgHaTie41nGSiMLeK8wWfR4UF0kE1Q75tI6Mr7PkPFsUzBukvdBZnKt3KW9V';

// Create user data stream (get listenKey)
const createListenKey = async () => {
  try {
    const res = await axios.post(
      'https://testnet.binance.vision/api/v3/userDataStream',
      null,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      }
    );
    return res.data.listenKey;
  } catch (err) {
    console.error('❌ Failed to create listenKey:', err.response?.data || err.message);
    throw err;
  }
};

// Keep the listenKey alive
const keepAliveListenKey = async (listenKey) => {
  try {
    await axios.put(
      `https://testnet.binance.vision/api/v3/userDataStream?listenKey=${listenKey}`,
      null,
      {
        headers: {
          'X-MBX-APIKEY': apiKey,
        },
      }
    );
    console.log('🔄 Listen key keep-alive sent');
  } catch (err) {
    console.error('❌ Failed to keep listenKey alive:', err.response?.data || err.message);
  }
};

// Connect to the WebSocket stream
const connectWebSocket = async () => {
  try {
    const listenKey = await createListenKey();
    console.log(`🔑 ListenKey: ${listenKey}`);

    const ws = new WebSocket(`wss://testnet.binance.vision/ws/${listenKey}`);

    ws.on('open', () => {
      console.log('✅ WebSocket connected');
    });

    ws.on('message', (data) => {
      const parsed = JSON.parse(data);
      console.log('📨 Received message:', parsed);
    });

    ws.on('error', (err) => {
      console.error('❌ WebSocket error:', err.message);
    });

    ws.on('close', (code, reason) => {
      console.warn(`⚠️ WebSocket closed (code: ${code}, reason: ${reason})`);
    });

    // Keep listen key alive every 30 minutes
    setInterval(() => keepAliveListenKey(listenKey), 30 * 60 * 1000);
  } catch (err) {
    console.error('❌ Error in connectWebSocket:', err.message);
  }
};

connectWebSocket();

