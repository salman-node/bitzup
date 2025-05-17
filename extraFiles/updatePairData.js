const axios = require('axios');
const mysql = require('mysql2/promise'); // Use mysql2 for promise support

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'crypto_authdb_bkp'
});


function getDecimalPlaces(numberStr) {
  if (!numberStr || !numberStr.includes('.')) return 0;
  const trimmed = numberStr.replace(/0+$/, '');
  return trimmed.includes('.') ? trimmed.split('.')[1].length : 0;
}

function getDecimalPlaces(numberStr) {
  if (!numberStr || !numberStr.includes('.')) return 0;
  const trimmed = numberStr.replace(/0+$/, '');
  return trimmed.includes('.') ? trimmed.split('.')[1].length : 0;
}

async function updateAllPairs() {
  try {
    // Get all symbols info
    const exchangeInfoRes = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const symbolsInfo = exchangeInfoRes.data.symbols;

    // Get price & change data for all symbols in one request
    const tickerRes = await axios.get('https://api.binance.com/api/v3/ticker/24hr');
    const tickerMap = {};
    tickerRes.data.forEach(ticker => {
      tickerMap[ticker.symbol] = {
        price: parseFloat(ticker.lastPrice),
        change: parseFloat(ticker.priceChangePercent),
      };
    });

    let updatedCount = 0;

    for (const symbol of symbolsInfo) {
      const pairSymbol = symbol.symbol;
      const lotSize = symbol.filters.find(f => f.filterType === 'LOT_SIZE');
      const priceFilter = symbol.filters.find(f => f.filterType === 'PRICE_FILTER');

      if (!lotSize || !priceFilter) continue;

      const quantityDecimal = getDecimalPlaces(lotSize.stepSize);
      const priceDecimal = getDecimalPlaces(priceFilter.tickSize);

      const ticker = tickerMap[pairSymbol];
      if (!ticker) continue;

      const currentPrice = ticker.price;
      const changeInPrice = ticker.change;

      // Update DB
      const [result] = await pool.query(
        `UPDATE crypto_pair 
         SET current_price = ?, change_in_price = ?, quantity_decimal = ?, price_decimal = ? 
         WHERE pair_symbol = ?`,
        [currentPrice, changeInPrice, quantityDecimal, priceDecimal, pairSymbol]
      );

      if (result.affectedRows > 0) {
        console.log(`Updated: ${pairSymbol}`);
        updatedCount++;
      }
    }

    console.log(`✅ Updated ${updatedCount} pair(s)`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

updateAllPairs();









