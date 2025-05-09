require("dotenv").config();
const Joi = require("joi");
// const db = require("../model/db_query");
const uuid = require("uuid");
const GenerateID = require("../../utility/generator");
const config = require('../config/config')
const configValidate = require('../../utility/validation');

module.exports.quick_buy = async (req, res) => {
  // Process - 1) Check user Fiat balance 2) Lock user fiat balance 3)Insert order into open orders
 
};

module.exports.buy_asset_pro = async (req, res) => {
  // Process - 1) Check user Fiat balance 2) Lock user fiat balance 3)Insert order into open orders
  try {
    const {
      user_id, 
      pair_id,  
      quote_volume,
      base_price_rate,
      order_type,
      stop_limit_price,
      ip,
      coordinate
    } = req.body;

    const validateQuoteVolume = Joi.object({
      quote_volume : Joi.number().min(0.0000000001).required(),
    }).validate({quote_volume:quote_volume});

    if (validateQuoteVolume.error) {
    return  res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status : false,
        msg: 'Quote volume must be greater then or equal to 0.0000000001'
      });
    }

    // "market_order",  // stop_limit_order  // limit_order
    if (
      order_type != "market_order" &&
      order_type != "limit_order" &&
      order_type != "stop_limit_order"
    ) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.invalid_ordertype,
        status: false,
      });
    }

    const user_active = await db.Get_Where_Universal_Data('status','tbl_user_registration_master' , {cuser_id_btx:user_id})
    
    if (!user_active || user_active.length==0 || user_active == undefined){
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.user_not_found,
        status: false
      });
    }
    if(user_active.length || user_active){
      const status = user_active[0].status
      if(status == null){
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
      const checkStatus =configValidate.checkStatus(status)

      if(checkStatus != 1){
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: false,
          msg:checkStatus
        });
      }
    }

    var pair_type;
    var base_asset_id;
    var quote_asset_id;
    var pair_symbol;
    var base_volume;
    var at_price;
 
    const pair_data = await db.Get_Where_Universal_Data(
      "base_asset_id_btx,quote_asset_id_btx,pair_symbol_btx",
      "tbl_registered_asset_pair_master",
      { pair_id_btx: pair_id }
    );

    if (pair_data.length) {
   
      base_asset_id = pair_data[0].base_asset_id_btx;
      quote_asset_id = pair_data[0].quote_asset_id_btx;
      pair_symbol = pair_data[0].pair_symbol_btx;
      pair_type = "crypto_pair";
    }
    if (!pair_data || pair_data.length==0) {
      const pair_data2 = await db.Get_Where_Universal_Data(
        "base_asset_id,quote_asset_id,pair_symbol_btx",
        "tbl_resigtered_asset_fiat_pair_master",
        { pair_id: pair_id }
      );
      if (pair_data2.length) {
        base_asset_id = pair_data2[0].base_asset_id;
        quote_asset_id = pair_data2[0].quote_asset_id;
        pair_symbol = pair_data2[0].pair_symbol_btx;
        pair_type = "fiat_pair";
        console.log(quote_asset_id);
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.pair_not_registered,
          status: false
        });
      }
    }

    const pair_rate_data = await db.Get_Where_Universal_Data(
      "current_price",
      "tbl_all_assets_portfolio_data",
      { pair_id: pair_id }
    );

    if (!pair_rate_data || pair_rate_data.length==0){
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.curret_rate_not_fetched,
        status: false
      });
    }

    const pair_rate = pair_rate_data[0].current_price;


    if (pair_type == "crypto_pair") {
      const user_asset_balance_data = await db.Get_Where_Universal_Data(
        "current_balance_btx",
        "tbl_user_crypto_assets_balance_details",
        { cuser_id_btx: user_id, asset_id_btx: quote_asset_id }
      );

      if (!user_asset_balance_data || user_asset_balance_data.length==0){
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.user_not_found,
          status: false
        });
      }
      const user_balance = user_asset_balance_data[0].current_balance_btx;

      if (Number(user_balance) < Number(quote_volume)) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: false,
          msg: "Sorry, your quote balance is insufficient.",
        });
      }
    }

    if (order_type == "market_order") {
      at_price = pair_rate;
      base_volume = quote_volume / pair_rate;
    }
    if (order_type == "limit_order" || order_type == "stop_limit_order") {
      at_price = base_price_rate;
      base_volume = quote_volume / base_price_rate;
    }

    // Generating Unique Order_id for each order..
    const order_id = GenerateID.GenerateID(20, uuid.v1(), "PO").toUpperCase();

    // DataBase call to Start mysql transaction to get user data and update balance of User.
    const DataUpdated = await db.Create_Update_Buy_data_PRO(
      user_id,
      order_id,
      pair_id,
      pair_symbol,
      base_asset_id,
      quote_asset_id,
      "BUY",
      order_type,
      quote_volume,
      base_volume.toFixed(4),
      at_price,
      stop_limit_price,
      Date.now(),
      pair_type
    );

    if (DataUpdated == "No Data") {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.database_error,
        status: false
      });
    } else if (DataUpdated.affectedRows != 0) {
      const Data = {
        user_id: user_id,
        order_id: order_id,
        asset_name: base_asset_id,
        base_value: base_volume.toFixed(4),
        quote_value: quote_volume,
        buying_rate: at_price,
      };

      // After Orer Successfully Placing Sending Proper Response
      return res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
        status_code: config.HTTP_SUCCESSFULLY_CREATED,
        status: true,
        Data: [Data],
        msg: "Buy order placed successfully!"
      });
    }
  } catch (err) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: err.message,
    });
  }
};

