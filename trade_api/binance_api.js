const {
    Spot,
    Side,
    OrderType,
    TimeInForce,
    NewOrderRespType
  } = require( "@binance/connector-typescript");
  
const apiKey ="QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
const apiSecret = "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";
const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 1000,
});



//    const  options = {
//       price: limit_price,
//       quantity: baseVolume,
//       timeInForce: TimeInForce.GTC,
//       newClientOrderId: OrderId,
//       newOrderRespType: NewOrderRespType.FULL,
//       recvWindow: 5000
//     };

const options = {
  startTime: Date.now() - 3600000, // 1 hour ago
  endTime: Date.now(),            // Current time
  limit: 50,                      // Retrieve 50 candlesticks
};
  
  //Place new order to Binance.
   const orderData = await client.klineCandlestickData(
    'BTCUSDT',
    "5m",
    options,
  );
  console.log(orderData)

