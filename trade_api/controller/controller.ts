require("dotenv").config();
// import { Request, Response } from "express";
import * as Joi from "joi";
import { prisma } from "../config/prisma_client";// import { v4 as uuid } from "uuid";
// import GenerateID from "../utility/generator";
import { config } from "../config/config";
import { getOrderType, getSide } from "../utility/constants";
import { GenerateUniqueID } from "../utility/generator";
// import configValidate from '../utility/validation'
import {
  Spot,
  Side,
  OrderType,
  TimeInForce,
  NewOrderRespType,
} from "@binance/connector-typescript";
import { randomUUID } from "crypto";
const apiKey =
  "QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om";
const apiSecret =
  "u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW";
const client = new Spot(apiKey, apiSecret, {
  baseURL: "https://testnet.binance.vision",
  timeout: 1000,
});

export const placeBuyOrder = async (req: any, res: any) => {
  try {
    const reqBody = req.body;
    const {
      user_id,
      pair_id,
      quote_volume,
      limit_price,
      order_type,
      stop_limit_price,
    } = reqBody;
  
    const orderType = order_type.toUpperCase();

    const getPairData = await prisma.crypto_pair.findMany({
      where: {
        pair_id: pair_id,
      },
      select: {
        base_asset_id: true,
        quote_asset_id: true,
        pair_id: true,
        pair_symbol: true,
        current_price: true,
        min_quote_qty: true,
        min_base_qty: true,
        max_base_qty: true,
        max_quote_qty: true,
        trade_fee: true,
        quantity_decimal: true,
        price_decimal: true,
        status: true,
      },
    });

    if (!getPairData.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.HTTP_BAD_REQUEST,
        status: "3",
        message: "Invalid pair id",
      });
    }

    const side = "BUY";
    // console.log('getpairdata',getPairData)
    console.log(2);
    const pairDecimal = getPairData[0].quantity_decimal;
    const pairSymbol = getPairData[0].pair_symbol;

    const minQuoteVolume = getPairData[0].min_quote_qty;
    const maxQuoteVolume = getPairData[0].max_quote_qty;

    const quote_asset_id = getPairData[0].quote_asset_id;

    //get user balance from balances table
    const userAssetBalance = await prisma.balances.findMany({
      where: {
        user_id: user_id,
        currency_id: quote_asset_id,
      },
      select: {
        current_balance: true,
      }
    });
    
    if (!userAssetBalance.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "User balance not found",
      });
    }

    const userBalance = userAssetBalance[0].current_balance;
    if (Number(userBalance) < Number(quote_volume)) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Sorry, your quote balance is insufficient.",
      });
    }

    const validateQuoteVolume = Joi.object({
      quote_volume: Joi.number()
      
        .precision(pairDecimal)
        .min(minQuoteVolume)
        .max(maxQuoteVolume)
        .required(),
    }).validate({ quote_volume: quote_volume });

    if (validateQuoteVolume.error) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: `Amount must be greater then or equal to ${minQuoteVolume} and less then or equal to ${maxQuoteVolume}`,
      });
    }

    const OrderId = GenerateUniqueID(10, randomUUID(), `${user_id}-`);

    //calculate base_volume for limit order
    var baseVolume: number=0;
    if (orderType == "LIMIT") {
      baseVolume = Number((quote_volume / limit_price).toFixed(pairDecimal));
    }

    const time = await client.checkServerTime();
    console.log("time", time.serverTime);

    // client.setTimestampOffset()

    await prisma.buy_sell_pro_limit_open.create({
      data: {
        user_id: user_id,
        pair_id: pair_id,
        type: side,
        base_quantity: baseVolume,
        quote_quantity: quote_volume,
        order_price: limit_price,
        executed_base_quantity: 0,
        executed_quote_quantity: 0,
        stop_limit_price: stop_limit_price,
        oco_stop_limit_price: null,
        order_id: OrderId,
        order_type: orderType,
        device: null,
      },
    });
    let options;
    if (orderType == "LIMIT") {
      options = {
        price: limit_price,
        quantity: baseVolume,
        timeInForce: TimeInForce.GTC,
        newClientOrderId: OrderId,
        newOrderRespType: NewOrderRespType.FULL,
        recvWindow: 5000,
      };
    }
    if (orderType == "MARKET") {
      options = {
        quoteOrderQty: quote_volume,
        newClientOrderId: OrderId,
        recvWindow: 5000,
        // newOrderRespType: NewOrderRespType.FULL,
      };
    }
    //Place new order to Binance.
    let orderData;
    try{
     orderData = await client.newOrder(
      pairSymbol,
      getSide(side),
      getOrderType(orderType),
      options
    );
    console.log("orderData", orderData);
  } catch (binanceError) {
    console.error("Binance Order Placement Error:", binanceError.message || binanceError);

    // Update the database to mark the order as failed
    await prisma.buy_sell_pro_limit_open.update({
      data: {
        status: "FAILED",
        response: binanceError.message || binanceError ,
      },
      where: {
        order_id: OrderId,
      },
    });

    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      message: "Order failed to place.",
    });
  }
    const status = orderData.status;
    const OrderResponse = orderData;

    await prisma.$transaction([
      prisma.buy_sell_pro_limit_open.update({
        data: {
          order_price: orderData.price,
          base_quantity: orderData.origQty,
          quote_quantity: quote_volume,
          api_order_id: orderData.orderId.toString(),
          executed_base_quantity: orderData.executedQty,
          executed_quote_quantity: orderData.cummulativeQuoteQty,
          status: status
        },
        where: {
          order_id: orderData.clientOrderId,
        },
      }),
      prisma.buy_sell_order_response.create({
        data: {
          order_id: orderData.clientOrderId,
          api_order_id: orderData.orderId.toString(),
          response: JSON.stringify(OrderResponse),
        },
      }),
    ]);

 
     const responseData:any = {
      order_id: orderData.clientOrderId, // Order ID
      base_quantity: orderData.origQty, // Order quantity
      quote_quantity: orderData.cummulativeQuoteQty, // Cumulative quote asset transacted quantity
      order_price: orderData.price, // Order price
      type: orderData.side, // Order type
      order_type: orderData.type, // Order type
      executed_base_quantity: orderData.executedQty, // Last executed quantity
      executed_quote_quantity: orderData.cummulativeQuoteQty, // Last quote asset transacted quantity
      status: orderData.status, // Current order status
      created_at: orderData.transactTime, // Order creation time
    }

    return res.status(config.HTTP_SUCCESS).send({
      status_code: config.HTTP_SUCCESS,
      status: "1",
      message: "Order Placed Successfully",
      Data: [responseData],
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

export const placeSellOrder = async (req: any, res: any) => {
  try {
    const reqBody = req.body;
    const {
      user_id,
      pair_id,
      base_volume,
      limit_price,
      order_type,
      stop_limit_price,
    } = reqBody;



    const orderType = order_type.toUpperCase();

    const getPairData = await prisma.crypto_pair.findMany({
      where: {
        pair_id: pair_id,
      },
      select: {
        base_asset_id: true,
        quote_asset_id: true,
        pair_id: true,
        pair_symbol: true,
        current_price: true,
        min_quote_qty: true,
        min_base_qty: true,
        max_base_qty: true,
        max_quote_qty: true,
        trade_fee: true,
        quantity_decimal: true,
        price_decimal: true,
        status: true,
      },
    });

    const side = "SELL";

    if (!getPairData.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.HTTP_BAD_REQUEST,
        status: "3",
        message: "Invalid pair id",
      });
    }
    // console.log('getpairdata',getPairData)

    const pairDecimal = getPairData[0].quantity_decimal;
    const pairSymbol = getPairData[0].pair_symbol;

    const minBaseVolume = getPairData[0].min_base_qty;
    const maxBaseVolume = getPairData[0].max_base_qty;
    const base_asset_id = getPairData[0].base_asset_id;

    //get user balance from balances table
    const userAssetBalance = await prisma.balances.findMany({
      where: {
        user_id: user_id,
        currency_id: base_asset_id,
      },
      select: {
        current_balance: true,
      },
    });

    if (!userAssetBalance.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "User balance not found",
      });
    }

    const userBalance = userAssetBalance[0].current_balance;
    if (Number(userBalance) < Number(base_volume)) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Sorry, your quote balance is insufficient.",
      });
    }

    const validateBaseeVolume = Joi.object({
      base_volume: Joi.number()
        .precision(pairDecimal)
        .min(minBaseVolume)
        .max(maxBaseVolume)
        .required(),
    }).validate({ base_volume: base_volume });

    if (validateBaseeVolume.error) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: `Base volume must be greater then or equal to ${minBaseVolume} and less then or equal to ${minBaseVolume}`,
      });
    }

    const base_quantity = Number(Number(base_volume).toFixed(pairDecimal));

    const OrderId = GenerateUniqueID(10, randomUUID(), `${user_id}-`);

    await prisma.buy_sell_pro_limit_open.create({
      data: {
        user_id: user_id,
        pair_id: pair_id,
        type: side,
        base_quantity: base_quantity,
        quote_quantity: base_quantity * limit_price,
        order_price: limit_price,
        executed_base_quantity: 0,
        executed_quote_quantity: 0,
        stop_limit_price: stop_limit_price,
        oco_stop_limit_price: null,
        order_id: OrderId,
        order_type: orderType,
        device: null,
      },
    });

    let options;
    if (orderType == "LIMIT") {
      options = {
        price: limit_price,
        quantity: base_quantity,
        timeInForce: TimeInForce.GTC,
        newClientOrderId: OrderId,
      };
    }
    if (orderType == "MARKET") {
      options = {
        quantity: base_quantity,
        newClientOrderId: OrderId,
      };
    }
    //Place new order to Binance.
    let orderData;
    try{
    orderData = await client.newOrder(
      pairSymbol,
      getSide(side),
      getOrderType(orderType),
      options
    );
  } catch (binanceError) {
    console.error("Binance Order Placement Error:", binanceError.message || binanceError);

    // Update the database to mark the order as failed
    await prisma.buy_sell_pro_limit_open.update({
      data: {
        status: "FAILED",
        response: binanceError.message || binanceError ,
      },
      where: {
        order_id: OrderId,
      },
    });

    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      message: "Order failed to place.",
    });
  }

    const status = orderData.status;
    if (orderData.status === undefined) {
      throw new Error("Order status is undefined");
    }
    const OrderResponse = orderData;

    await prisma.$transaction([
      prisma.buy_sell_pro_limit_open.update({
        data: {
          order_price: orderData.price,
          base_quantity: orderData.origQty,
          quote_quantity: (base_quantity * limit_price).toFixed(pairDecimal),
          api_order_id: orderData.orderId.toString(), //
          executed_base_quantity: orderData.executedQty,
          executed_quote_quantity: orderData.cummulativeQuoteQty,
          status: status
        },
        where: {
          order_id: orderData.clientOrderId,
        },
      }),
      prisma.buy_sell_order_response.create({
        data: {
          order_id: orderData.clientOrderId,
          api_order_id: orderData.orderId.toString(),
          response: JSON.stringify(OrderResponse),
        },
      }),
    ]);

    const responseData:any = {
      order_id: orderData.clientOrderId, // Order ID
      base_quantity: orderData.origQty, // Order quantity
      quote_quantity: orderData.cummulativeQuoteQty, // Cumulative quote asset transacted quantity
      order_price: orderData.price, // Order price
      type: orderData.side, // Order type
      order_type: orderData.type, // Order type
      executed_base_quantity: orderData.executedQty, // Last executed quantity
      executed_quote_quantity: orderData.cummulativeQuoteQty, // Last quote asset transacted quantity
      status: orderData.status, // Current order status
      created_at: orderData.transactTime, // Order creation time
    }

    return res.status(config.HTTP_SUCCESS).send({
      status_code: config.HTTP_SUCCESS,
      status: "1",
      message: "Order Placed Successfully",
      Data: [responseData]
    });
  } catch (e) {
    console.log("error", e);
    // await prisma.$transaction.rollback();
    // throw e;
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

export const placeBuyStopLimit = async (req: any, res: any) => {
  try {
    const reqBody = req.body;
    const {
      user_id,
      pair_id,
      quote_volume,
      limit_price,
      stop_price,
    } = reqBody;

   
    const side = "BUY";
    console.log("stop_price",stop_price)
    console.log("limit_price",limit_price)
    // if (Number(stop_price) >= Number(limit_price)) {
    //   return res.status(config.HTTP_SUCCESS).send({
    //     status_code: config.HTTP_SUCCESS,
    //     status: "0",
    //     message: "Stop price must be less then limit price",
    //   })
    // }
    
    const getPairData = await prisma.crypto_pair.findMany({
      where: {
        pair_id: pair_id,
      },
      select: {
        base_asset_id: true,
        quote_asset_id: true,
        pair_id: true,
        pair_symbol: true,
        current_price: true,
        min_quote_qty: true,
        min_base_qty: true,
        max_base_qty: true,
        max_quote_qty: true,
        trade_fee: true,
        quantity_decimal: true,
        price_decimal: true,
        status: true,
      },
    });

    if (!getPairData.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.HTTP_BAD_REQUEST,
        status: "3",
        message: "Invalid pair id",
      });
    }

    const pairDecimal = getPairData[0].quantity_decimal;
    const pairSymbol = getPairData[0].pair_symbol;

    const currentMarketPrice:any = await client.symbolPriceTicker({symbol:pairSymbol});
    console.log('currentMarketPrice',currentMarketPrice)
    let ordertype:any ;
    if(stop_price < currentMarketPrice.price){
       ordertype = "TAKE_PROFIT_LIMIT";
    }else{  
       ordertype = 'STOP_LOSS_LIMIT';
    }

    const minQuoteVolume = getPairData[0].min_quote_qty;
    const maxQuoteVolume = getPairData[0].max_quote_qty;

    const quote_asset_id = getPairData[0].quote_asset_id;

    //get user balance from balances table
    const userAssetBalance = await prisma.balances.findMany({
      where: {
        user_id: user_id,
        currency_id: quote_asset_id,
      },
      select: {
        current_balance: true,
      },
    });

    if (!userAssetBalance.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "User balance not found",
      });
    }

    const userBalance = userAssetBalance[0].current_balance;
    if (Number(userBalance) < Number(quote_volume)) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Sorry, your quote balance is insufficient.",
      });
    }

    const validateQuoteVolume = Joi.object({
      quote_volume: Joi.number()
        .precision(pairDecimal)
        .min(minQuoteVolume)
        .max(maxQuoteVolume)
        .required(),
    }).validate({ quote_volume: quote_volume });

    if (validateQuoteVolume.error) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: `Quote volume must be greater then or equal to ${minQuoteVolume} and less then or equal to ${maxQuoteVolume}`,
      });
    }

    const OrderId = GenerateUniqueID(10, randomUUID(), `${user_id}-`);

    //calculate base_volume for limit order
    
     const baseVolume = Number((quote_volume / limit_price).toFixed(pairDecimal));

    // client.setTimestampOffset()

    await prisma.buy_sell_pro_limit_open.create({
      data: {
        user_id: user_id,
        pair_id: pair_id,
        type: side,
        base_quantity: baseVolume,
        quote_quantity: quote_volume,
        order_price: limit_price,
        executed_base_quantity: 0,
        executed_quote_quantity: 0,
        stop_limit_price: stop_price,
        oco_stop_limit_price: null,
        order_type: ordertype,
        order_id: OrderId,
        device: null,
      },
    });

     const  options = { 
      quantity: baseVolume,
      price: limit_price,
      stopPrice: stop_price,
      newClientOrderId: OrderId,
      timeInForce: TimeInForce.GTC,
      recvWindow: 5000,
      timestamp: Date.now()
    }

    //Place new order to Binance.
    let orderResponse;
    try{
    orderResponse = await client.newOrder(
      pairSymbol,
      getSide(side),
      getOrderType(ordertype),
      options
    );
    console.log("orderResponse", orderResponse);
  } catch (binanceError) {
    console.error("Binance Order Placement Error:", binanceError.message || binanceError);

    // Update the database to mark the order as failed
    await prisma.buy_sell_pro_limit_open.update({
      data: {
        status: "FAILED",
        response: binanceError.message || binanceError ,
      },
      where: {
        order_id: OrderId,
      },
    });

    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      message: "Order failed to place.",
    });
  }
    const orderData = await client.getOrder(orderResponse.symbol, {
      orderId:orderResponse.orderId
    });
    console.log("orderData", orderData)
    
    await prisma.$transaction([
      prisma.buy_sell_pro_limit_open.update({
        data: {
          order_price: orderData.price,
          api_order_id: orderData.orderId.toString(), 
          executed_base_quantity: orderData.executedQty,
          executed_quote_quantity: orderData.cummulativeQuoteQty,
          status: orderData.status,
          order_type: ordertype
        },
        where: {
          order_id: orderData.clientOrderId,
        },
      }),
      prisma.buy_sell_order_response.create({
        data: {
          order_id: orderData.clientOrderId,
          api_order_id: orderData.orderId.toString(),
          response: JSON.stringify(orderData),
        },
      }),
    ]);

     const responseData:any = {
      order_id: orderData.clientOrderId, // Order ID
      base_quantity: orderData.origQty, // Order quantity
      quote_quantity: orderData.cummulativeQuoteQty, // Cumulative quote asset transacted quantity
      order_price: orderData.price, // Order price
      type: orderData.side, // Order type
      order_type: orderData.type, // Order type
      executed_base_quantity: orderData.executedQty, // Last executed quantity
      executed_quote_quantity: orderData.cummulativeQuoteQty, // Last quote asset transacted quantity
      status: orderData.status, // Current order status
      created_at: orderData.time, // Order creation time
    }

    return res.status(config.HTTP_SUCCESS).send({
      status_code: config.HTTP_SUCCESS,
      status: "1",
      message: "Order Placed Successfully",
      Data: [responseData],
    });
  } catch (e) {
    console.log(e);
    if(e === "Stop price would trigger immediately.") {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: "0",
        message: "Stop price must be greater then market price.",
      })
    }
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