module.exports.quick_sell = async (req, res) => {
  // Process - 1) Check user Fiat balance 2) Lock user fiat balance 3)Insert order into open orders
  try {
    const { user_id, pair_id, base_volume, ip, coordinate } = req.body;

    const pair_data = await db.Get_Where_Universal_Data(
      "base_asset_id,quote_asset_id,pair_symbol_btx,status",
      "tbl_resigtered_asset_fiat_pair_master",
      { pair_id: pair_id }
    );
    if (!pair_data || pair_data.length==0) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.pair_not_registered,
        status: false
      });
    }
    const status = pair_data[0].status;
    if (status != 1) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.inactive_asset,
        status: false
      });
    }
 
    const base_asset_id = pair_data[0].base_asset_id;
    const quote_asset_id = pair_data[0].quote_asset_id;
    const pair_symbol = pair_data[0].pair_symbol_btx;

    const user_balance_data = await db.Get_Where_Universal_Data(
      "current_balance_btx",
      "tbl_user_crypto_assets_balance_details",
      { cuser_id_btx: user_id, asset_id_btx: base_asset_id }
    );

    if (!user_balance_data || user_balance_data.length==0) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.user_fiat_balance_row_missing,
        status: false
      });
    }

    const user_balance = user_balance_data[0].current_balance_btx;
   
    if (Number(base_volume) > Number(user_balance)){
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Insufficient user asset balance!",
      });
    }

    const pair_rate_data = await db.Get_Where_Universal_Data(
      "current_price",
      "tbl_all_assets_portfolio_data",
      { pair_id: pair_id }
    );
      
    if (!pair_rate_data || pair_rate_data.length == 0) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.curret_rate_not_fetched,
        status: false
      });
    }

    const pair_rate = pair_rate_data[0].current_price;

    const quote_volume = base_volume * pair_rate;

    // Generating Unique Order_id for each order..
    const order_id = GenerateID.GenerateID(20, uuid.v1(), "SO").toUpperCase();

    // DataBase call to Start mysql transaction to get user data and update balance of User.
    const DataUpdated = await db.Create_Update_quick_Sell_order_data(
      pair_id,
      pair_symbol,
      base_volume,
      quote_volume,
      user_id,
      quote_asset_id,
      order_id,
      base_asset_id,
      "SELL",
      "market_order",
      pair_rate,
      Date.now()
    );
    if (DataUpdated == "err") {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.database_error,
        status: false
      });
    } else if (DataUpdated.affectedRows != 0) {

      const Data = {
        order_id: order_id,
        pair_id: pair_id,
        pair_rate: pair_rate,
        base_Value: base_volume,
        quote_value: quote_volume,
      };

      const access_log_data = {
        cuser_id_btx: user_id,
        module_name_btx: "Trade",
        action_btx: "Trade Sell",
        ip_address_btx: ip,
        co_ordinates: coordinate,
        datetime: Date.now(),
        c_by: user_id,
      };
      await db.Create_Universal_Data("tbl_acess_log", access_log_data);

      // After Orer Successfully Placing Sending Proper Response
      return res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
        status_code: config.HTTP_SUCCESSFULLY_CREATED,
        status: true,
        Data: [Data],
        msg: "Quick sell order placed successfully..!!",
      });
    }
  } catch (err) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: err.message,
    });
  }
};

