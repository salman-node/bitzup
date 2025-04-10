//remove all teh variables which are not used

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import config from "../config/defaults";;
const prisma = new PrismaClient();
// import winston from "winston";

const { v4: uuidv4 } = require('uuid');

function generateTransactionId() {
    return uuidv4().replace(/-/g, ''); // Remove hyphens
}


export const withdrawFunds = async (req: Request, res: Response) => {
    const {user_id} = req.body.user;
    const {chain_id , address , amount, currency_id} = req.body;

    
    const currencyData = await prisma.currencies.findFirst({
        where: {
          currency_id: currency_id,
        },
      });

    const withdrawal_status = currencyData?.withdraw;
    const withdrawal_fee = currencyData?.withdrawl_fees;

    if(withdrawal_status === "Inactive") {
        // return res.status(400).json({ status: '0', message: 'Withdrawal is inactive for this currency' });
        return res.status(config.HTTP_SUCCESS).send({
            status_code: config.HTTP_SUCCESS,
            status: 0,
            message: 'Withdrawal is inactive for this currency',
          });
    }
    
        //get user balance from balances table
        const userAssetBalance = await prisma.balances.findMany({
            where: {
              user_id: user_id,
              currency_id: currency_id,
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
            //check if user has sufficient balance
            if (Number(userBalance) < Number(amount)) {
                return res.status(config.HTTP_SUCCESS).send({
                    status_code: config.HTTP_SUCCESS,
                    status: 0,
                    message: "Sorry, your balance is insufficient.",
                  });
            }

    //withdrawal fees is in % , reduce it from the amount
    const calculatedFee = (Number(amount) * Number(withdrawal_fee)) / 100;
    const finalWithdrawalAmount = Number(amount) - Number(calculatedFee);
    
    //debit balance of user from tbl_user_crypto_assets_balance_details
    await prisma.balances.update({
        data: {
          current_balance: {
            decrement: Number(amount),
          },
          main_balance: {
            decrement: Number(amount),
          },
        },
        where: {
          user_id_currency_id: {
            user_id: user_id,
            currency_id: currency_id,
          },
        },
      });

      //create transaction id like this 594c0d40c3c2659451736d6e
     const transaction_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
     //insert into withdrawal_history table
    await prisma.withdrawl_history.create({
        data: {
          date: new Date(),
          user_id: user_id,
          coin_id: currency_id,
          chain_id: chain_id,
          address: address,
          amount: finalWithdrawalAmount,
          fiat_amount: amount,
          transaction_id: generateTransactionId(),
          memo: "",
          final_amount: finalWithdrawalAmount,
          destination_tag: "",
          status: "PENDING",
          fees: calculatedFee,
        },
      });

      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,   
        success: "1",
        message: 'Withdrawal request has been created successfully',
        Data: {
            transaction_id: transaction_id,
            withdrawal_amount: amount,
            final_amount: finalWithdrawalAmount,
            fees: calculatedFee,
        }
      });

 
    
};

export const withdrawalHistory = async (req: Request, res: Response) => {
    const {user_id} = req.body.user;
  
    // prisam raw query to join 2 tables and get symbol from currencies table where coin_id = currencies.currency_id and chain_id = networks.id
    
    const withdrawalHistory:any = await prisma.$queryRaw`
    SELECT w.*, c.symbol, n.chain_name as network_name, n.id,n.netw_fee as network_fee FROM withdrawl_history w
    JOIN currencies c ON w.coin_id = c.currency_id
    JOIN chains n ON w.chain_id = n.id
    WHERE w.user_id = ${user_id}
    ORDER BY w.date DESC;`; 

    if(withdrawalHistory.length === 0) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: 'No withdrawal history found',
      });
    }  
    
    return res.status(config.HTTP_SUCCESS).send({ 
        status_code: config.HTTP_SUCCESS,
        status: '1', 
        message: 'Withdrawal history fetched successfully' ,
        data: withdrawalHistory
    }
    );    
};  

 