// Key Validations for SELL Take Profit Order:
// Stop price > Current market price
// Stop price > Limit price (already handled in your code)

export const placeSellStopLimit = async (req: any, res: any) => {
  try {
    const reqBody = req.body;
    const {
      user_id,
      pair_id,
      base_volume,
      limit_price,
      stop_price,
    } = reqBody;

    
    // const orderType ="TAKE_PROFIT_LIMIT";
    const side = "SELL";
    
    console.log('stop_price',stop_price)
    console.log('limit_price',limit_price)

    // if (Number(stop_price) <= Number(limit_price)) {
    //   return res.status(config.HTTP_SUCCESS).send({
    //     status_code: config.HTTP_SUCCESS,
    //     status: "0",
    //     message: "Stop price must be Greater than limit price",
    //   })
    // }
console.log(1)
    const getPairData = await prisma.crypto_pair.findMany({
      where: {
        pair_id: pair_id,
      },
      select: {
        base_asset_id: true,
        quote_asset_id: true,
        pair_id: true,
        pair_symbol: true,
        current_price: true,
        min_quote_qty: true,
        min_base_qty: true,
        max_base_qty: true,
        max_quote_qty: true,
        trade_fee: true,
        quantity_decimal: true,
        price_decimal: true,
        status: true,
      },
    });

    console.log(2)
    if (!getPairData.length) {
      return res.status(config.HTTP_BAD_REQUEST).send({
        status_code: config.HTTP_BAD_REQUEST,
        status: "3",
        message: "Invalid pair id",
      });
    }
    // console.log('getpairdata',getPairData)
    console.log(3)
    const pairDecimal = getPairData[0].quantity_decimal;
    const pairSymbol = getPairData[0].pair_symbol;

    const minBaseVolume = getPairData[0].min_base_qty;
    const maxBaseVolume = getPairData[0].max_base_qty;
    const base_asset_id = getPairData[0].base_asset_id;


    const currentMarketPrice:any = await client.symbolPriceTicker({symbol:pairSymbol});
    console.log('currentMarketPrice',currentMarketPrice.price)
    let ordertype:any ;
    if(stop_price > currentMarketPrice.price){
       ordertype = "TAKE_PROFIT_LIMIT";
    }else{  
       ordertype = 'STOP_LOSS_LIMIT';
    }
   console.log('ordertype',ordertype)
    //get user balance from balances table
    const userAssetBalance = await prisma.balances.findMany({
      where: {
        user_id: user_id,
        currency_id: base_asset_id,
      },
      select: {
        current_balance: true,
      },
    });
    console.log(4)
    if (!userAssetBalance.length) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "User balance not found",
      });
    }
    console.log(5)
    const userBalance = userAssetBalance[0].current_balance;
    if (Number(userBalance) < Number(base_volume)) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Sorry, your quote balance is insufficient.",
      });
    }
    console.log(6)
    const validateBaseeVolume = Joi.object({
      base_volume: Joi.number()
        .precision(pairDecimal)
        .min(minBaseVolume)
        .max(maxBaseVolume)
        .required(),
    }).validate({ base_volume: base_volume });

    if (validateBaseeVolume.error) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: `Base volume must be greater then or equal to ${minBaseVolume} and less then or equal to ${minBaseVolume}`,
      });
    }
    console.log(8)
    const base_quantity = Number(Number(base_volume).toFixed(pairDecimal));

    const OrderId = GenerateUniqueID(10, randomUUID(), `${user_id}-`);

    await prisma.buy_sell_pro_limit_open.create({
      data: {
        user_id: user_id,
        pair_id: pair_id,
        type: side,
        base_quantity: base_quantity,
        quote_quantity: base_quantity * limit_price,
        order_price: limit_price,
        executed_base_quantity: 0,
        executed_quote_quantity: 0,
        stop_limit_price: stop_price,
        oco_stop_limit_price: null,
        order_id: OrderId,
        order_type: ordertype,
        device: null,
      },
    });
