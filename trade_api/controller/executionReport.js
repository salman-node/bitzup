const { Spot, WebsocketStream } = require('@binance/connector');
const { connect } = require('http2');

const apiKey = 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om';
const apiSecret = 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW';

const client = new Spot(apiKey, apiSecret, {
  baseURL: 'https://testnet.binance.vision',
  timeout: 1000
});

const callbacks = {
  open: () => console.log('Connected with Websocket server'),
  close: () => console.log('Disconnected with Websocket server'),
  message: (executionReport) => {
     console.log("\n Execution Report: ", JSON.parse(executionReport));
     const data = JSON.parse(executionReport);
    //  console.log(`\n Execution Report: ${JSON.stringify(data)}`);

    if(data.X == "NEW"){
        console.log(`\n => New ${data.o} Order Placed , Order Type: ${data.o}, Order Price: ${data.p}, Order Quantity: ${data.q}, Order Id: ${data.c}`);
    }
    if(data.X == "PARTIALLY_FILLED"){
        console.log(`\n => Execution Report: Order Partially Filled at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`);
    }
    if(data.X == "FILLED"){
        console.log(`\n => Execution Report: Order Executed at ${data.l}, Order Id: ${data.c} , Filled Quantity: ${data.z}`);
    }
    if(data.X == "CANCELED"){
        console.log(`\n => Cancelled ${data.o} Order Placed, Order Id: ${data.c}`);
    }
    // console.log(data.x)}
}
}


const connectExecutionReport = async () => {
    try {
      const websocketStreamClient = new WebsocketStream({ callbacks, wsURL: "wss://testnet.binance.vision" });
      const ListenKey = await client.createListenKey();
    //   console.log(ListenKey.data.listenKey);
      websocketStreamClient.userData(ListenKey.data.listenKey);
    } catch (error) {
      console.error(error);
      // handle the error here
    }
  };
connectExecutionReport();