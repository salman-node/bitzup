const WebSocket = require('ws');

// Define symbols you want to track (must be lowercase)
const symbols = ['btcusdt', 'ethusdt', 'bnbusdt'];

// Create the combined stream URL
const streams = symbols.map(symbol => `${symbol}@miniTicker`).join('/');
const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;
console.log(url)

const ws = new WebSocket(url);

ws.on('open', () => {
  console.log(`Connected to Binance miniTicker stream for: ${symbols.join(', ')}`);
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data);

  // Each message contains a single symbol update
  const ticker = parsed.data;


  console.log(`[${ticker.s}] Price: ${ticker.c} | High: ${ticker.h} | Low: ${ticker.l}`);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});
