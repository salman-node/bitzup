dotenv = require("dotenv");
dotenv.config();

exports.config = { //mysql connection 
  host:process.env.host || 'localhost',
  user:process.env.user || 'root',
  password:process.env.password || 'root',
  database:process.env.database || 'crypto_authdb_bkp',

  //redis connection
  REDIS_HOST: process.env.REDIS_HOST || 'redis-18514.c322.us-east-1-2.ec2.redns.redis-cloud.com',
  REDIS_PORT: process.env.REDIS_PORT || 18514,
  REDIS_USER: process.env.REDIS_USER || 'default',
  REDIS_AUTH: process.env.REDIS_AUTH || 'blE32GqYBT9dHDyopO1tiG10AKOuW0C8',

};

exports.accounts = [
    {  // mainnet salman account
    name: process.env.AccountName1 || 'BinanceAccount1',
    binance_url: process.env.BINANCE_URL1 || "https://api.binance.com",
    apiKey: process.env.BINANCE_API_KEY_1 || 'TjnvJCOXHB54SjgvrOSqRaFK2rTUApJGfM30UPOFbsAZprFRtSDLf203phlHej8g',
    apiSecret: process.env.BINANCE_API_SECRET_1 || 'AkkfmZtrszpLQttGwes4r5mX03M79Da6TYr0vYgyoL13K0LxF0n4dMCDi33SN7yz',
    binance_ws_url: process.env.BINANCE_WS_URL1 || "wss://stream.binance.com:9443",
  },
  // {  //testnet
  //   name: process.env.AccountName1 || 'BinanceAccount2',
  //   binance_url: process.env.BINANCE_URL1 || "https://testnet.binance.vision",
  //   apiKey: process.env.BINANCE_API_KEY_1 || 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
  //   apiSecret: process.env.BINANCE_API_SECRET_1 || 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
  //   binance_ws_url: process.env.BINANCE_WS_URL1 || "wss://testnet.binance.vision",
  // },
  // {   //testnet
  //   name: process.env.AccountName2 || 'BinanceAccount3',
  //   binance_url: process.env.BINANCE_URL2 || "https://testnet.binance.vision",
  //   apiKey: process.env.BINANCE_API_KEY_2 || 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om',
  //   apiSecret: process.env.BINANCE_API_SECRET_2 || 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW',
  //   binance_ws_url: process.env.BINANCE_WS_URL2 ||  "wss://testnet.binance.vision" // "wss://stream.binance.com:9443",
  // }
  // Add more accounts as needed
];


