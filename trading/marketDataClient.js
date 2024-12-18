const io = require('socket.io-client');
// const socket = io('https://websocket-v2-jrkzj.ondigitalocean.app/');
const socket = io('ws://localhost:8080');

socket.on('connect', () => {
  console.log('Connected to server');
 
  // socket.emit('usdtmarket');
  // socket.emit('coinFetchdata', { symbol: 'BTC' });
});

// socket.emit('marketFetchdata');
// socket.on('marketData', (data) => {
//   console.log('Received marketData data:', JSON.stringify(data, null, 2));
// });

socket.emit('topLosers')
socket.on('topLosers', (data) => {
  console.log('Received topLosers data:', JSON.stringify(data, null, 2));
});

socket.emit('topGainers');
socket.on('topGainers', (data) => {
    console.log('Received topGainers data:', JSON.stringify(data, null, 2));
  });

socket.emit('hotCurrencies');
socket.on('hotCurrencies', (data) => {
    console.log('Received hotCurrencies data:', JSON.stringify(data, null, 2));
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
