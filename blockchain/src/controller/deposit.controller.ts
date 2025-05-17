//remove all teh variables which are not used

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import config from "../config/defaults";
const prisma = new PrismaClient();
// import Big from "big.js";
// import { Decimal } from '@prisma/client/runtime/library';

// Top-level module scope (keeps memory for lifetime of server)
const processedTxHashes = new Set<string>();

// webhook for deposit
export const depositWebhook = async (req: Request, res: Response) => {
    try {
      const { user_id, chain_id, address, amount, contract_address, tx_hash, memo } = req.body;
  console.log( user_id, chain_id, address, amount, "contract_address: ",contract_address, tx_hash, memo)

      if(contract_address === undefined) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'Contract address is required',
        });
      }
      // Validate required parameters
      if (!user_id || !chain_id || !address || !amount || !tx_hash) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'Missing required parameters',
        });
      }
  
      // Validate data types
      if (
        typeof user_id !== 'string' ||
        typeof chain_id !== 'number' ||
        typeof address !== 'string' ||
        typeof contract_address !== 'string' ||
        typeof tx_hash !== 'string' ||
        (memo && typeof memo !== 'string')
      ) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'Invalid parameter types',
        });
      }
      if (processedTxHashes.has(tx_hash)) {
        return res.status(409).json({ status: 0, message: 'Duplicate transaction (in-memory cache)' });
      }
      // Add tx_hash to Set early to avoid race conditions
      processedTxHashes.add(tx_hash);
  
     const parsedAmount = amount;
     console.log('parsedAmount',parsedAmount)
      if (parsedAmount <= 0) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'Invalid amount',
        });
      }
  
      // Check if currency exists for the given chain & contract
      const currencyID: any = await prisma.$queryRaw`
      SELECT currency_id from currency_network
      WHERE network_id = ${chain_id} and contract_address = ${contract_address};`;
  
      if (!currencyID || currencyID.length === 0) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'Currency not found for the provided chain and contract',
        });
      }
  
      const currency_id =  currencyID[0].currency_id;
  
      // Optional: prevent duplicate tx_hash (idempotency)
      const existingTx = await prisma.deposit_history.findFirst({
        where: { transaction_id: tx_hash },
      });
  
      if (existingTx) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'Duplicate transaction hash',
        });
      }
  
      // Update user balance
      await prisma.$executeRaw`
      UPDATE balances
      SET main_balance = main_balance + ${parsedAmount},
          current_balance = current_balance + ${parsedAmount}
      WHERE user_id = ${user_id} AND currency_id = ${currency_id};
      `;
  
      await prisma.balances.updateMany({
        where: {
          user_id: user_id,
          currency_id: currency_id,
        },
        data: {
          main_balance: {
            increment: parsedAmount,
          },
          current_balance: {
            increment: parsedAmount,
          },
        },
      });
  
      // Insert deposit history
      await prisma.deposit_history.create({
        data: {
          user_id: user_id,
          transaction_id: tx_hash,
          amount: parsedAmount.toString(),
          final_amount: parsedAmount.toString(),
          status: 'SUCCESS',
          date: new Date(),
          coin_id: currency_id,
          memo: memo || '',
          address: address,
          chain_id: chain_id,
        },
      });
  
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 1,
        message: 'Deposit webhook executed successfully',
      });
  
    } catch (error) {
      console.error('Deposit webhook error:', error);
      return res.status(500).send({
        status_code: 500,
        status: 0,
        message: 'Internal server error',
      });
    }
  };

export const depositHistory = async (req: Request, res: Response) => {
    const {user_id} = req.body.user;  
    if(!user_id) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'User not found',
        });
    }
 
    const depositHistory:any = await prisma.$queryRaw`
    SELECT w.*, c.symbol, n.chain_name as network_name, n.id,n.netw_fee as network_fee FROM deposit_history w 
    JOIN currencies c ON w.coin_id = c.currency_id 
    JOIN chains n ON w.chain_id = n.chain_id
    WHERE w.user_id =${user_id} ORDER BY w.date DESC;`;

    if(depositHistory.length === 0) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'No deposit history found',
        });
    }    
    // const depositData = depositHistory.map((item:any) => {
    //     return {
    //         date: item.date,
    //         transaction_id: item.transaction_id,
    //         amount: item.amount,
    //         final_amount: item.final_amount,
    //         status: item.status,
    //     }
    // });  
     return res.status(config.HTTP_SUCCESS).send({ 
            status_code: config.HTTP_SUCCESS,
            status: '1', 
            message: 'Deposit history fetched successfully' ,
            data: depositHistory
        }   
    );        
};  

