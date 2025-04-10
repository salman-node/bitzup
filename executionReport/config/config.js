dotenv = require("dotenv");
dotenv.config();

exports.config = {
  binance_apiKey:process.env.BINANCE_API_KEY || 'l6SlJipQWrLRSAPCezEJcM8yrjVzhrDQU2QQSh4AnuKq4sRJao87jEgmFsLeyWEq',
  api_secret:process.env.BINANCE_API_SECRET || 'JW85c09ek8e0c7PnBkig03TSwN3ENH4KremdNekgRx16twhK7YN0HMU2J5IbhuJW',
  binance_url:process.env.BINANCE_URL || "https://testnet.binance.vision"
};

