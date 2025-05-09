const { WebSocket } = require('ws');

const wsUrl = 'ws://localhost:9001';
const ws = new WebSocket(wsUrl);

ws.on('open', () => {
  console.log('Connected to WebSocket server');
});

ws.on('message', (data) => {
  console.log(`Received message from server: ${data}`);
  const messageData = JSON.parse(data);
//   switch (messageData.message) {
//     case 'New Order Placed':
//       console.log(`New ${messageData.data.o} Order Placed , Order Type: ${messageData.data.o}, Order Price: ${messageData.data.p}, Order Quantity: ${messageData.data.q}, Order Id: ${messageData.data.c}`);
//       break;
//     case 'Order Partially Filled':
//       console.log(`Order Partially Filled at ${messageData.data.l}, Order Id: ${messageData.data.c} , Filled Quantity: ${messageData.data.z}`);
//       break;
//     case 'Order Executed':
//       console.log(`Order Executed at ${messageData.data.l}, Order Id: ${messageData.data.c} , Filled Quantity: ${messageData.data.z}`);
//       break;
//     case 'Cancelled Order':
//       console.log(`Cancelled ${messageData.data.o} Order, Order Id: ${messageData.data.c}`);
//       break;
//     default:
//       console.log(`Unknown message type: ${messageData.message}`);
//   }
});

ws.on('error', (error) => {
  console.error('Error occurred:', error);
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});