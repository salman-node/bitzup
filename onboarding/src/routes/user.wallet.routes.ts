import express from 'express';
const router = express.Router();
import { verifyUser } from '../middleware/authentication';
import {
  // getBuySellBalance,
  // getAllCurrenciesBalance,
  // addBuySellOrder,
  // getBuySellOrder,
  // getAvgPriceOrder,
  // getBuySellFees,
  // cancelBuySellOrder,
  getAllBuySellOrder,
  // getAllFunds,
  // cancelAllBuySellOrder,
  // getWalletFunds,
  getSymbolFunds,
  // getTrades,
  // getTradeHistory,
  // executedBuySellOrder,
  // getwalletHistory
} from '../controller/user.wallet.controller';

// Object to store the last timestamp of each user's API call
const userLastCall: { [key: string]: number } = {};

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

// router.route('/get-buy-sell-balance').post([verifyUser], getBuySellBalance);
// router
//   .route('/get-all-currencies-balance')
//   .post([verifyUser], getAllCurrenciesBalance);
// router.route('/get-avg-price-order').post([verifyUser], getAvgPriceOrder);
router.route('/get-all-buy-sell-order').post([verifyUser], getAllBuySellOrder); //web
// router.route('/get-wallet-funds').post([verifyUser], getWalletFunds); //web
router.route('/get-symbol-funds').post([verifyUser], getSymbolFunds);
// router.route('/get-trades').post([verifyUser], getTrades); //web
// router.route('/get-trade-history').post([verifyUser], getTradeHistory);
// router.route('/get-buy-sell-fees').post([verifyUser], getBuySellFees);
// router
//   .route('/cancel-all-buy-sell-order')
// router.route('/get-wallet-history').post([verifyUser], getwalletHistory);

// Throttle middleware function
export function throttleMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
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

export { router as userWalletRouter };