console.log(9)
    const  options = { 
      quantity: base_quantity,
      price: limit_price,
      stopPrice: stop_price,
      newClientOrderId: OrderId,
      timeInForce: TimeInForce.GTC,
      recvWindow: 5000,
      timestamp: Date.now()
    }
    
    //Place new order to Binance.
    let orderResponse;
    try{
    orderResponse = await client.newOrder(
      pairSymbol,
      getSide(side),
      getOrderType(ordertype),
      options
    );
    console.log('orderResponse', orderResponse)
  } catch (binanceError) {
    console.error("Binance Order Placement Error:", binanceError.message || binanceError);

    // Update the database to mark the order as failed
    await prisma.buy_sell_pro_limit_open.update({
      data: {
        status: "FAILED",
        response: binanceError.message || binanceError ,
      },
      where: {
        order_id: OrderId,
      },
    });

    return res.status(config.HTTP_SERVER_ERROR).send({
      status_code: config.HTTP_SERVER_ERROR,
      status: false,
      message: "Order failed to place.",
    });
  }
   
    const orderData = await client.getOrder(pairSymbol, {
      orderId:orderResponse.orderId
    })

    await prisma.$transaction([
      prisma.buy_sell_pro_limit_open.update({
        data: {
          order_price: orderData.price,
          base_quantity: orderData.origQty,
          api_order_id: orderData.orderId.toString(), //
          executed_base_quantity: orderData.executedQty,
          executed_quote_quantity: orderData.cummulativeQuoteQty,
          status: orderData.status
        },
        where: {
          order_id: orderData.clientOrderId,
        },
      }),
      prisma.buy_sell_order_response.create({
        data: {
          order_id: orderData.clientOrderId,
          api_order_id: orderData.orderId.toString(),
          response: JSON.stringify(orderResponse),
        },
      }),
    ]);

    const responseData:any = {
      order_id: orderData.clientOrderId, // Order ID
      base_quantity: orderData.origQty, // Order quantity
      quote_quantity: orderData.cummulativeQuoteQty, // Cumulative quote asset transacted quantity
      order_price: orderData.price, // Order price
      type: orderData.side, // Order type
      order_type: orderData.type, // Order type
      executed_base_quantity: orderData.executedQty, // Last executed quantity
      executed_quote_quantity: orderData.cummulativeQuoteQty, // Last quote asset transacted quantity
      status: orderData.status, // Current order status
      created_at: orderData.time, // Order creation time
    }

    return res.status(config.HTTP_SUCCESS).send({
      status_code: config.HTTP_SUCCESS,
      status: "1",
      message: "Order Placed Successfully",
      Data: [responseData]
    });
  } catch (e) {
    console.log(e);
    if(e === "Stop price would trigger immediately.") {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: "0",
        message: "Stop price must be greater then market price.",
      })
    }
    // await prisma.$transaction.rollback();
    // throw e;
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};


