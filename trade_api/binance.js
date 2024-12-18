// const { Spot } = require('@binance/connector');

// const apiKey = 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om';
// const apiSecret = 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW';
// const client = new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision', timeout: 5000 });

// async function main() {
//     try {
//         // Get Binance server time
//         const timestamp = await client.time();
//         const serverTime = timestamp.data.serverTime;

//         console.log('Server Time:', serverTime);

//         // Subtract 3000ms (3 seconds) from the server time to ensure it is behind the server time
//         const adjustedTimestamp = serverTime - 3000;

//         console.log('Adjusted Timestamp:', adjustedTimestamp);

//         // Place the order with the adjusted timestamp
//         client.newOrder('BNBUSDT', 'BUY', 'LIMIT', {
//             price: '512',
//             quantity: 0.05,
//             timeInForce: 'GTC',
//             recvWindow: 5000,  // optional, set the recvWindow for time tolerance
//             timestamp: adjustedTimestamp, // Adjusted timestamp to be behind server time
//         })
//         .then((response) => {
//             console.log(response.data);
//         })
//         .catch((error) => {
//             console.log(error.response ? error.response.data : error.message);
//         });

//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// main();

const { Spot } = require("@binance/connector");
const { timeStamp, time } = require("console");
const { symbol } = require("joi");

const apiKey =
  "QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
const apiSecret =
  "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";
const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 5000,
});

async function main() {
  // const timestamp = await client.time();
  // console.log(timestamp.data)
  // console.log(Date.now())

  // client.getOrder('BTCUSDT', {
  //   orderId:11753759
  // }).then(response => client.logger.log(response.data))
  //   .catch(error => client.logger.error(error))

  // client.tickerPrice('BTCUSDT').then(response => client.logger.log(response.data))

    client.account()
  .then((response) => {
    console.log(response.data);
    const solBalance = response.data.balances.find((balance) => balance.asset === 'SOL');
    if (solBalance) {
      console.log(`SOL balance: ${solBalance.free} (free), ${solBalance.locked} (locked)`);
    } else {
      console.log('SOL balance not found');
    }
  })



  // client.time()
  //     .then((response) => {
  //         console.log(response.data)
  //     })
  //     .catch((error) => {
  //         console.log(error)
  //     })

  //  const time = timestamp.data.serverTime
// try{
//   client
//   .newOrder('BTCUSDT', 'BUY', 'STOP_LOSS_LIMIT',{ 
//     quantity: 0.0001,
//     price: 67000,
//     stopPrice: 67000,
//     timeInForce: 'GTC',
//     recvWindow: 5000,
//     timestamp: Date.now()
//   }).then((response) => {
//     console.log(response.data)
//   }).catch((error) => {
//     console.log(error)
//   })
// }catch(e){
//   console.log(e)
// }
 

  // client.cancelOrder('BTCUSDT',{
  //   origClientOrderId: 'U02495AD3336-95C41C8B0'
  // })   .then((response) => {
  //           console.log(response.data)
  //         })
  //         .catch((error) => {
  //           console.log(error)
  //         })

  // client.cancelAndReplace('BTCUSDT', 'BUY', 'LIMIT', 'STOP_ON_FAILURE', {
  //   price: '65540',
  //   quantity: 0.0001,
  //   timeInForce: 'GTC',
  //   cancelOrderId: 10266916
  // }).then(response => client.logger.log(response.data))
  //   .catch(error => client.logger.error(error))

  const options = {
    startTime: Date.now() - 3600000, // 1 hour ago
    endTime: Date.now(),            // Current time
    limit: 50,                      // Retrieve 50 candlesticks
  };
    
    //Place new order to Binance.
    //  const orderData = await client.klineCandlestickData(
    //   'BTCUSDT',
    //   "5m",
    //   options,
    // );
    // console.log(orderData)
}

main();

// 1728984399165
// 1728984401249
