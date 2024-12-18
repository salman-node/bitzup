# trade_backend_apis
create order. cancel, modify and executed apis.

# Binance Account Detials Balances

# Request: 
client.account()
    .then((response) => {
        console.log(response.data.balances)
    })
    .catch((error) => {
        console.log(error)
    })
# Response :
[
  { asset: 'ETH', free: '1.00000000', locked: '0.00000000' },
  { asset: 'BTC', free: '1.00000000', locked: '0.00000000' },
  { asset: 'LTC', free: '7.00000000', locked: '0.00000000' },
  { asset: 'BNB', free: '3.56900000', locked: '0.00000000' },
  { asset: 'USDT', free: '8474.58740000', locked: '76.80000000' },
  { asset: 'TRX', free: '3343.00000000', locked: '0.00000000' },
  { asset: 'XRP', free: '894.00000000', locked: '0.00000000' },
  { asset: 'WRX', free: '3810.00000000', locked: '0.00000000' },
  ... 290 more items
]

# Place New order
create client using apiKey , apiSecret
const {Spot} = require('@binance/connector');
const apiKey = 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om'
const apiSecret = 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW'
const client = new Spot(apiKey, apiSecret, { baseURL: 'https://testnet.binance.vision', timeout: 1000 });

# Request: 
client.newOrder('BNBUSDT', "BUY", 'LIMIT', {
    price: '512',
    quantity: 0.05, 
    timeInForce: 'GTC'
  })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

# Response:
{
  symbol: 'BNBUSDT',
  orderId: 6217276,
  orderListId: -1,
  clientOrderId: 'p87GljYUZPpFDiKRyTjhrL',
  transactTime: 1727148783306,
  price: '512.00000000',
  origQty: '0.05000000',
  executedQty: '0.00000000',
  cummulativeQuoteQty: '0.00000000',
  status: 'NEW',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'BUY',
  workingTime: 1727148783306,
  fills: [],
  selfTradePreventionMode: 'EXPIRE_MAKER'
}