export const cancelOrder = async (req: any, res: any) => {
  try {
    const reqBody = req.body;
    const { user_id, order_id, pair_id } = reqBody;

    console.log(123, user_id, pair_id, order_id);

    if (!user_id || !pair_id || !order_id) {
      return res.status(400).send({
        status_code: 400,
        status: "0",
        message: "Please provide all fields.",
        Data: [],
      });
    }

    const getPairData = await prisma.buy_sell_pro_limit_open.findFirst({
      where: {
        order_id: order_id,
        status: {
          in: ["NEW", "PARTIALLY_FILLED", "OPEN"],
        },
      },
      select: {
        status: true,
        type: true,
      },
    });

    console.log(1234,getPairData);
    if (!getPairData) {
      return res.status(400).send({
        status_code: 400,
        status: "0",
        message: "Invalid Order Id or Order Already Cancelled",
        Data: [],
      });
    }
    const order_type = getPairData.type;

    const pair_data = await prisma.crypto_pair.findFirst({
      where: {
        pair_id: pair_id,
      },
      select: {
        pair_symbol: true,
        base_asset_id: true,
        quote_asset_id: true,
      },
    });
    if (!pair_data) {
      return res.status(400).send({
        status_code: 400,
        status: "0",
        message: "Invalid Pair Id",
        Data: [],
      });
    }

    const symbol = pair_data.pair_symbol;
    const base_asset_id = pair_data.base_asset_id;
    const quote_asset_id = pair_data.quote_asset_id;

    const orderData = await client.cancelOrder(symbol, {
      origClientOrderId: order_id,
    });
    console.log(orderData);
    if (orderData.status === "CANCELED") {
      const origQty = orderData.origQty;
      const executedQty = orderData.executedQty;
      const price = orderData.price;
      const remainingQty = Number(origQty) - Number(executedQty);

      if (order_type === "BUY") {
        // For Buy orders, unlock the remaining locked USDT (quote currency)
        const amountToUnlock = Number(price) * remainingQty;
        await prisma.balances.update({
          data: {
            current_balance: {
              increment: Number(amountToUnlock),
            },
            locked_balance: {
              decrement: Number(amountToUnlock),
            },
          },
          where: {
            user_id_currency_id: {
              user_id: user_id,
              currency_id: quote_asset_id,
            },
          },
        });
      } else if (order_type === "SELL") {
        // For Sell orders, unlock the remaining locked BTC (base currency)
        const amountToUnlock = remainingQty;
        await prisma.balances.update({
          data: {
            current_balance: {
              increment: Number(amountToUnlock),
            },
            locked_balance: {
              decrement: Number(amountToUnlock),
            },
          },
          where: {
            user_id_currency_id: {
              user_id: user_id,
              currency_id: base_asset_id,
            },
          },
        });
      }

      await prisma.$transaction([
        prisma.buy_sell_pro_limit_open.update({
          data: {
            status: "CANCELLED",
            date_time: orderData.transactTime,
            cancelled_date_time: orderData.transactTime,
          },
          where: {
            order_id: order_id,
          },
        }),
        prisma.buy_sell_order_response.create({
          data: {
            order_id: order_id,
            response: JSON.stringify(orderData),
          },
        }),
      ]);

      const responseData:any = {
        order_id: orderData.origClientOrderId, // Order ID
        base_quantity: orderData.origQty, // Order quantity
        quote_quantity: orderData.cummulativeQuoteQty, // Cumulative quote asset transacted quantity
        order_price: orderData.price, // Order price
        type: orderData.side, // Order type
        order_type: orderData.type, // Order type
        executed_base_quantity: orderData.executedQty, // Last executed quantity
        executed_quote_quantity: orderData.cummulativeQuoteQty, // Last quote asset transacted quantity
        status: orderData.status, // Current order status
        created_at: orderData.transactTime, // Order creation time
      }
  
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: "1",
        message: "Order Canceled Successfully",
        Data: [responseData],
      });
    }
  } catch (e) {
    console.log("error", e);
    // await prisma.$transaction.rollback();
    // throw e;
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

export function formatDate(timestamp: BigInt | number): string {
  const date = new Date(Number(timestamp)); // Convert to Date
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds (+5:30)
  const istDate = new Date(date.getTime() + istOffset); // Add offset
  const yyyy = istDate.getFullYear();
  const mm = String(istDate.getMonth() + 1).padStart(2, "0");
  const dd = String(istDate.getDate()).padStart(2, "0");
  const hh = String(istDate.getHours()).padStart(2, "0");
  const min = String(istDate.getMinutes()).padStart(2, "0");
  const ss = String(istDate.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}


export const get_open_orders = async (req: any, res: any) => {
  try {
    const { user_id, pair_id } = req.query;
    if (!user_id) {
      return res
        .status(400)
        .send({ status_code: 400, status: "3", msg: "provide user id" });
    }

    if (!pair_id) {
      return res
        .status(400)
        .send({ status_code: 400, status: "3", msg: "provide pair id" });
    }
    console.log(user_id, pair_id);
    const data = await prisma.buy_sell_pro_limit_open.findMany({
      where: {
        user_id: user_id,
        pair_id: pair_id,
        status: { in: ["OPEN", "NEW", "PARTIALLY_FILLED"] },
      },
      orderBy: {
        // assuming you want to sort by a specific field, e.g. "created_at"
        created_at: "desc",
      },
    });

    const responseFormat: Array<any> = [];
    data.forEach((item: any) => {
      responseFormat.push({
        user_id: item.user_id,
        order_id: item.order_id,
        pair_id: item.pair_id,
        type: item.type,
        order_type: item.order_type,
        base_quantity: item.base_quantity,
        quote_quantity: item.quote_quantity,
        order_price: item.order_price,
        stop_limit_price: item.stop_limit_price,
        oco_stop_limit_price: item.oco_stop_limit_price,
        executed_base_quantity: item.executed_base_quantity,
        executed_quote_quantity: item.executed_quote_quantity,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
      });
    });
    return res.status(200).send({
      status_code: 200,
      status: "1",
      message: "Open orders of all user.",
      data: responseFormat,
    });
  } catch (e) {
    console.log('husaain zindabad.');
    console.log(e);
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

export const get_pair_data = async (req: any, res: any) => {
  try {
    const { user_id, pair_id } = req.query;
    if (!user_id) {
      return res
        .status(400)
        .send({ status_code: 400, status: "3", msg: "provide user id" });
    }

    if (!pair_id) {
      return res
        .status(400)
        .send({ status_code: 400, status: "3", msg: "provide pair id" });
    }
    console.log(user_id, pair_id);
    const data = await prisma.crypto_pair.findMany({
      where: {
        pair_id: pair_id,
      },
      orderBy: {
        // assuming you want to sort by a specific field, e.g. "created_at"
        created_at: "desc",
      },
    });
    console.log(data);
    return res.status(200).send({
      status_code: 200,
      status: "1",
      message: "Open orders of all user.",
      data: data,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

export const rawQuery = async (req: any, res: any) => {
  try {
    const { data } = req.body;
    console.log(data);

    const OrderId = GenerateUniqueID(16, randomUUID(), "");

    let query = `INSERT INTO crypto_pair (
      pair_id,
      base_asset_id,
      quote_asset_id,
      pair_symbol,
      current_price,
      min_base_qty,
      max_base_qty,
      min_quote_qty,
      max_quote_qty,
      trade_fee,
      quantity_decimal,
      price_decimal,
      status,
      created_at
    )
    SELECT
      ${OrderId},
      c.currency_id,
      (SELECT currency_id FROM currencies WHERE symbol = 'USDT'),
      c.symbol + 'USDT',
      c.usdtprice,
      0.001,
      1000,
      1,
      1000,
      0.1,
      c.qty_decimal,
      c.price_decimal,
      c.status,
      DATE.now()
    FROM
      currencies c
    WHERE
      c.symbol != 'USDT'`;

    const result = await prisma.$queryRawUnsafe(query);

    return res.status(200).send({
      status_code: 200,
      status: true,
      msg: "Raw Query",
      Data: [result],
    });
  } catch (e) {
    return res
      .status(500)
      .send({ status_code: 500, status: false, msg: e, Data: [] });
  }
};

// export const placeSellOrder = async (req: any, res: any) => {
//   try {
//     const reqBody = req.body;
//     const {
//       user_id,
//       pair_id,
//       base_volume,
//       limit_price,
//       order_type,
//       stop_limit_price,
//     } = reqBody;

//     const getPairData = await prisma.crypto_pair.findMany({
//       where: {
//         pair_id: pair_id,
//       },
//       select: {
//         base_asset_id: true,
//         quote_asset_id: true,
//         pair_id: true,
//         pair_symbol: true,
//         current_price: true,
//         min_quote_qty: true,
//         min_base_qty: true,
//         max_base_qty: true,
//         max_quote_qty: true,
//         trade_fee: true,
//         quantity_decimal: true,
//         price_decimal: true,
//         status: true,
//       },
//     });

//     const side = "SELL";

//     if (!getPairData.length) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: "Invalid pair id",
//       });
//     }
//     // console.log('getpairdata',getPairData)

//     const pairDecimal = getPairData[0].price_decimal;
//     const pairSymbol = getPairData[0].pair_symbol;

//     const minBaseVolume = getPairData[0].min_base_qty;
//     const maxBaseVolume = getPairData[0].max_base_qty;
//     const base_asset_id = getPairData[0].base_asset_id;

//     //get user balance from balances table
//     const userAssetBalance = await prisma.balances.findMany({
//       where: {
//         user_id: user_id,
//         currency_id: base_asset_id,
//       },
//       select: {
//         current_balance: true,
//       },
//     });

//     if (!userAssetBalance.length) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: "User balance not found",
//       });
//     }

//     const userBalance = userAssetBalance[0].current_balance;
//     if (Number(userBalance) < Number(base_volume)) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: "Sorry, your quote balance is insufficient.",
//       });
//     }

//     const validateQuoteVolume = Joi.object({
//       base_volume: Joi.number()
//         .precision(pairDecimal)
//         .min(minBaseVolume)
//         .max(maxBaseVolume)
//         .required(),
//     }).validate({ base_volume: base_volume });

//     if (validateQuoteVolume.error) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: `Quote volume must be greater then or equal to ${minBaseVolume}`,
//       });
//     }
//     const validateBaseeVolume = Joi.object({
//       base_volume: Joi.number()
//         .precision(pairDecimal)
//         .min(minBaseVolume)
//         .max(maxBaseVolume)
//         .required(),
//     }).validate({ base_volume: base_volume });

//     if (validateBaseeVolume.error) {
//       return res.status(config.HTTP_SUCCESS).send({
//         status_code: config.HTTP_SUCCESS,
//         status: 0,
//         message: `Base volume must be greater then or equal to ${minBaseVolume} and less then or equal to ${minBaseVolume}`,
//       });
//     }

//     const fees = await prisma.fees.findFirst({ where: { id: 1 } });

//     //TDS AND FEES Calculation
//     const usdtFees = (base_volume * Number(fees?.buy_fees)) / 100;
//     const usdtTds = ((base_volume - usdtFees) * Number(fees?.tds)) / 100;
//     const baseAfterFees = Number(base_volume - (usdtFees + usdtTds));

//     const quoteAmountAfterFees = Number(
//       (baseAfterFees * limit_price).toFixed(pairDecimal)
//     );
//     const baseAmountAfterFees = Number(baseAfterFees.toFixed(pairDecimal));

//     console.log("baseAmountAfterFees", baseAmountAfterFees);
//     console.log("quoteAmountAfterFees", quoteAmountAfterFees);
//     console.log("usdtFees", usdtFees);
//     console.log("usdtTds", usdtTds);

//     const OrderId = GenerateUniqueID(25, randomUUID(), "TRD");

//     await prisma.$transaction([
//        prisma.buy_sell_pro_limit_open.create({
//         data: {
//           user_id: user_id,
//           pair_id: pair_id,
//           type: side,
//           base_quantity: base_volume,
//           quote_quantity: quoteAmountAfterFees,
//           order_price: limit_price,
//           executed_quantity: 0,
//           stop_limit_price: stop_limit_price,
//           oco_stop_limit_price: null,
//           tds: usdtTds,
//           fees: usdtFees,
//           final_amount: quoteAmountAfterFees,
//           order_id: OrderId,
//           order_type: order_type,
//           buy_sell_fees: fees?.buy_fees,
//           device: null,
//         },
//       }),
//       prisma.balances.update({
//        where: {
//          user_id_currency_id: {
//            user_id: user_id,
//            currency_id: base_asset_id,
//          },
//        },
//         data: {
//           current_balance: {
//             decrement: base_volume,
//           },
//           locked_balance: {
//             increment: base_volume,
//           },
//         },
//       })
//     ]);

//     let options;
//     if (order_type == "LIMIT") {
//       options = {
//         price: limit_price,
//         quantity: baseAmountAfterFees,
//         timeInForce: TimeInForce.GTC,
//         newClientOrderId: OrderId,
//       };
//     }
//     if (order_type == "MARKET") {
//       options = {
//         quantity: baseAmountAfterFees,
//         newClientOrderId: OrderId,
//       };
//     }
//     //Place new order to Binance.
//     const orderData = await client.newOrder(
//       pairSymbol,
//       getSide(side),
//       getOrderType(order_type),
//       options
//     );
//     const status = orderData.status;
//     const OrderResponse = orderData

//     await prisma.$transaction([
//        prisma.buy_sell_pro_limit_open.update({
//         data: {
//           order_id: orderData.clientOrderId,//
//           api_order_id: orderData.orderId.toString(),//
//           status: status,
//           date_time: orderData.transactTime,
//         },
//         where: {
//           order_id: orderData.clientOrderId,
//         }
//       }),
//       prisma.buy_sell_order_response.create({
//         data: {
//           order_id: orderData.clientOrderId,
//           api_order_id: (orderData.orderId).toString(),
//           response: JSON.stringify(OrderResponse),
//         },
//       })
//     ]);

//     return res.status(200).send({
//       status_code: 200,
//       status: true,
//       msg: "SellOrder Placed Successfully",
//       Data: [orderData],
//     });
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .send({ status_code: 500, status: false, msg: e, Data: [] });
//   }
// };

// export const get_open_orders = async (req:any, res:any) => {
//   try {
//     const { user_id, pair_id } = req.query;
//     console.log(user_id, pair_id);
//     const data = await prisma.buy_sell_pro_limit_open.findMany({
//       where: {
//         user_id: user_id,
//         pair_id: pair_id,
//         status: "OPEN"
//       }
//     });
//     return res.status(200).send({
//       status_code: 200,
//       status: true,
//       msg: "Open orders of all user.",
//       Data: [data],
//     });
//   } catch (e) {
//     console.log(e);
//     return res
//       .status(500)
//       .send({ status_code: 500, status: false, msg: e, Data: [] });
//   }
// };

// module.exports.buy_asset_pro = async (req, res) => {
//   // Process - 1) Check user Fiat balance 2) Lock user fiat balance 3)Insert order into open orders
//   try {
//     const {
//       user_id,
//       pair_id,
//       quote_volume,
//       base_price_rate,
//       order_type,
//       stop_limit_price,
//       ip,
//       coordinate
//     } = req.body;

//     const validateQuoteVolume = Joi.object({
//       quote_volume : Joi.number().min(0.0000000001).required(),
//     }).validate({quote_volume:quote_volume});

//     if (validateQuoteVolume.error) {
//     return  res.status(config).send({
//         status_code: config.HTTP_SUCCESS,
//         status : false,
//         msg: 'Quote volume must be greater then or equal to 0.0000000001'
//       });
//     }

//     // "market_order",  // stop_limit_order  // limit_order
//     if (
//       order_type != "market_order" &&
//       order_type != "limit_order" &&
//       order_type != "stop_limit_order"
//     ) {
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.invalid_ordertype,
//         status: false,
//       });
//     }

//     const user_active = await db.Get_Where_Universal_Data('status','tbl_user_registration_master' , {cuser_id_btx:user_id})

//     if (!user_active || user_active.length==0 || user_active == undefined){
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.user_not_found,
//         status: false
//       });
//     }
//     if(user_active.length || user_active){
//       const status = user_active[0].status
//       if(status == null){
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.database_error,
//           status: false
//         });
//       }
//       const checkStatus =configValidate.checkStatus(status)

//       if(checkStatus != 1){
//         return res.status(config.HTTP_SUCCESS).send({
//           status_code: config.HTTP_SUCCESS,
//           status: false,
//           msg:checkStatus
//         });
//       }
//     }

//     var pair_type;
//     var base_asset_id;
//     var quote_asset_id;
//     var pair_symbol;
//     var base_volume;
//     var at_price;

//     const pair_data = await db.Get_Where_Universal_Data(
//       "base_asset_id_btx,quote_asset_id_btx,pair_symbol_btx",
//       "tbl_registered_asset_pair_master",
//       { pair_id_btx: pair_id }
//     );

//     if (pair_data.length) {

//       base_asset_id = pair_data[0].base_asset_id_btx;
//       quote_asset_id = pair_data[0].quote_asset_id_btx;
//       pair_symbol = pair_data[0].pair_symbol_btx;
//       pair_type = "crypto_pair";
//     }
//     if (!pair_data || pair_data.length==0) {
//       const pair_data2 = await db.Get_Where_Universal_Data(
//         "base_asset_id,quote_asset_id,pair_symbol_btx",
//         "tbl_resigtered_asset_fiat_pair_master",
//         { pair_id: pair_id }
//       );
//       if (pair_data2.length) {
//         base_asset_id = pair_data2[0].base_asset_id;
//         quote_asset_id = pair_data2[0].quote_asset_id;
//         pair_symbol = pair_data2[0].pair_symbol_btx;
//         pair_type = "fiat_pair";
//         console.log(quote_asset_id);
//       } else {
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.pair_not_registered,
//           status: false
//         });
//       }
//     }

//     const pair_rate_data = await db.Get_Where_Universal_Data(
//       "current_price",
//       "tbl_all_assets_portfolio_data",
//       { pair_id: pair_id }
//     );

//     if (!pair_rate_data || pair_rate_data.length==0){
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.curret_rate_not_fetched,
//         status: false
//       });
//     }

//     const pair_rate = pair_rate_data[0].current_price;

//     // if (order_type == "stop_limit_order") {
//     // console.log(base_price_rate , pair_rate , stop_limit_price);

//     //   if (base_price_rate > pair_rate) {
//     //     return res.status(config.HTTP_SUCCESS).send({
//     //       status_code: config.HTTP_SUCCESS,
//     //       status: false,
//     //       msg: `When the traded price is equal to or greater than STOP PRICE:${stop_limit_price}
//     //     then place a BUY order at LIMIT PRICE:${base_price_rate}.`,
//     //     });
//     //   }
//     //   if (stop_limit_price < pair_rate) {
//     //     return res.status(config.HTTP_SUCCESS).send({
//     //       status_code: config.HTTP_SUCCESS,
//     //       status: false,
//     //       msg: `When the traded price is equal to or greater than STOP PRICE:${stop_limit_price}
//     //     then place a BUY order at LIMIT PRICE:${base_price_rate}.`,
//     //     });
//     //   }
//     // }

//       const user_fiat_balance_data = await db.Get_Where_Universal_Data(
//         "current_balance_btx",
//         "tbl_user_fiat_wallet_master",
//         { cuser_id_btx: user_id, fiat_asset_id_btx: quote_asset_id }
//       );

//       const user_balance = user_fiat_balance_data[0].current_balance_btx;

//       if (Number(user_balance) < Number(quote_volume)) {
//         return res.status(config.HTTP_SUCCESS).send({
//           status_code: config.HTTP_SUCCESS,
//           status: false,
//           msg: "Sorry, your quote balance is insufficient.",
//         });
//       }

//     if (pair_type == "crypto_pair") {
//       const user_asset_balance_data = await db.Get_Where_Universal_Data(
//         "current_balance_btx",
//         "tbl_user_crypto_assets_balance_details",
//         { cuser_id_btx: user_id, asset_id_btx: quote_asset_id }
//       );

//       if (!user_asset_balance_data || user_asset_balance_data.length==0){
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.user_not_found,
//           status: false
//         });
//       }
//       const user_balance = user_asset_balance_data[0].current_balance_btx;

//       if (Number(user_balance) < Number(quote_volume)) {
//         return res.status(config.HTTP_SUCCESS).send({
//           status_code: config.HTTP_SUCCESS,
//           status: false,
//           msg: "Sorry, your quote balance is insufficient.",
//         });
//       }
//     }

//     if (order_type == "market_order") {
//       at_price = pair_rate;
//       base_volume = quote_volume / pair_rate;
//     }
//     if (order_type == "limit_order" || order_type == "stop_limit_order") {
//       at_price = base_price_rate;
//       base_volume = quote_volume / base_price_rate;
//     }

//     // Generating Unique Order_id for each order..
//     const order_id = GenerateID.GenerateID(20, uuid.v1(), "PO").toUpperCase();

//     // DataBase call to Start mysql transaction to get user data and update balance of User.
//     const DataUpdated = await db.Create_Update_Buy_data_PRO(
//       user_id,
//       order_id,
//       pair_id,
//       pair_symbol,
//       base_asset_id,
//       quote_asset_id,
//       "BUY",
//       order_type,
//       quote_volume,
//       base_volume.toFixed(4),
//       at_price,
//       stop_limit_price,
//       Date.now(),
//       pair_type
//     );

//     if (DataUpdated == "No Data") {
//       return res.status(config.HTTP_BAD_REQUEST).send({
//         status_code: config.HTTP_BAD_REQUEST,
//         status: false
//       });
//     } else if (DataUpdated.affectedRows != 0) {
//       const Data = {
//         user_id: user_id,
//         order_id: order_id,
//         asset_name: base_asset_id,
//         base_value: base_volume.toFixed(4),
//         quote_value: quote_volume,
//         buying_rate: at_price,
//       };

//       const access_log_data = {
//         cuser_id_btx: user_id,
//         module_name_btx: "Trade",
//         action_btx: "Trade Buy pro",
//         ip_address_btx: ip,
//         co_ordinates: coordinate,
//         datetime: Date.now(),
//         c_by: user_id,
//       };
//       await db.Create_Universal_Data("tbl_acess_log", access_log_data);

//       // After Orer Successfully Placing Sending Proper Response
//       return res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
//         status_code: config.HTTP_SUCCESSFULLY_CREATED,
//         status: true,
//         Data: [Data],
//         msg: "Buy order placed successfully!"
//       });
//     }
//   } catch (err) {
//     return res.status(config.HTTP_SERVER_ERROR).send({
//       status_code: config.HTTP_SERVER_ERROR,
//       status: false,
//       msg: err.message,
//     });
//   }
// };

// interface BuyAssetProRequest {
//     user_id: string;
//     pair_id: string;
//     quote_volume: number;
//     base_price_rate: number;
//     order_type: string;
//     stop_limit_price: number;
//     ip: string;
//     coordinate: string;
//   }

//   interface BuyAssetProResponse {
//     status_code: number;
//     status: boolean;
//     msg: string;
//     Data?: any[];
//   }

//   export const  buyAssetPro = async (req: Request, res: Response)=> {
//     try {
//       const {
//         user_id,
//         pair_id,
//         quote_volume,
//         order_type,
//         stop_limit_price,
//         ip,
//         coordinate,
//       } = req.body;

//       const validateQuoteVolume = Joi.object({
//         quote_volume: Joi.number().min(0.0000000001).required(),
//       }).validate({ quote_volume });

//       if (validateQuoteVolume.error) {
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Quote volume must be greater then or equal to 0.0000000001',
//         });
//       }

//       if (
//         order_type !== 'market_order' &&
//         order_type !== 'limit_order' &&
//         order_type !== 'stop_limit_order'
//       ) {
//        return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid order type',
//         });
//       }

//       const user_active = await db.Get_Where_Universal_Data('status', 'tbl_user_registration_master', { cuser_id_btx: user_id });

//       if (!user_active || user_active.length === 0 || user_active === undefined) {
//         return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid user id',
//         })
//       }

//       if (user_active.length || user_active) {
//         const status = user_active[0].status;
//         if (status === null) {
//          return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid user id',
//          })
//         }
//         const checkStatus = configValidate.checkStatus(status);

//         if (checkStatus !== 1) {
//           return res.status(config.HTTP_BAD_REQUEST).send({
//             status_code: config.HTTP_BAD_REQUEST,
//             status: false,
//             msg: checkStatus
//           })
//         }
//       }

//       let base_asset_id;
//       let quote_asset_id;
//       let pair_symbol;
//       let base_volume;
//       let at_price;

//       const pair_data = await db.Get_Where_Universal_Data(
//         'base_asset_id_btx,quote_asset_id_btx,pair_symbol_btx',
//         'tbl_registered_asset_pair_master',
//         { pair_id_btx: pair_id }
//       );

//       if (pair_data.length) {
//         base_asset_id = pair_data[0].base_asset_id_btx;
//         quote_asset_id = pair_data[0].quote_asset_id_btx;
//         pair_symbol = pair_data[0].pair_symbol_btx;
//       }

//       if (!pair_data || pair_data.length === 0) {

//           return res.status(config.HTTP_BAD_REQUEST).send({
//             status_code: config.HTTP_BAD_REQUEST,
//             status: false,
//             msg: 'Invalid pair id',
//           });

//       }

//         const user_asset_balance_data = await db.Get_Where_Universal_Data(
//           'current_balance_btx',
//           'tbl_user_crypto_assets_balance_details',
//           { cuser_id_btx: user_id, asset_id_btx: quote_asset_id }
//         );

//         if (!user_asset_balance_data || user_asset_balance_data.length === 0) {
//          return res.status(config.HTTP_BAD_REQUEST).send({
//           status_code: config.HTTP_BAD_REQUEST,
//           status: false,
//           msg: 'Invalid user id',
//          })
//         }

//         const user_balance = user_asset_balance_data[0].current_balance_btx;

//         if (Number(user_balance) < Number(quote_volume)) {
//           return res.status(config.HTTP_BAD_REQUEST).send({
//             status_code: config.HTTP_BAD_REQUEST,
//             status: false,
//             msg: 'Insufficient balance',
//           });
//         }

//       const order_id = GenerateID.GenerateID(20, uuid(), 'PO').toUpperCase();

//       const DataUpdated = await db.Create_Update_Buy_data_PRO(
//         user_id,
//         order_id,
//         pair_id,
//         pair_symbol,
//         base_asset_id,
//         quote_asset_id,
//         'BUY',
//         order_type,
//         quote_volume,
//         base_volume.toFixed(4),
//         at_price,
//         stop_limit_price,
//         Date.now()
//       );

//       if (DataUpdated === 'No Data') {
//         return res.status(config.HTTP_SERVER_ERROR).send({
//           status_code: config.HTTP_SERVER_ERROR,
//           status: false,
//           msg: 'Something went wrong!',
//         })
//       } else if (DataUpdated.affectedRows !== 0) {
//         const Data = {
//           user_id: user_id,
//           order_id: order_id,
//           asset_name: base_asset_id,
//           base_value: base_volume.toFixed(4),
//           quote_value: quote_volume,
//           buying_rate: at_price,
//         };

//          res.status(config.HTTP_SUCCESSFULLY_CREATED).send({
//             status_code: config.HTTP_SUCCESSFULLY_CREATED,
//             status: true,
//             Data: [Data],
//             msg: 'Buy order placed successfully!',
//           });
//       }
//     } catch (err) {
//       return res.status(config.HTTP_SERVER_ERROR).send({
//         status_code: config.HTTP_SERVER_ERROR,
//         status: false,
//         msg: err.message,
//       });
//     }
//   };

export default {
  // quick_buy,
  buyAssetPro: placeBuyOrder,
  // ... other exports
};
