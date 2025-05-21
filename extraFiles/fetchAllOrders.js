const axios = require('axios');
const crypto = require('crypto');

const apiKey = 'Gj6LpFlLZC8ISpjCehEqE2RpQjRKIKYDygmcVc3TCDNF4AyYu6BzBtahzGILoT3R';
const apiSecret = '4TGEcO0dMjwNMPqKWzV6ZnHJwM3B6OFWtvYWj9JBuan6VIjgJtAeFHE6gt4qU30j';
const baseUrl = 'https://api.binance.com';

async function getAllSymbols() {
  const response = await axios.get(`${baseUrl}/api/v3/exchangeInfo`);
  return response.data.symbols.map(s => s.symbol);
}

function signQuery(query) {
  return crypto.createHmac('sha256', apiSecret)
    .update(query)
    .digest('hex');
}

async function getOrdersForSymbol(symbol) {
  const timestamp = Date.now();
  const query = `symbol=${symbol}&timestamp=${timestamp}`;
  const signature = signQuery(query);
  const url = `${baseUrl}/api/v3/myTrades?${query}&signature=${signature}`;

  try {
    const response = await axios.get(url, {
      headers: { 'X-MBX-APIKEY': apiKey }
    });
    return response.data;
  } catch (err) {
    console.warn(`Skipping ${symbol}:`, err.response?.data || err.message);
    return [];
  }
}

(async () => {
  const allOrders = {};
  const symbols = await getAllSymbols();

  // Optional: Filter only symbols you care about, e.g. USDT pairs
//   const filtered = symbols.filter(s => s.endsWith('USDT'));
const filtered = ['BTCUSDT','XRPUSDT','ADAUSDT']

  for (const symbol of filtered) {
    console.log(`Fetching orders for ${symbol}`);
    const orders = await getOrdersForSymbol(symbol);
    if (orders.length > 0) {
      allOrders[symbol] = orders;
    }
    // Optional: wait a bit to avoid rate limiting
    await new Promise(res => setTimeout(res, 300));
  }

  console.log('Done. Orders:', allOrders);
})();
