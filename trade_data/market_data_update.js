
// const axios = require('axios');
// const mysql = require('mysql');
// const cron = require('node-cron');

// // Database connection setup
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'crypto_authdb_bkp'
// });


// // Function to fetch active trading pairs and their prices
// async function fetchAndUpdatePrices() {
//     try {
//         const tradingPairs =[
//             'BTCUSDT', 'SOLUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 
//             'ADAUSDT', 'AVAXUSDT', 'LTCUSDT', 
//             'DOTUSDT'
//         ];

//         for (const pair of tradingPairs) {
//             const priceResponse = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);
//             const price = priceResponse.data.lastPrice; // Current price
//             const priceChangePercent = priceResponse.data.priceChangePercent; // Change in price percentage

//             // Update the price and price change in the database
//             db.query(
//                 'UPDATE crypto_pair SET current_price = ?, change_in_price = ? WHERE pair_symbol = ? and popular = 1',
//                 [price, priceChangePercent, pair],
//                 (error, results) => {
//                     if (error) {
//                         console.error(`Error updating price for ${pair}:`, error);
//                     }  else {
//                         console.log(`Updated price for ${pair}: ${price} Change Percent: ${priceChangePercent}%`);
//                     }
//                 }
//             );
//         }
//     } catch (error) {
//         console.error('Error fetching trading pairs or prices:', error);
//     }
// }

// // Set a cron job to fetch and update prices every 5 seconds
// cron.schedule('*/5 * * * * *', fetchAndUpdatePrices);
// // fetchAndUpdatePrices();

// // Connect to the database
// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err);
//     } else {
//         console.log('Connected to the database.');
//     }
// });


// ####################### For all pairs #############################???

const axios = require('axios');
const mysql = require('mysql');
const cron = require('node-cron');

// Database connection pool setup
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crypto_authdb_bkp'
});

async function fetchAndUpdatePrices() {
    try {
        // Fetch trading pairs
        pool.query('SELECT pair_symbol FROM crypto_pair WHERE status = "ZERO"', (error, results) => {
            if (error) {
                console.error('Error fetching pairs from database:', error);
                return;
            }

            const tradingPairs = results.map(row => row.pair_symbol);

            // Fetch currency symbols like BTC, ETH
            pool.query('SELECT symbol FROM currencies', async (err, currencyRows) => {
                if (err) {
                    console.error('Error fetching currencies:', err);
                    return;
                }

                const currencySymbols = currencyRows.map(row => row.symbol.toUpperCase());

                try {
                    const priceResponse = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
                    const priceData = priceResponse.data;

                    const updates = [];

                    for (const pair of tradingPairs) {
                        const pairData = priceData.find(item => item.symbol === pair);
                        if (pairData) {
                            const price = pairData.lastPrice;
                            const changePercent = pairData.priceChangePercent;
                            updates.push([price, changePercent, pair]);
                        } else {
                            console.log(`Pair ${pair} not found in Binance API data.`);
                        }
                    }

                    // Update crypto_pair table
                    const updatePromises = updates.map(update => {
                        return new Promise((resolve, reject) => {
                            pool.query(
                                'UPDATE crypto_pair SET current_price = ?, change_in_price = ? WHERE pair_symbol = ?',
                                update,
                                (error) => {
                                    if (error) {
                                        console.error(`Error updating crypto_pair for ${update[2]}:`, error);
                                        reject(error);
                                    } else {
                                        resolve();
                                    }
                                }
                            );
                        });
                    });

                    // Update currencies table if symbol matches (e.g., BTCUSDT)
                    const currencyUpdatePromises = updates.map(update => {
                        const [price, changePercent, symbol] = update;

                        for (const currency of currencySymbols) {
                            if (symbol === currency + 'USDT') {
                                return new Promise((resolve, reject) => {
                                    pool.query(
                                        'UPDATE currencies SET usdtprice = ?, change_in_price = ? WHERE symbol = ?',
                                        [price, changePercent, currency],
                                        (error) => {
                                            if (error) {
                                                console.error(`Error updating currencies for ${currency}:`, error);
                                                reject(error);
                                            } else {
                                                resolve();
                                            }
                                        }
                                    );
                                });
                            }
                        }

                        return Promise.resolve();
                    });

                    await Promise.all([...updatePromises, ...currencyUpdatePromises]);

                } catch (apiError) {
                    console.error('Error fetching price data from Binance:', apiError);
                }
            });
        });
    } catch (error) {
        console.error('Error in fetchAndUpdatePrices:', error);
    }
}

// Run the job every 5 seconds
cron.schedule('*/30 * * * * *', fetchAndUpdatePrices);

// Optional: Initial DB connection test
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database.');
        connection.release();
    }
});


// Function to fetch active trading pairs and their prices
// async function fetchAndUpdatePrices() {
//     try {
//         // Fetch all pairs from the database
//         pool.query('SELECT pair_symbol FROM crypto_pair WHERE status = "ZERO"', async (error, results) => {
//             if (error) {
//                 console.error('Error fetching pairs from database:', error);
//                 return;
//             }

//             const tradingPairs = results.map(row => row.pair_symbol); // Extract pair symbols

//             // Fetch prices for all trading pairs from Binance API
//             const priceResponse = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
//             const priceData = priceResponse.data;
   
//             // Prepare an array for batch updates
//             const updates = [];

//             for (const pair of tradingPairs) {
//                 const pairData = priceData.find(item => item.symbol === pair);
//                 if (pairData) {
//                     const price = pairData.lastPrice; // Current price
//                     const priceChangePercent = pairData.priceChangePercent; // Change in price percentage

//                     // Collect updates for batch processing
//                     updates.push([price, priceChangePercent, pair]);
//                 } else {
//                     console.log(`Pair ${pair} not found in Binance API data.`);
//                 }
//             }
//               console.log(updates);
//             // Perform batch update
//             if (updates.length > 0) {
//                 const updatePromises = updates.map(update => {
//                     return new Promise((resolve, reject) => {
//                         pool.query(
//                             'UPDATE crypto_pair SET current_price = ?, change_in_price = ? WHERE pair_symbol = ?',
//                             update,
//                             (error, results) => {
//                                 if (error) {
//                                     console.error(`Error updating price for ${update[2]}:`, error);
//                                     reject(error);
//                                 } else {
                                    
//                                     // console.log(`Updated price for ${update[2]}: ${update[0]} Change Percent: ${update[1]}%`);
//                                     resolve();
//                                 }
//                             }
//                         );
//                     });
//                 });

//                 // Wait for all updates to complete
//                 await Promise.all(updatePromises);
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching trading pairs or prices:', error);
//     }
// }