module.exports.sell_asset_pro = async (req, res) => {
  // Process - 1) Check user Fiat balance 2) Lock user fiat balance 3)Insert order into open orders
  try {
    const {
      user_id,
      pair_id,
      base_volume,
      quote_price_rate,
      order_type,
      stop_limit_price,
      ip,
      coordinate
    } = req.body;

    switch (order_type) {
      case "market_order":
      case "limit_order":
      case "stop_limit_order":
        break;
      default:
        // Invalid order type
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.invalid_ordertype,
          status: false,
        });
    }

    var base_asset_id;
    var quote_asset_id;
    var pair_symbol;
    var at_price;
    var quote_volume;

    const pair_data = await db.Get_Where_Universal_Data(
      "base_asset_id_btx,quote_asset_id_btx,pair_symbol_btx",
      "tbl_registered_asset_pair_master",
      { pair_id_btx: pair_id }
    );

    if (pair_data.length) {
      base_asset_id = pair_data[0].base_asset_id_btx;
      quote_asset_id = pair_data[0].quote_asset_id_btx;
      pair_symbol = pair_data[0].pair_symbol_btx;
    }
    if (!pair_data || !pair_data.length) {
      const pair_data2 = await db.Get_Where_Universal_Data(
        "base_asset_id,quote_asset_id,pair_symbol_btx",
        "tbl_resigtered_asset_fiat_pair_master",
        { pair_id: pair_id }
      );

      if (pair_data2.length) {
        base_asset_id = pair_data2[0].base_asset_id;
        quote_asset_id = pair_data2[0].quote_asset_id;
        pair_symbol = pair_data2[0].pair_symbol_btx;
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.pair_not_registered,
          status: false
        });
      }
    }

    const pair_rate_data = await db.Get_Where_Universal_Data(
      "current_price",
      "tbl_all_assets_portfolio_data",
      { pair_id: pair_id }
    );

    if (!pair_rate_data || !pair_rate_data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.curret_rate_not_fetched,
        status: false
      });
    }

    const pair_rate = pair_rate_data[0].current_price;

    if (order_type == "stop_limit_order") {
      if (quote_price_rate < base_market_price) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: false,
          msg: `When the traded price is equal to or greater than STOP PRICE:${stop_limit_price}
        then place a BUY order at LIMIT PRICE:${quote_price_rate}. `,
        });
      }
      if (stop_limit_price > base_market_price) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: false,
          msg: `When the traded price is equal to or greater than STOP PRICE:${stop_limit_price}
        then place a BUY order at LIMIT PRICE:${quote_price_rate}. `,
        });
      }
    }

    const user_asset_balance_data = await db.Get_Where_Universal_Data(
      "current_balance_btx",
      "tbl_user_crypto_assets_balance_details",
      { cuser_id_btx: user_id, asset_id_btx: base_asset_id }
    );

    if(!user_asset_balance_data || !user_asset_balance_data.length){
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.user_crypto_balance_row_missing,
        status: false
      });
    }
    const user_balance = user_asset_balance_data[0].current_balance_btx;

    if (Number(user_balance) < Number(base_volume)) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Insufficient quote balance!",
      });
    }

    if (order_type == "market_order") {
      at_price = pair_rate;
      quote_volume = base_volume * pair_rate;
    }
  
    if (order_type == "limit_order" || order_type == "stop_limit_order") {
      at_price = quote_price_rate;
      quote_volume = base_volume * quote_price_rate;
    }

    // Generating Unique Order_id for each order..
    const order_id = GenerateID.GenerateID(20, uuid.v1(), "PO").toUpperCase();

    // DataBase call to Start mysql transaction to get user data and update balance of User.
    const DataUpdated = await db.Create_Update_Sell_data_PRO(
      user_id,
      order_id,
      pair_id,
      pair_symbol,
      base_asset_id,
      quote_asset_id,
      "SELL",
      order_type,
      quote_volume,
      base_volume,
      at_price,
      stop_limit_price,
      Date.now()
    );

    if (DataUpdated == "No Data") {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.database_error,
        status: false
      });
    } else if (DataUpdated.affectedRows != 0) {
      const Data = {
        "user_id": user_id,
        "order_id": order_id,
        "pair_id": pair_id,
        'base_value': base_volume,
        "quote_value": quote_volume,
        "buying_rate": at_price,
      };

      const access_log_data = {
        cuser_id_btx: user_id,
        module_name_btx: "Trade",
        action_btx: "Trade Sell pro",
        ip_address_btx: ip,
        co_ordinates: coordinate,
        datetime: Date.now(),
        c_by: user_id,
      };
      await db.Create_Universal_Data("tbl_acess_log", access_log_data);

      // After Orer Successfully Placing Sending Proper Response
      return res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
        status_code: config.HTTP_SUCCESSFULLY_CREATED,
        status: true,
        Data: [Data],
        msg: `Your sell order has been placed successfully.`,
      });
    }
  } catch (err) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: err.message,
    });
  }
};

