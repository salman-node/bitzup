//remove all teh variables which are not used

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import config from "../config/defaults";
const prisma = new PrismaClient();
// import winston from "winston";


export const depositHistory = async (req: Request, res: Response) => {
    const {user_id} = req.body.user;  
 
    const depositHistory = await prisma.deposit_history.findMany({
        where: {
            user_id: user_id,
        },
        orderBy: {
            date: 'desc',
        },
    });

    if(depositHistory.length === 0) {
        return res.status(config.HTTP_SUCCESS).send({
          status_code: config.HTTP_SUCCESS,
          status: 0,
          message: 'No deposit history found',
          });
    }    
    const depositData = depositHistory.map((item) => {
        return {
            date: item.date,
            transaction_id: item.transaction_id,
            amount: item.amount,
            final_amount: item.final_amount,
            fees: item.fees,
            status: item.status,
        }
    });  
     return res.status(config.HTTP_SUCCESS).send({ 
            status_code: config.HTTP_SUCCESS,
            status: '1', 
            message: 'Deposit history fetched successfully' ,
            data: depositData
        }   
    );        
};  