# Response2:
{
  symbol: 'BNBUSDT',
  orderId: 6241777,
  orderListId: -1,
  clientOrderId: 'TRDF8E1E2BE7DD3424B85A69',
  transactTime: 1727155517732,
  price: '0.00000000',
  origQty: '0.01900000',
  executedQty: '0.01900000',
  cummulativeQuoteQty: '11.42470000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  workingTime: 1727155517732,
  fills: [
    {
      price: '601.30000000',
      qty: '0.01900000',
    {
      price: '601.30000000',
    {
      price: '601.30000000',
    {
      price: '601.30000000',
    {
      price: '601.30000000',
    {
      price: '601.30000000',
    {
      price: '601.30000000',
      qty: '0.01900000',
    {
      price: '601.30000000',
      qty: '0.01900000',
    {
      price: '601.30000000',
    {
      price: '601.30000000',
      qty: '0.01900000',
      commission: '0.00000000',
      commissionAsset: 'BNB',
      tradeId: 193442
    }
  ],
  selfTradePreventionMode: 'EXPIRE_MAKER'
}

# Response3:
{
  symbol: 'BNBUSDT',
  orderId: 6240450,
  orderListId: -1,
  clientOrderId: 'TRDE3199B1ED1D44A4998BCC',
  transactTime: 1727155146525,
  price: '0.00000000',
  origQty: '0.01900000',
  executedQty: '0.01900000',
  cummulativeQuoteQty: '11.43800000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  workingTime: 1727155146525,
  fills: [
    {
      price: '602.00000000',
      qty: '0.01900000',
      commission: '0.00000000',
      commissionAsset: 'BNB',
      tradeId: 193433
    }
  ],
  selfTradePreventionMode: 'EXPIRE_MAKER'
}

# Request:
{
    "pair_id":"BNBUSDT4356B3C91",
    "quantity":"2",
    "side":"BUY",
    "order_type":"MARKET",
    "quote_volume":"10"
}

# Response:
{
  symbol: 'BNBUSDT',
  orderId: 6246104,
  orderListId: -1,
  clientOrderId: 'TRDA5A555B82BA54FE7A91E1',
  transactTime: 1727156730632,
  price: '0.00000000',
  origQty: '0.01600000',
  executedQty: '0.01600000',
  cummulativeQuoteQty: '9.60800000',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  workingTime: 1727156730632,
  fills: [
    {
      price: '600.50000000',
      qty: '0.01600000',
      commission: '0.00000000',
      commissionAsset: 'BNB',
      tradeId: 193477
    }
  ],
  selfTradePreventionMode: 'EXPIRE_MAKER'
}



# Request:
{
    "pair_id":"BNBUSDT4356B3C91",
    "at_price":"600.50000000",
    "base_volume":"0.011",
    "side":"BUY",
    "order_type":"LIMIT",
    "quote_volume":"10"
}

# Response:
{
  symbol: 'BNBUSDT',
  orderId: 6246989,
  orderListId: -1,
  clientOrderId: 'TRDAA2946A054CB4977B37B1',
  transactTime: 1727156973049,
  price: '600.50000000',
  origQty: '0.01100000',
  executedQty: '0.00000000',
  cummulativeQuoteQty: '0.00000000',
  status: 'NEW',
  timeInForce: 'GTC',
  type: 'LIMIT',
  side: 'BUY',
  workingTime: 1727156973049,
  fills: [],
  selfTradePreventionMode: 'EXPIRE_MAKER'
}


orderData {
  symbol: 'BTCUSDT',
  orderId: 9750771,
  orderListId: -1,
  clientOrderId: 'U02495AD3336-F794A2628',
  transactTime: 1729487974034,
  price: '0.00000000',
  origQty: '0.01449000',
  executedQty: '0.01449000',
  cummulativeQuoteQty: '999.63527160',
  status: 'FILLED',
  timeInForce: 'GTC',
  type: 'MARKET',
  side: 'BUY',
  workingTime: 1729487974034,
  fills: [
    {
      price: '68987.89000000',
      qty: '0.00472000',
      commission: '0.00000000',
      commissionAsset: 'BTC',
      tradeId: 2219146
    },
    {
      price: '68987.93000000',
      qty: '0.00457000',
      commission: '0.00000000',
      commissionAsset: 'BTC',
      tradeId: 2219147
    },
    {
      price: '68987.99000000',
      qty: '0.00125000',
      commission: '0.00000000',
      commissionAsset: 'BTC',
      tradeId: 2219148
    },
    {
      price: '68988.00000000',
      qty: '0.00363000',
      commission: '0.00000000',
      commissionAsset: 'BTC',
      tradeId: 2219149
    },
    {
      price: '68988.01000000',
      qty: '0.00032000',
      commission: '0.00000000',
      commissionAsset: 'BTC',
      tradeId: 2219150
    }
  ],
  selfTradePreventionMode: 'EXPIRE_MAKER'
}

# Execution Report

{
  "e": "executionReport",        // Event type
  "E": 1499405658658,            // Event time
  "s": "ETHBTC",                 // Symbol
  "c": "mUvoqJxFIILMdfAW5iGSOW", // Client order ID
  "S": "BUY",                    // Side
  "o": "LIMIT",                  // Order type
  "f": "GTC",                    // Time in force
  "q": "1.00000000",             // Order quantity
  "p": "0.10264410",             // Order price
  "P": "0.00000000",             // Stop price
  "F": "0.00000000",             // Iceberg quantity
  "g": -1,                       // OrderListId
  "C": "",                       // Original client order ID; This is the ID of the order being canceled
  "x": "NEW",                    // Current execution type
  "X": "NEW",                    // Current order status
  "r": "NONE",                   // Order reject reason; will be an error code.
  "i": 4293153,                  // Order ID
  "l": "0.00000000",             // Last executed quantity
  "z": "0.00000000",             // Cumulative filled quantity
  "L": "0.00000000",             // Last executed price
  "n": "0",                      // Commission amount
  "N": null,                     // Commission asset
  "T": 1499405658657,            // Transaction time
  "t": -1,                       // Trade ID
  "I": 8641984,                  // Ignore
  "w": true,                     // Is the order on the book?
  "m": false,                    // Is this trade the maker side?
  "M": false,                    // Ignore
  "O": 1499405658657,            // Order creation time
  "Z": "0.00000000",             // Cumulative quote asset transacted quantity
  "Y": "0.00000000",             // Last quote asset transacted quantity (i.e. lastPrice * lastQty)
  "Q": "0.00000000",             // Quote Order Quantity
  "W": 1499405658657,            // Working Time; This is only visible if the order has been placed on the book.
  "V": "NONE"                    // selfTradePreventionMode
}



# if side is buy and market
take quote_volume from req.body 
check user  balance for quote volume from db

# if side is buy and limit 
take base_volume and limit price and calculate quote_volume 
check user balance for base volume

# Command to start Zookeeper

PS C:\kafka_2.13-3.8.0\bin\windows> .\zookeeper-server-start.bat C:\kafka_2.13-3.8.0\config\zookeeper.properties
C:\kafka_2.13-3.8.0\bin\windows\zookeeper-server-start.bat C:\kafka_2.13-3.8.0\config\zookeeper.properties
# Command to start Kafka
 
C:\kafka_2.13-3.8.0\bin\windows>  ./kafka-server-start.bat C:\kafka_2.13-3.8.0\config\server.properties
C:\kafka_2.13-3.8.0\bin\windows\kafka-server-start.bat C:\kafka_2.13-3.8.0\config\server.properties




