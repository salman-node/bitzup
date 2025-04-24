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

const apiKey = 'TjnvJCOXHB54SjgvrOSqRaFK2rTUApJGfM30UPOFbsAZprFRtSDLf203phlHej8g';
const apiSecret = 'AkkfmZtrszpLQttGwes4r5mX03M79Da6TYr0vYgyoL13K0LxF0n4dMCDi33SN7yz';

const url = 'https://api.binance.com/sapi/v1/capital/config/getall';

const headers = {
  'X-MBX-APIKEY': apiKey,
};

// Add timestamp and signature
const params = {
  coin: 'BTC',  // Token symbol, adjust this as needed
  timestamp: Date.now(),
};

// Generate the signature
const queryString = new URLSearchParams(params).toString();
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(queryString)
  .digest('hex');

params.signature = signature;  // Attach the signature to the parameters

async function main() {
  try {
    const response = await axios.get(url, { headers, params });
    // console.log(response.data);  // Logs the network information for the given token
    const data = response.data;
    console.log(JSON.parse(JSON.stringify(data[0].networkList)));  // Logs the network information for the given token
    const withdrawalNetworks = data.find(network => {
      return network.coin === 'UNI';  // Adjust this to filter by the desired token symbol
      // return {
      //   coin: network.coin,
      //   networkList: JSON.stringify(network.networkList.map(net=>{
      //     return {
      //       network: net.network,
      //     }
      //   })),
      // };
    })
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
  
// const apiKey ="QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
// const apiSecret = "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";
// const client = new Spot(apiKey, apiSecret, {
//   baseURL: "https://testnet.binance.vision",
//   timeout: 1000,
// });



// //    const  options = {
// //       price: limit_price,
// //       quantity: baseVolume,
// //       timeInForce: TimeInForce.GTC,
// //       newClientOrderId: OrderId,
// //       newOrderRespType: NewOrderRespType.FULL,
// //       recvWindow: 5000
// //     };

// const options = {
//   startTime: Date.now() - 3600000, // 1 hour ago
//   endTime: Date.now(),            // Current time
//   limit: 50,                      // Retrieve 50 candlesticks
// };
  
//   //Place new order to Binance.
//    const orderData = await client.klineCandlestickData(
//     'BTCUSDT',
//     "5m",
//     options,
//   );
//   console.log(orderData)

