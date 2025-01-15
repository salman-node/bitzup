dotenv = require("dotenv");
dotenv.config();

exports.config = {
  binance_apiKey:process.env.BINANCE_API_KEY || 'gppTzIeLcnA2uAf8E0Hwda9RcwsIPoBdoA0dsqbU0AEXmLCRDccArhGMa4r71H3x',
  api_secret:process.env.BINANCE_API_SECRET || 'LDIUwHvnrSapjMrUb7xQLw4HfQbRBs2cBCEn96vLmHDl85fntvknGYr7jS6VIisE',
  binance_url:process.env.BINANCE_URL || "https://testnet.binance.vision"
};

