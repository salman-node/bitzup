"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWalletRouter = exports.throttleMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
exports.userWalletRouter = router;
const authentication_1 = require("../middleware/authentication");
const user_wallet_controller_1 = require("../controller/user.wallet.controller");
// Object to store the last timestamp of each user's API call
const userLastCall = {};
// function throttle(func: Function, limit: number) {
//   let inThrottle = false;
//   return function(this: any, ...args: any[]) { // Specify the type of 'this' as 'any'
//       const context = this;
//       if (!inThrottle) {
//           // Call the API function
//           func.apply(context, args);
//           inThrottle = true;
//           // Reset the throttle flag after the specified limit
//           setTimeout(() => (inThrottle = false), limit);
//       }
//   };
// }
router.route('/get-buy-sell-balance').post([authentication_1.verifyUser], user_wallet_controller_1.getBuySellBalance);
router
    .route('/get-all-currencies-balance')
    .post([authentication_1.checkLogin], user_wallet_controller_1.getAllCurrenciesBalance);
router
    .route('/get-deposit-withdraw-asset')
    .get([authentication_1.checkLogin], user_wallet_controller_1.getDepositWithdrawList);
router.get('/get-all-networks', authentication_1.verifyUser, user_wallet_controller_1.getAllNetwork);
router.post('/get-user-walletAddress', authentication_1.verifyUser, user_wallet_controller_1.getUserWalletAddress);
router.route('/get-avg-price-order').post([authentication_1.verifyUser], user_wallet_controller_1.getAvgPriceOrder);
router.route('/get-all-buy-sell-order').post([authentication_1.verifyUser], user_wallet_controller_1.getAllBuySellOrder); //web
// router.route('/get-all-funds').post([verifyUser], getAllFunds); //apk
router.route('/get-wallet-funds').post([authentication_1.verifyUser], user_wallet_controller_1.getWalletFunds); //web
router.route('/get-symbol-funds').post([authentication_1.verifyUser], user_wallet_controller_1.getSymbolFunds);
router.route('/get-trades').post([authentication_1.verifyUser], user_wallet_controller_1.getTrades); //web
router.route('/get-trade-history').post([authentication_1.verifyUser], user_wallet_controller_1.getTradeHistory);
router.route('/get-buy-sell-fees').post([authentication_1.verifyUser], user_wallet_controller_1.getBuySellFees);
// Temporary Executed Amount Callback
// router.post('/executed-buy-sell-order', executedBuySellOrder);
// router.route('/get-wallet-history').post([verifyUser], getwalletHistory);
// Throttle middleware function
function throttleMiddleware(req, res, next) {
    // Extract the user ID from the request
    const userId = req.body.user.id;
    // Check if the user's last API call timestamp is available
    const lastCallTime = userLastCall[userId];
    // If the user has made a recent API call, throttle the request
    if (lastCallTime && Date.now() - lastCallTime < 1000) {
        console.log('too many requests');
        return res.status(429).json({ status: '0', message: 'Too Many Requests' });
    }
    // Update the user's last API call timestamp
    userLastCall[userId] = Date.now();
    // Call the next middleware or route handler
    next();
}
exports.throttleMiddleware = throttleMiddleware;
//# sourceMappingURL=user.wallet.routes.js.map