const express = require('express');
const router = express.Router();
const userController = require('../controller/controller')
// const middleware = require('../middleware/token_authentication');
// const validator = require('../middleware/req_validator')
// const { DevOpsGuru, DocDB } = require('aws-sdk');

// Trade api's
router.post('/quick_buy',userController.quick_buy) 
router.post('/buy_asset_pro',middleware.Authentication,validator.validate_buy_asset_pro,userController.buy_asset_pro) 
router.post('/quick_sell',middleware.Authentication,validator.validate_quick_sell,userController.quick_sell)
router.post('/sell_asset_pro',middleware.Authentication,validator.validate_sell_asset_pro,userController.sell_asset_pro)
router.post('/cancel_order',middleware.Authentication,validator.validate_cancel_order,userController.cancel_order)
router.post('/modify_order/:user_id',middleware.Authentication,validator.validate_modify_order,userController.modify_order)

// Swap api
router.post('/swap_asset',middleware.Authentication,validator.validate_swap_order,userController.swap_asset)

// Get Data API's
router.post('/dummy_executed_order',userController.dummy_executed_order)
router.post('/ask_data',middleware.Authentication,validator.validate_ask_data,userController.ask_order_data)
router.post('/bid_data',middleware.Authentication,validator.validate_ask_data,userController.bid_order_data)

// router.post('/get_user_executed_orders/:user_id',middleware.Authentication,validator.validate_get_executed_orders,userController.get_executed_orders)  // need to handle column names
router.post('/get_executed_orders/:user_id',middleware.AdminAuthentication,validator.validate_get_executed_orders,userController.get_executed_orders) // need to handle column names

// router.post('/get_user_open_orders/:user_id',userController.get_open_orders)                                    // need to handle column names
router.post('/get_open_orders/:user_id',middleware.AdminAuthentication,validator.validate_get_executed_orders,userController.get_open_orders) // need to handle column names

// router.post('/get_user_cancel_orders/:user_id',userController.get_cancel_orders)     // need to handle column names
router.post('/get_cancel_orders/:user_id',middleware.AdminAuthentication,validator.validate_get_executed_orders,userController.get_cancel_orders)  // need to handle column names

// Get Market rate api's
router.post('/asset_market_rate/:user_id/:pair_id',middleware.Authentication,validator.validate_pair_id,userController.current_market_price)
router.post('/get_all_asset_data',middleware.Authentication,userController.get_all_asset_data)    // need to handle column names

module.exports = router      