import express from 'express';
const router = express.Router();
import { get_open_orders,coinTradingPairs, placeBuyOrder, placeSellOrder,placeSellStopLimit, placeBuyStopLimit, cancelOrder} from '../controller/controller';
import {verifyUser} from '../middleware/token_authentication';
import { validate_buy_asset_pro , validate_sell_asset_pro,validate_buy_stop_limit,validate_sell_stop_limit, validate_cancel_order} from '../middleware/req_validator';
import { OpenOrderCount } from '../middleware/OpenOrderCount';
// import { DevOpsGuru, DocDB } from 'aws-sdk';




router.post('/place-buy-order', 
  verifyUser,
  validate_buy_asset_pro, 
  OpenOrderCount,
  placeBuyOrder
);

router.post('/place-sell-order', 
    verifyUser,
    validate_sell_asset_pro, 
    OpenOrderCount,
    placeSellOrder
  );

router.post('/place-buy-stop-limit',verifyUser,validate_buy_stop_limit,OpenOrderCount,placeBuyStopLimit)

router.post('/place-sell-stop-limit',verifyUser,validate_sell_stop_limit,OpenOrderCount,placeSellStopLimit)

router.post('/cancel-order',verifyUser,validate_cancel_order,cancelOrder)  

router.get('/get-open-orders', verifyUser,get_open_orders)

router.get('/get-coin-trading-pairs',verifyUser,coinTradingPairs)

// router.post('/quick_sell', 
//   // middleware.Authentication, 
//   // validator.validate_quick_sr4fgell, 
//   userController.quick_sell
// );

// router.post('/sell_asset_pro', 
//   // middleware.Authentication, 
//   // validator.validate_sell_asset_pro, 
//   userController.sell_asset_pro
// );

// router.post('/cancel_order', 
//   // middleware.Authentication, 
//   // validator.validate_cancel_order, 
//   userController.cancel_order
// );

// router.post('/modify_order/:user_id', 
//   // middleware.Authentication, 
//   // validator.validate_modify_order, 
//   userController.modify_order
// );

// // Swap api
// router.post('/swap_asset', 
//   // middleware.Authentication, 
//   // validator.validate_swap_order, 
//   userController.swap_asset
// );

// // Get Data API's
// router.post('/dummy_executed_order', userController.dummy_executed_order);

// router.post('/ask_data', 
//   // middleware.Authentication, 
//   // validator.validate_ask_data, 
//   userController.ask_order_data
// );

// router.post('/bid_data', 
//   // middleware.Authentication, 
//   // validator.validate_ask_data, 
//   userController.bid_order_data
// );

// // router.post('/get_user_executed_orders/:user_id', 
// //   // middleware.Authentication, 
// //   // validator.validate_get_executed_orders, 
// //   userController.get_executed_orders
// // ); 

// router.post('/get_executed_orders/:user_id', 
//   // middleware.AdminAuthentication, 
//   // validator.validate_get_executed_orders, 
//   userController.get_executed_orders
// ); 

// // router.post('/get_user_open_orders/:user_id', userController.get_open_orders); 

// router.post('/get_open_orders/:user_id', 
//   // middleware.AdminAuthentication, 
//   // validator.validate_get_executed_orders, 
//   userController.get_open_orders
// ); 

// // router.post('/get_user_cancel_orders/:user_id', userController.get_cancel_orders); 

// router.post('/get_cancel_orders/:user_id', 
//   // middleware.AdminAuthentication, 
//   // validator.validate_get_executed_orders, 
//   userController.get_cancel_orders
// ); 

// // Get Market rate api's
// router.post('/asset_market_rate/:user_id/:pair_id', 
//   // middleware.Authentication, 
//   // validator.validate_pair_id, 
//   userController.current_market_price
// );

// router.post('/get_all_asset_data', 
//   // middleware.Authentication, 
//   userController.get_all_asset_data
// ); 

export default router;