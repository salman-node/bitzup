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

function floorToStep(value, stepSize) {
  return Math.floor(value / stepSize) * stepSize;
}

async function updateMinMaxQty() {
  // const connection = await mysql.createConnection(dbConfig);

  try {
    // Fetch Binance exchange info
    const binanceRes = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
    const binanceSymbols = binanceRes.data.symbols;

    // Fetch all crypto pairs from your DB
    const [rows] = await pool.execute('SELECT id, pair_symbol, current_price FROM crypto_pair');

    for (const row of rows) {
      const { id, pair_symbol, current_price } = row;

      const symbolInfo = binanceSymbols.find(s => s.symbol === pair_symbol);
      if (!symbolInfo) {
        console.warn(`Pair ${pair_symbol} not found on Binance`);
        continue;
      }

      const lotSize = symbolInfo.filters.find(f => f.filterType === 'LOT_SIZE');
      const notional = symbolInfo.filters.find(f => f.filterType === 'NOTIONAL');

      if (!lotSize || !notional || !current_price || current_price === 0) {
        console.warn(`Missing filter or price for ${pair_symbol}`);
        continue;
      }

      const stepSize = parseFloat(lotSize.stepSize);
      const minQty = parseFloat(lotSize.minQty);
      const maxQty = parseFloat(lotSize.maxQty);
      const minNotional = parseFloat(notional.minNotional);
      const maxNotional = parseFloat(notional.maxNotional || '999999999');

      const price = parseFloat(current_price);

      // Calculate min/max base qty based on notional
      const minBaseQty = floorToStep(minNotional / price, stepSize);
      const maxBaseQty = floorToStep(maxNotional / price, stepSize);

      // Quote qty = minNotional / maxNotional directly
      const minQuoteQty = minNotional;
      console.log('minNotional ;',pair_symbol, minNotional);
      const maxQuoteQty = maxNotional;

      await pool.execute(
        `UPDATE crypto_pair
         SET min_base_qty = ?, max_base_qty = ?, min_quote_qty = ?, max_quote_qty = ?
         WHERE pair_symbol = ?`,
        [minBaseQty, maxBaseQty, minQuoteQty, maxQuoteQty, pair_symbol]
      );

      console.log(`Updated: ${pair_symbol}`);
    }

    console.log('All crypto pairs updated.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

updateMinMaxQty();

// updateAllPairs();









