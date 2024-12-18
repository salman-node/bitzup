import { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { generateUniqueId } from "../utility/utility.functions";

const prisma = new PrismaClient();

dotenv.config();

/*----- Get Buy Sell Balance -----*/
export const createCryptoPair = async (req: Request, res: Response) => {
  try {
    // const { admin_id: admin_id } = req.body.user;
    const {
      quote_currency,
      base_currency,
      symbol,
      qty_decimal,
      price_decimal,
      min_quote_qty,
      max_quote_qty,
      trade_fee,
    } = req.body;
    // if (!admin_id) {
    //   return res.json({
    //     status: "0",
    //     message: "You are not authorized or user not present",
    //   });
    // }
    if (
      !quote_currency ||
      !base_currency ||
      !symbol ||
      !qty_decimal ||
      !price_decimal
    ) {
      return res.status(200).send({
        status: "0",
        message: "Please provide all the fields",
      });
    }

    const quoteData = await prisma.currencies.count({
      where: { currency_id: quote_currency },
    });
    if (!quoteData) {
      return res.status(200).send({
        status: "0",
        message: "Provide valid quote currency",
      });
    }

    const baseData = await prisma.currencies.count({
      where: { currency_id: base_currency },
    });
    if (!baseData) {
      return res.status(200).send({
        status: "0",
        message: "Provide valid base currency",
      });
    }

    const pair_id = await generateUniqueId(symbol, 16);

const data = await prisma.crypto_pair.create({
  data: {
    pair_id: pair_id,
    quote_asset_id: quote_currency,
    base_asset_id: base_currency,
    pair_symbol: symbol,
    quantity_decimal: qty_decimal,
    price_decimal,
    current_price: 0,
    min_base_qty: min_quote_qty,
    max_base_qty: max_quote_qty,
    min_quote_qty: min_quote_qty,
    max_quote_qty: max_quote_qty,
    trade_fee: trade_fee,
    chart_id: "", // Add the missing property
    icon: "", // Add the missing property
    trade_status: 0, // Add the missing property
    pro_trade: 0, // Add the missing property
    change_in_price: 0, // Add the missing property
  },
});
    res.status(200).send({
      status: "1",
      message: "Crypto pair created successfully",
      data,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ status: "0", message: err.message });
  }
};

export function generateRandomOrderId(): string {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${timestamp}${randomPart}`;
}
