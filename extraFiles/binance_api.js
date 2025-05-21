// const axios = require('axios');

// const apiKey = 'TjnvJCOXHB54SjgvrOSqRaFK2rTUApJGfM30UPOFbsAZprFRtSDLf203phlHej8g';
// const apiSecret = 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW';
// // AkkfmZtrszpLQttGwes4r5mX03M79Da6TYr0vYgyoL13K0LxF0n4dMCDi33SN7yz    //secret key of binance salman
// const url = 'https://api1.binance.com/sapi/v1/capital/config/getall';

// const headers = {
//   'X-MBX-APIKEY': apiKey,
// };

// const params = {
//   asset: 'BTCUSDT',  // Replace with your token symbol (e.g., 'BTC', 'ETH')
// };
// async function main() {
// try {
//   const response =  await axios.get(url, { headers });
//   console.log(response);  // Logs the network information for the given token
// } catch (error) {
//   console.error('Error fetching network info:', error.data || error.message);
// }}

// main();

const axios = require('axios');
const crypto = require('crypto');
// insert data in log file
const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'binanceOpen.txt');
const logData = (data) => {
  fs.appendFileSync(logFilePath, data + '\n');
};    

// const apiKey = 'TjnvJCOXHB54SjgvrOSqRaFK2rTUApJGfM30UPOFbsAZprFRtSDLf203phlHej8g';  //mainnet salman
// const apiSecret = 'AkkfmZtrszpLQttGwes4r5mX03M79Da6TYr0vYgyoL13K0LxF0n4dMCDi33SN7yz';  //mainet salman

const apiKey='l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq'       //testnet 
const apiSecret="JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW"    //testnet 
// const url="https://testnet.binance.vision"                           //testnet  

const url = 'https://api.binance.com/api/v3/allOrders';

const headers = {
  'X-MBX-APIKEY': apiKey,
};

// // Add timestamp and signature
const params = {
  timestamp: Date.now(),
  symbol : 'BTCUSDT',
};
const orderId = '8512101';  // Replace with your actual order ID
const timestamp = Date.now();  // Current timestamp in milliseconds
const symbol = 'BTCUSDT';  // Replace with your actual symbol
const recvWindow = 5000;  // Optional: Set a receive window (in milliseconds)

// // Generate the signature
// const queryString = new URLSearchParams(params).toString();
const queryString = `symbol=${symbol}&orderId=${orderId}&timestamp=${timestamp}`;
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(queryString)
  .digest('hex');

params.signature = signature;  // Attach the signature to the parameters
const url1 = `${url}/api/v3/order?${queryString}&signature=${signature}`;
async function main() {
  try {
    const response = await axios.get(url1, { headers });
    // console.log(response.data);  // Logs the network information for the given token
    const data = response.data;
    // logData(JSON.stringify(data));  // Log the data to the log file
    console.log(data);  // Logs the network information for the given token
    // const withdrawalNetworks = data.find(network => {
    //   return network.coin === 'UNI';  // Adjust this to filter by the desired token symbol
    //   // return {
    //   //   coin: network.coin,
    //   //   networkList: JSON.stringify(network.networkList.map(net=>{
    //   //     return {
    //   //       network: net.network,
    //   //     }
    //   //   })),
    //   // };
    // })
    // console.log(withdrawalNetworks);  // Logs the network information for the given token
    return withdrawalNetworks;
  } catch (error) {
    console.error('Error fetching network info:', error.response ? error.response.data : error.message);
  }
}

main();




// const {
//     Spot,
//     Side,
//     OrderType,
//     TimeInForce,
//     NewOrderRespType
//   } = require( "@binance/connector-typescript");
  
// // const apiKey ="QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
// // const apiSecret = "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";
// // const apiKey = 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq';
// // const apiSecret = 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW';
// const client = new Spot(apiKey, apiSecret, {
//   baseURL: "https://testnet.binance.vision",
//   timeout: 1000,
// });



//    const  options = {
//       price: limit_price,
//       quantity: baseVolume,
//       timeInForce: TimeInForce.GTC,
//       newClientOrderId: OrderId,
//       newOrderRespType: NewOrderRespType.FULL,
//       recvWindow: 5000
//     };

// const options = {
//   startTime: Date.now() - 3600000, // 1 hour ago
//   endTime: Date.now(),            // Current time
//   limit: 50,                      // Retrieve 50 candlesticks
// };
  
//  async function main(){ //Place new order to Binance.
//    const orderData = await client.klineCandlestickData(
//     'BTCUSDT',
//     "5m",
//     options,
//   );
//   console.log(orderData)}

//   main();

