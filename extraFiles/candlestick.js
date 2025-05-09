const axios = require('axios');

async function fetchCandlestickData() {
  const symbol = 'BTCUSDT';
  const interval = '5m';
  const limit = 100; // Number of candlesticks to fetch

  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: symbol,
        interval: interval,
        limit: limit
      }
    });

    const candlesticks = response.data.map(candle => ({
      openTime: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
      closeTime: candle[6]
    }));

    console.log(candlesticks);
  } catch (error) {
    console.error('Error fetching candlestick data:', error.message);
  }
}

fetchCandlestickData();


// const WebSocket = require('ws');

// // Subscribe to the Kline stream for BTCUSDT with a 5-minute interval
// const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_5m');

// ws.on('open', () => {
//   console.log('Connected to Binance WebSocket');
// });

// ws.on('message', data => {
//   const parsedData = JSON.parse(data);
  
//   // Extract candlestick data from the message
//   if (parsedData.k) {
//     const kline = parsedData.k; // Candlestick data object
//     console.log({
//       open: kline.o, // Opening price
//       high: kline.h, // Highest price
//       low: kline.l,  // Lowest price
//       close: kline.c, // Closing price
//       volume: kline.v, // Volume
//       startTime: kline.t, // Start time of this candle
//       endTime: kline.T,   // End time of this candle
//       isFinal: kline.x    // Is this the final candlestick of the interval?
//     });
//   }
// });

// ws.on('error', error => {
//   console.error('WebSocket error:', error);
// });

// ws.on('close', () => {
//   console.log('Connection closed');
// });


// const WebSocket = require('ws');

// const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

// ws.on('open', () => {
//   console.log('Connected to Binance WebSocket');
// });

// ws.on('message', data => {
//   console.log('Message received:', JSON.parse(data));
// });

// ws.on('error', error => {
//   console.error('WebSocket error:', error);
// });

// ws.on('close', () => {
//   console.log('Connection closed');
// })