module.exports.cancel_order = async (req, res) => {
  try {
    const { user_id, order_id, ip, coordinate } = req.body;

    // get Order details from Open orders table
    const order_Data = await db.Get_Where_Universal_Data(
      "*",
      "tbl_user_open_order_history",
      { cuser_id_btx: user_id, order_id_btx: order_id, is_deleted: "0" }
    );
    // Check order Cancellation status
    if (!order_Data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.order_already_canceled,
        status: false
      });
    } else {
      const order_type = order_Data[0].order_type_buy_sell;
      const pair_id = order_Data[0].pair_id;
      const pair_symbol = order_Data[0].pair_symbol_btx;
      const asset_id = order_Data.map((a) => a.asset_id_btx);
      const quote_asset_id = order_Data.map((a) => a.quote_asset_id_btx);
      const quote_order_value = order_Data[0].quote_order_value;
      const base_order_value = order_Data[0].base_order_value;
      const order_type_market_limit = order_Data[0].order_type_market_limit;
      const market_rate = order_Data[0].at_price

      if (order_type == "BUY") {
        // 1) Update tbl_open_orders is_deleted:true ,2) update balance of user
        const database_updated = await db.cancel_buy_order(
          market_rate,
          user_id,
          order_id,
          pair_id,
          pair_symbol,
          asset_id,
          quote_asset_id,
          order_type,
          order_type_market_limit,
          base_order_value,
          quote_order_value,
          Date.now()
        );

        // After succesffull database updation for send response message and data
        if (database_updated.affectedRows == 1) {
          return res.status(config.HTTP_SUCCESS).send({
            status: config.HTTP_SUCCESS,
            status:true,
            msg: "Your order has been cancelled",
            data: [
              {
                "order_id": order_id,
                "buy_price":market_rate,
                'pair_symbol': pair_symbol,
                "order_type": order_type,
                'asset_volume': base_order_value,
                'fiat_volume':quote_order_value,
                'order_canceled_at':Date.now()
              },
            ],
          });
        } else if (database_updated == "err") {
          return res.status(config.HTTP_BAD_REQUEST).send({
            status: config.database_error,
            status:false
          });
        }
        // for Sell order processs
      } else if (order_type == "SELL") {
        // 1) Update tbl_open_orders is_deleted:true ,2) update balance of user
        const database_updated = await db.cancel_sell_order(
          market_rate,
          user_id,
          order_id,
          pair_id,
          pair_symbol,
          asset_id,
          quote_asset_id,
          order_type,
          order_type_market_limit,
          base_order_value,
          quote_order_value,
          Date.now()
        );
        // After succesffull database updation for send response message and data
        if (database_updated.affectedRows != 0) {
          //Update Access and activity log in database
          const access_log_data = {
            cuser_id_btx: user_id,
            module_name_btx: "Trade",
            action_btx: "Trade Cancel",
            ip_address_btx: ip,
            co_ordinates: coordinate,
            datetime: Date.now(),
            c_by: user_id,
          };
          await db.Create_Universal_Data("tbl_acess_log", access_log_data);

          return res.status(config.HTTP_SUCCESS).send({
            status: config.HTTP_SUCCESS,
            msg: "Your order has been cancelled",
            data: [
              {
                "order_id": order_id,
                "buy_price":market_rate,
                'pair_symbol': pair_symbol,
                "order_type": order_type,
                'asset_volume': base_order_value,
                'fiat_volume':quote_order_value,
                'order_canceled_at':Date.now()
              },
            ],
          });
        }
      }
    }
  } catch (e) {
    res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      stauts: false,
      msg: e.message,
    });
  }
};

