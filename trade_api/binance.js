
const { Spot } = require("@binance/connector");

const apiKey =
  "l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq";
const apiSecret =
  "JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW";
const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 10000,
});

async function main() {
  
// try{
//   client
//   .newOrder('BTCUSDT', 'BUY', 'MARKET',{ 
//     quantity: 10,
//     timeInForce: 'GTC',
//     recvWindow: 5000
//   }).then((response) => {
//     console.log(response.data)
//   }).catch((error) => {
//     console.log(error)
//   })
// }catch(e){
//   console.log(e)
// }
// client.newOrder('BNBUSDT', 'BUY', 'MARKET', {
//   quantity: 1,
// }).then(response => client.logger.log(response.data))
//   .catch(error => client.logger.error(error))

   client.account()
  .then((response) => {
    console.log(response.data.balances);
    console.log('BTC balance: ',response.data.balances.find(b => b.asset === 'BTC').free);
    console.log('USDT balance: ',response.data.balances.find(b => b.asset === 'USDT').free);

  })
  .catch((error) => {
    console.log(error);
  });


}
// main();


// const Binance = require('node-binance-api');

// const binance = new Binance().options({
//     APIKEY: 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
//     APISECRET: 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
// });

// let lastPrice = null;

// binance.websockets.trades(['XLMUSDT'], (trade) => {
//     const { p: price } = trade;
//     if (price !== lastPrice) {
//         console.log(`Price update for BTCUSDT: ${price}`);
//         lastPrice = price; // Update last price
//     }
// });

const axios = require('axios');
const mysql = require('mysql');


// Database connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crypto_authdb_bkp'
});


// Function to fetch active trading pairs and their prices
async function fetchAndUpdatePrices() {
    try {
        const tradingPairs =[
            'BTCUSDT', 'SOLUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 
            'ADAUSDT', 'AVAXUSDT', 'LTCUSDT', 
            'DOTUSDT'
        ];

        for (const pair of tradingPairs) {
            const priceResponse = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
            const price = priceResponse.data.lastPrice; // Current price
            const priceChangePercent = priceResponse.data.priceChangePercent; // Change in price percentage

            // Update the price and price change in the database
            db.query(
                'UPDATE crypto_pair SET current_price = ?, change_in_price = ? WHERE pair_symbol = ? and popular = 1',
                [price, priceChangePercent, pair],
                (error, results) => {
                    if (error) {
                        console.error(`Error updating price for ${pair}:`, error);
                    }  else {
                        console.log(`Updated price for ${pair}: ${price} Change Percent: ${priceChangePercent}%`);
                    }
                }
            );
        }
    } catch (error) {
        console.error('Error fetching trading pairs or prices:', error);
    }
}

// Set an interval to fetch and update prices every 5 seconds
setInterval(fetchAndUpdatePrices, 5000);
// fetchAndUpdatePrices();

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database.');
    }
});





    // // ####################################
    // const axios = require('axios');
    // const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    //     const symbols = response.data.symbols;

    //     // Loop through each symbol and update the database
    //     for (const symbol of symbols) {
    //         const pairSymbol = symbol.symbol;

    //         // Get tickSize and stepSize
    //         const tickSize = symbol.filters.find((filter: { filterType: string; }) => filter.filterType === 'PRICE_FILTER').tickSize;
    //         const stepSize = symbol.filters.find((filter: { filterType: string; }) => filter.filterType === 'LOT_SIZE').stepSize;
    //         console.log('tickSize',tickSize , 'stepSize',stepSize)
    //         // Calculate the number of decimal places
    //         const priceDecimal = tickSize.indexOf('1')==0 ? 0 : tickSize.indexOf('1') - 1;
    //         const qtyDecimal = stepSize.indexOf('1')==0 ? 0 : stepSize.indexOf('1') -1;

    //         // Determine the status to update
    //         const statusToUpdate = symbol.status === "BREAK" ? "ONE" : "ZERO";

    //         // Calculate min and max quantities based on stepSize
    //         const minBaseQty = parseFloat(symbol.filters.find((filter: { filterType: string; }) => filter.filterType === 'LOT_SIZE').minQty);
    //         const maxBaseQty = parseFloat(symbol.filters.find((filter: { filterType: string; }) => filter.filterType === 'LOT_SIZE').maxQty);
    //         const minQuoteQty = parseFloat(symbol.filters.find((filter: { filterType: string; }) => filter.filterType === 'NOTIONAL').minNotional);
    //         const maxQuoteQty = parseFloat(symbol.filters.find((filter: { filterType: string; }) => filter.filterType === 'NOTIONAL').maxNotional);
            
    //        console.log('pairSymbol',pairSymbol , 'minBaseQty',minBaseQty , 'maxBaseQty',maxBaseQty , 'minQuoteQty',minQuoteQty , 'maxQuoteQty',maxQuoteQty , 'priceDecimal',priceDecimal , 'qtyDecimal',qtyDecimal)
            
    //         const result = await prisma.$queryRaw`
    //           UPDATE crypto_pair
    //           SET status = ${statusToUpdate},
    //               min_base_qty = ${minBaseQty},
    //               max_base_qty = ${maxBaseQty},
    //               min_quote_qty = ${minQuoteQty},
    //               max_quote_qty = ${maxQuoteQty},
    //               price_decimal = ${priceDecimal},
    //               quantity_decimal = ${qtyDecimal}
    //           WHERE pair_symbol = ${pairSymbol}
    //         `;
        
    //     }
    // // #################################

















  // client.allOrders('BTCUSDT').then(response => client.logger.log(response.data))
  //   .catch(error => client.logger.error(error))

  //   client.myTrades('BTCUSDT').then(response => client.logger.log(response.data))
  // .catch(error => client.logger.error(error))

  // client.tickerPrice('BTCUSDT').then(response => client.logger.log(response.data))

  //   client.account()
  // .then((response) => {
  //   console.log(response.data.balances);
  //   console.log('BTC balance: ',response.data.balances.find(b => b.asset === 'BTC').free);
  //   console.log('USDT balance: ',response.data.balances.find(b => b.asset === 'USDT').free);

  // })
  // .catch((error) => {
  //   console.log(error);
  // });



  // client.time()
  //     .then((response) => {
  //         console.log(response.data)
  //     })
  //     .catch((error) => {
  //         console.log(error)
  //     })

  //  const time = timestamp.data.serverTime

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

  // const options = {
  //   startTime: Date.now() - 3600000, // 1 hour ago
  //   endTime: Date.now(),            // Current time
  //   limit: 50,                      // Retrieve 50 candlesticks
  // };
    
    //Place new order to Binance.
    //  const orderData = await client.klineCandlestickData(
    //   'BTCUSDT',
    //   "5m",
    //   options,
    // );
    // console.log(orderData)


// 1728984399165
// 1728984401249
