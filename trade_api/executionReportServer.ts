import { Spot, WebsocketStream } from '@binance/connector-typescript';
import {WebSocket} from 'ws';
import { prisma } from './config/prisma_client';
import { Prisma } from '@prisma/client';

const apiKey = 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om';
const apiSecret = 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW';

const client = new Spot(apiKey, apiSecret, {
  baseURL: 'https://testnet.binance.vision',
  timeout: 1000,
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: 9001 });
let frontendClients: WebSocket[] = [];

// Listen for frontend connections
wss.on('connection', (ws: WebSocket) => {
  console.log('Frontend client connected');
  frontendClients.push(ws);

  ws.on('close', () => {
    console.log('Frontend client disconnected');
    frontendClients = frontendClients.filter((client) => client !== ws);
  });
});

const callbacks = {
  open: () => console.log('Connected with Binance WebSocket server'),
  close: () => console.log('Disconnected with Binance WebSocket server'),
  message: async (executionReport: string) => {
    const data = JSON.parse(executionReport);
    console.log(data);
    // Send execution report to all connected frontend clients
    frontendClients.forEach(async (client: WebSocket) => {
      if (data.X === 'NEW') {
        const report = {
          status: '1',
          message: `New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`,
          data: JSON.stringify(data),
        };
        client.send(JSON.stringify(report));
        console.log(`New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`);
      }
      if (data.X === 'PARTIALLY_FILLED') {
        const report = {
          status: '2',
          message: `Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
          data: JSON.stringify(data),
        };
        client.send(JSON.stringify(report));
        console.log(`Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`);

        const updateData = await prisma.buy_sell_pro_limit_open.update({
          where: {
            order_id: data.c,
          },
          data: {
            status: data.x,
            base_quantity: data.q,
            quote_quantity: data.Q,
            order_price: data.p,
            executed_base_quantity: data.z,
            executed_quote_quantity: data.Z,
            stop_limit_price: data.P,
            oco_stop_limit_price: 0,
            final_amount: data.Z,
            order_id: data.c,
            api_order_id: data.C,
            order_type: data.o,
            buy_sell_fees: data.N,
            api_id: data.i,
            response: JSON.stringify(data),
            date_time: data.T,
            response_time: data.E,
          },
        });
      }
      if (data.X === 'FILLED') {
        console.log(`Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`);
        const report = {
          status: '3',
          message: `Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`,
          data: JSON.stringify(data),
        };

        client.send(JSON.stringify(report));

        const updateData = await prisma.buy_sell_pro_limit_open.update({
          where: {
            order_id: data.c,
          },
          data: {
            status: data.x,
            base_quantity: data.q,
            quote_quantity: data.Q,
            order_price: data.p,
            executed_base_quantity: data.z,
            executed_quote_quantity: data.Z,
            stop_limit_price: data.P,
            oco_stop_limit_price: 0,
            final_amount: data.Z,
            order_id: data.c,
            api_order_id: data.C,
            order_type: data.o,
            buy_sell_fees: data.N,
            api_id: data.i,
            response: JSON.stringify(data),
            date_time: data.T,
            response_time: data.E,
          },
        });
      }
      if (data.X === 'CANCELED') {
        const report = {
          status: '4',
          message: `Cancelled ${data.o} Order Placed, Order Id: ${data.c}`,
          data: JSON.stringify(data),
        };
        client.send(JSON.stringify(report));
        console.log(`Cancelled ${data.o} Order, Order Id: ${data.c}`);
      }
    });
  },
};

const connectExecutionReport = async () => {
  try {
    const websocketStreamClient = await new WebsocketStream({ callbacks, wsURL: 'wss://testnet.binance.vision' });
    const ListenKey = await client.createListenKey();
    websocketStreamClient.userData(ListenKey.listenKey);
  } catch (error) {
    console.error(error);
  }
};

connectExecutionReport();