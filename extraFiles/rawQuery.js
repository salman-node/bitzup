const { v4: uuidv4 } = require('uuid'); // for generating pair_id
// const moment = require('moment'); // for created_at timestamp
const mysql = require('mysql2'); // or use your preferred DB client

// Create a database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crypto_authdb_bkp'
});

connection.connect();

const insertCryptoPairs = async () => {
  try {
    // Query to get all currencies except USDT
    const query = 'SELECT * FROM currencies WHERE symbol != "USDT"';
    
    const currencies = await new Promise((resolve, reject) => {
      connection.query(query, (error, currencies) => {
        if (error) reject(error);
        else resolve(currencies);
      });
    });

    const promises = currencies.map((currency) => {
      // const pairId = GenerateUniqueID(16, uuidv4(), currency.symbol+"USDT"); // Generate unique ID for pair_id
      // const baseAssetId = currency.currency_id; // Currency's ID
      // const quoteAssetId = 'USDT7B6D0D'; // Assuming USDT has a fixed currency_id
      // const pairSymbol = currency.symbol + 'USDT'; // Pair symbol like BTCUSDT, ETHUSDT
      // const currentPrice = currency.usdtprice;
      // const minBaseQty = 0.001;
      // const maxBaseQty = 1000;
      // const minQuoteQty = 1;
      // const maxQuoteQty = 1000;
      // const tradeFee = 0.1;
      // const quantityDecimal = currency.qty_decimal;
      // const priceDecimal = currency.price_decimal;
      // const status = "ONE";
      // const polular = currency.popular;
         const chart_id = currency.chart_id;
         const trade_status = currency.trade_status;
         const pro_trade = currency.pro_trade;
         const change_in_price = currency.change_in_price;
         const icon = currency.icon;
      
      // Insert query for crypto_pair
      // const insertQuery = `INSERT INTO crypto_pair (
      //   pair_id, base_asset_id, quote_asset_id, pair_symbol, current_price, min_base_qty, 
      //   max_base_qty, min_quote_qty, max_quote_qty, trade_fee, quantity_decimal, price_decimal, 
      //   status,popular
      // ) VALUES (
      //   ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
      // )`;
      const updateQuery = `UPDATE crypto_pair
  SET chart_id = ?, trade_status = ?, pro_trade = ?, change_in_price = ?,icon = ?
  WHERE base_asset_id = ?`;

const values = [
  chart_id, trade_status, pro_trade, change_in_price,icon, currency.currency_id
];
      
      // Execute the insert query
      return new Promise((resolve, reject) => {
        connection.query(updateQuery, values, (err, result) => {
          if (err) reject(err);
          else {
            console.log(`Inserted pair:`);
            resolve();
          }
        });
      });
    });

    await Promise.all(promises);
  } catch (error) {
    console.error(error);
  }finally {
    // Close the connection after all operations are complete
    connection.end((err) => {
      if (err) {
        console.error('Error closing the connection:', err);
      } else {
        console.log('Connection closed.');
      }
    });
  }
};

insertCryptoPairs();


 const GenerateUniqueID = (count, string, prefix) => {
    var str = "";
    for (var i = 0; i < count; i++) {
      if (string[i] != "-") {
        str += string[i];
      }
    }
    return (prefix + str).toUpperCase();
  };