module.exports.modify_order = async (req, res) => {
  try {
    // process - 1)get all data 2)get open-order details 3)if BUY order = Check fiat balance 4)Cancel current BUY order 5) place new BUY order
    //             6) if SELL order = Check crypto balance 7)cancel current sell order 8)Place new SELL order

    const {
      user_id,
      order_id,
      pair_id,
      base_volume,
      quote_price_rate,
      quote_volume,
      base_price_rate,
      order_type,
      stop_limit_price,
      ip,
      coordinate,
    } = req.body;

  
    switch (order_type) {
      case "market_order":
      case "limit_order":
      case "stop_limit_order":
        break;
      default:
        // Invalid order type
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.invalid_ordertype,
          status: false,
        });
    }

    // Get order details from open order history table
    const order_Data = await db.Get_Where_Universal_Data(
      "*",
      "tbl_user_open_order_history",
      { cuser_id_btx: user_id, order_id_btx: order_id, is_deleted: "0" }
    );

    // Check order cancellation status
    if (!order_Data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.order_already_canceled,
        status: false
      });
    } else {
      //if order is not canceled before cancel last order and process for new order.
      const order_type = order_Data[0].order_type_buy_sell;
      const pair_id = order_Data[0].pair_id;
      const pair_symbol = order_Data[0].pair_symbol_btx;
      const asset_id = order_Data.map((a) => a.asset_id_btx);
      const quote_asset_id = order_Data.map((a) => a.quote_asset_id_btx);
      const quote_order_value = order_Data[0].quote_order_value;
      const base_order_value = order_Data[0].base_order_value;
      const order_type_market_limit = order_Data[0].order_type_market_limit;
      const market_rate = order_Data[0].at_price
      var user_balance;
      // Check if the order is buy

      if (order_type == "BUY") {
        const user_fiat_balance = await db.Get_Where_Universal_Data(
          "current_balance_btx",
          "tbl_user_fiat_wallet_master",
          { cuser_id_btx: user_id, fiat_asset_id_btx: quote_asset_id }
        );
        if (user_fiat_balance.length == 0) {
          const user_asset_balance = await db.Get_Where_Universal_Data(
            "current_balance_btx",
            "tbl_user_crypto_assets_balance_details",
            { cuser_id_btx: user_id, asset_id_btx: quote_asset_id }
          );
          const user_asset_bal = user_asset_balance[0].current_balance_btx;
          user_balance = user_asset_bal;
        } else {
          const User_fiat_balance = user_fiat_balance.map(
            (a) => a.current_balance_btx
          );
          user_balance = User_fiat_balance;
        }

        if (JSON.parse(user_balance) >= quote_volume) {
          // 1) Update tbl_open_orders is_deleted:true ,2) update balance of user
          const DataUpdated = await db.cancel_buy_order(
            market_rate,
            user_id,
            order_id,
            pair_id,
            pair_symbol,
            asset_id,
            quote_asset_id,
            order_type,
            order_type_market_limit,
            base_order_value,
            quote_order_value,
            Date.now()
          );
          // Placing New order
          if (DataUpdated.affectedRows != 0) {
            //Update Access and activity log in database
            const access_log_data = {
              cuser_id_btx: user_id,
              module_name_btx: "Trade",
              action_btx: "Trade Buy pro modify",
              ip_address_btx: ip,
              co_ordinates: coordinate,
              datetime: Date.now(),
              c_by: user_id,
            };
            await db.Create_Universal_Data("tbl_acess_log", access_log_data);

            this.buy_asset_pro(req, res);
          }
        } else {
          return res.status(config.HTTP_SUCCESS).send({
            status_code: config.HTTP_SUCCESS,
            status: false,
            msg: "Insufficient fiat balance!",
          });
        }
        // Check if the order is sell
      } else if (order_type == "SELL") {
        // Get Balance data of user
        const user_asset_bal = await db.Get_Where_Universal_Data(
          "current_balance_btx",
          "tbl_user_crypto_assets_balance_details",
          { cuser_id_btx: user_id, asset_id_btx: asset_id }
        );
        const User_asset_bal = user_asset_bal.map((a) => a.current_balance_btx);

        // Check if user have sufficient fund for transaction.
        if (JSON.parse(User_asset_bal) >= base_volume) {
          // 1) Update tbl_open_orders is_deleted:true ,2) update balance of user
          const DataUpdated = await db.cancel_sell_order(
            market_rate,
            user_id,
            order_id,
            pair_id,
            pair_symbol,
            asset_id,
            quote_asset_id,
            order_type,
            order_type_market_limit,
            base_order_value,
            quote_order_value,
            Date.now()
          );
         
          if (DataUpdated == "err") {
            return res.status(config.HTTP_BAD_REQUEST).send({
              status_code: config.database_error,
              status: false
            });
          } else if (DataUpdated.affectedRows != 0) {
            //Update Access and activity log in database
            const access_log_data = {
              cuser_id_btx: user_id,
              module_name_btx: "Trade",
              action_btx: "Trade Sell pro Modify",
              ip_address_btx: ip,
              co_ordinates: coordinate,
              datetime: Date.now(),
              c_by: user_id,
            };
            await db.Create_Universal_Data("tbl_acess_log", access_log_data);

            this.sell_asset_pro(req, res);
          } else {
            return res.status(config.HTTP_BAD_REQUEST).send({
              status_code: config.internal_code_error,
              status: false
            });
          }
        } else {
          return res.status(config.HTTP_SUCCESS).send({
            status_code: config.HTTP_SUCCESS,
            status: false,
            msg: "Order cannot proceed, insufficient balance.",
          });
        }
      }
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.swap_asset = async (req, res) => {
  try {
    // Data required from api.
    const { user_id, pair_id, quote_asset_volume, ip, coordinate } = req.body;


    const asset_availability = await db.Get_Where_Universal_Data(
      "pair_symbol_btx , base_asset_id_btx, quote_asset_id_btx",
      "tbl_registered_asset_pair_master",
      { pair_id_btx: pair_id }
    );

    const pair_rate_data = await db.Get_Where_Universal_Data(
      "current_price",
      "tbl_all_assets_portfolio_data",
      { pair_id: pair_id }
    );

    if (!pair_rate_data || !pair_rate_data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.curret_rate_not_fetched,
        status: false
      });
    }
    const pair_symbol = asset_availability[0].pair_symbol_btx;
    const base_asset_id = asset_availability[0].base_asset_id_btx;
    const quote_asset_id = asset_availability[0].quote_asset_id_btx;

    const pair_rate = pair_rate_data[0].current_price;

    if (asset_availability.length) {
      const base_asset_volume = quote_asset_volume / pair_rate;

      const swap_fee_amount = await db.Get_Where_Universal_Data(
        "fee_amount",
        "tbl_fixed_fee_details",
        { pair_id: pair_id }
      );
      const Swap_fee_amount = swap_fee_amount[0].fee_amount;

      const effective_base_value =
        Number(base_asset_volume) -
        (Number(Swap_fee_amount) * Number(base_asset_volume)) / 100;

      const swap_fee = (Swap_fee_amount * base_asset_volume) / 100;

      const user_quote_asset = await db.Get_Where_Universal_Data(
        "current_balance_btx",
        "tbl_user_crypto_assets_balance_details",
        { asset_id_btx: quote_asset_id, cuser_id_btx: user_id }
      );

      if (!user_quote_asset.length) {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.user_crypto_balance_row_missing,
          status: false
        });
      }
      const user_quote_bal = user_quote_asset.map((a) => a.current_balance_btx);

      // Check User quote asset balance
      if (JSON.parse(user_quote_bal[0]) >= Number(quote_asset_volume)) {
        const swap_order_id = GenerateID.GenerateID(
          15,
          uuid.v1(),
          "SW"
        ).toUpperCase();

        // (BTC-ETH)
        // Update user & admin crypto data 1) Debit base asset from user_tbl 2)Credit base asset to admin tbl  3)debit admin quote asset - swap fee
        //    4) credit user quote asset  - swap fee   5) add swap fee details in swap_fee table 6)add swap trxn in tbl_swap_trxn_details
        const DataUpdated = await db.Update_swap_data(
          user_id,
          swap_order_id,
          pair_id,
          pair_symbol,
          base_asset_id,
          quote_asset_id,
          "BUY",
          "Market rate",
          quote_asset_volume,
          base_asset_volume,
          pair_rate,
          Date.now()
        );

        if (DataUpdated.affectedRows != 0) {
          //Update Access and activity log in database
          const access_log_data = {
            cuser_id_btx: user_id,
            module_name_btx: "Trade",
            action_btx: "Swap order",
            ip_address_btx: ip,
            co_ordinates: coordinate,
            datetime: Date.now(),
            c_by: user_id,
          };
          await db.Create_Universal_Data("tbl_acess_log", access_log_data);

          return res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
            status_code: config.HTTP_SUCCESSFULLY_CREATED,
            status: true,
            Data: [
              {
                swap_order_id: swap_order_id,
                pair_rate: pair_rate,
                paid_base_asset: base_asset_volume,
                received_asset: effective_base_value,
                fee_paid: swap_fee,
              },
            ],
            msg: "Swap order placed successfully.",
          });
        }
      } else {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: false,
          msg: "Order cannot proceed, insufficient balance",
        });
      }
    } else {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.pair_not_registered,
        status: false
      });
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.dummy_executed_order = async (req, res) => {
  try {
    const {
      user_id,
      order_id,
      pair_id,
      base_asset_id,
      quote_asset_id,
      order_type_buy_sell,
      order_type_ml,
      base_order_value,
      quote_order_value,
      at_rate_price,
    } = req.body;

    const dataUpdated = await db.Create_Universal_Data(
      " tbl_user_executed_order_history",
      {
        cuser_id_btx: user_id,
        order_id: order_id,
        pair_id: pair_id,
        base_asset_id_btx: base_asset_id,
        quote_asset_id_btx: quote_asset_id,
        order_type_buy_sell: order_type_buy_sell,
        order_type_market_limit: order_type_ml,
        base_order_value: base_order_value,
        quote_order_value: quote_order_value,
        at_rate: at_rate_price,
        order_executed_at: Date.now(),
      }
    );
    if (dataUpdated) {
      return res.send(dataUpdated);
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.ask_order_data = async (req, res) => {
  try {
    const { asset_id } = req.body;

  
    const data = await db.ASK_data(asset_id);
    if (data.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: true,
        msg: `Best sell orders list , ASK ORDERS DATA `,
        Data: [data],
      });
    } else if (!data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.pair_not_registered,
        status: false
      });
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.bid_order_data = async (req, res) => {
  try {
    const { asset_id } = req.body;
 
    const data = await db.BID_data(asset_id);
    if (data.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: true,
        msg: `Best sell orders list , ASK ORDERS DATA `,
        Data: [data],
      });
    } else if (!data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.pair_not_registered,
        status: false
      });
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.get_executed_orders = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const { User_id, asset_id } = req.body;

    if (!user_id) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.required_fields,
        status: false,
      });
    }

    if (!User_id && !asset_id) {
      const data = await db.Get_All_Executed_orders();

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.!! `,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (asset_id && User_id) {
      const data = await db.Get_user_asset_Executed_orders(User_id, asset_id);

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user!`,
          Data: [data]
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (User_id) {
      const data = await db.Get_user_Executed_orders(User_id);
      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of fetched.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (asset_id) {
      const data = await db.Get_asset_Executed_orders(asset_id);

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.get_open_orders = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const { User_id, asset_id } = req.body;

    if (!user_id) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.required_fields,
        status: false
      });
    }
    if (!User_id && !asset_id) {
      const data = await db.Get_all_Open_orders_data();

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (asset_id && User_id) {
      const data = await db.Get_user_asset_Open_orders_data(User_id, asset_id);

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if(User_id){
      const data = await db.Get_user_Open_orders_data(User_id);
      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (asset_id) {
      const data = await db.Get_asset_Open_orders_data(asset_id);

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.get_cancel_orders = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const { User_id, asset_id } = req.body;

  

    if (!User_id && !asset_id){
      const data = await db.Get_All_Cancel_orders_data();

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (asset_id && User_id) {
      const data = await db.Get_user_asset_Cancel_orders_data(
        User_id,
        asset_id
      );

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (User_id) {
      const data = await db.Get_User_Cancel_orders_data(User_id);
      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }

    if (asset_id) {
      const data = await db.Get_asset_Cancel_orders_data(asset_id);

      if (data.length) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: true,
          msg: `Open orders of all user.`,
          Data: [data],
        });
      } else {
        return res.status(config.HTTP_BAD_REQUEST).send({
          status_code: config.database_error,
          status: false
        });
      }
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.current_market_price = async (req, res) => {
  try {

    const { pair_id } = req.params.pair_id;

    const pair_rate_data = await db.Get_Where_Universal_Data(
      "current_price",
      "tbl_all_assets_portfolio_data",
      { pair_id: pair_id }
    );

    if (!pair_rate_data || !pair_rate_data.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.curret_rate_not_fetched,
        status: false
      });
    }

    const current_rate = pair_rate_data[0].current_price;

    if (pair_rate_data.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: true,
        data: [
          {
            aasset_id: pair_id,
            Current_market_rate: current_rate,
          },
        ],
        msg: `rate fetched.`,
      });
    } else {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.database_error,
        status: false
      });
    }
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};

module.exports.get_all_asset_data = async (req, res) => {
  try {
    const data = await db.Get_All_Universal_Data(
      "*",
      "tbl_all_assets_portfolio_data"
    );

    return res.status(config.HTTP_SUCCESS).send({
      status_code: config.HTTP_SUCCESS,
      status: true,
      msg: `Open orders of all user.`,
      Data: [data],
    });
  } catch (e) {
    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      msg: e.message,
    });
  }
};
