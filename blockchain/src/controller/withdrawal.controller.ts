//remove all teh variables which are not used

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import config from "../config/defaults";;
import { createActivityLog } from "../utility/activity.logs";
import { getClientInfo,verifyOtp} from "../utility/utility.functions";
import speakeasy from "speakeasy";
import { IClientInfo} from "../types/models.types";
import { sendOTPVerificationEmail } from "../utility/utility.functions";
const prisma = new PrismaClient();
// import winston from "winston";

const { v4: uuidv4 } = require('uuid');

function generateTransactionId() {
    return uuidv4().replace(/-/g, ''); // Remove hyphens
}


export const withdrawFunds = async (req: Request, res: Response) => {
    const {user_id} = req.body.user;
    const {chain_id,otp ,authenticator_code ,password, address , amount, currency_id, device_info , device_type } = req.body;
    if(!chain_id || !address || !amount || !currency_id || !device_info || !device_type ) {
        return res.status(config.HTTP_SUCCESS).send({
            status_code: config.HTTP_SUCCESS,
            status: 0,
            message: "Please provide all field",
          });
    }
    const user = await prisma.user.findFirst({
        where: {
          user_id: user_id,
        },
        select:{
          withdrawal_password:true,
          withdrawal_pass_locktime:true,
          email:true,
          isAuth:true,
          user_id:true,
          secret_key:true,
          anti_phishing_code:true,
        }
    });
    console.log("user",user);
    if(user?.withdrawal_password == null){
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: "0",
        withdrawal_password: false
      });
    }

    if(user?.isAuth === "Inactive"){
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: "0",
        isAuth: false
      });
    }

    // const locktime = user?.withdrawal_pass_locktime

    // if(locktime != null && new Date() < locktime){
    //   return res.status(200).send({
    //     status: "0",
    //     message:
    //       "You can send withdrawal request after " +
    //       locktime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    //   });
    // }

    const currencyData = await prisma.currencies.findFirst({
        where: {
          currency_id: currency_id,
        },
    });
    if(!currencyData){
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: "Currency not found",
      });
    }

    const withdrawal_status = currencyData?.withdraw;
    const withdrawal_fee = currencyData?.withdrawl_fees;
    if(!withdrawal_status || withdrawal_status === "Inactive") {
        // return res.status(400).json({ status: '0', message: 'Withdrawal is inactive for this currency' });
        return res.status(config.HTTP_SUCCESS).send({
            status_code: config.HTTP_SUCCESS,
            status: 0,
            message: 'Withdrawal is inactive for this currency',
          });
    }

    const ip_address = req.headers["x-real-ip"] as string || (req.headers["x-forwarded-for"] as string).split(",")[0];
    // get client information
    const result: IClientInfo | undefined = await getClientInfo(ip_address,device_type,device_info);

    if(!otp){
      await sendOTPVerificationEmail(user?.email as string, result,user?.user_id as string,user?.anti_phishing_code as string)
      return res.status(200).send({
        status: "1",
        message:
          "OTP has been sent to your email.",
        showAuth: user?.isAuth === "Active" ? true : false,
        verify:'no'
      });
    }

    if(!password) {
      return res.status(200).send({
        status: "0",
        message: 'Please provide password'
      });
    }

    const comparPassword = bcrypt.compare(password, user?.withdrawal_password as string)
    if(!comparPassword) {
         return res.status(200).send({
        status: "0",
        message: 'Incorrect password'
      });
    }

    if (user?.isAuth === "Active") {
      if (!authenticator_code) {
        // throw new Error('Please provide authenticator code');
        return res
          .status(200)
          .send({ status: "0", message: "Please provide authenticator code" });
      }

      const verified = speakeasy.totp.verify({
        secret: JSON.parse(user.secret_key || "").base32,
        encoding: "base32",
        token: authenticator_code,
        window: 1, // Number of 30-second intervals to check before and after the current time
      });

      if (!verified) {
        // throw new Error('Please provide correct authenticator code');
        return res.status(200).send({
          status: "0",
          message: "Please provide correct authenticator code",
        });
      }
    }

    // verify otp
    const verifyOTP = await verifyOtp(user?.user_id as string, otp);
    // if not verified
    if (!verifyOTP?.verified) {
      return res.status(200).send({ status: "0", message: verifyOTP?.msg });
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
                    message: "Insufficient balance",
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
          locked_balance: {
            increment: Number(amount),
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
     const transaction_id = Math.random().toString(36).substring(2, 15);
    
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

      await createActivityLog({
        user_id: user_id,
        ip_address: ip_address ?? "",
        activity_type: "Withdrawal",
        device_type: device_type ?? "",
        device_info: device_info ?? "",
        location: result?.location ?? "", 
      });

      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,   
        status: "1",
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

    if(!user_id) {
      return res.status(config.HTTP_SUCCESS).send({
        status_code: config.HTTP_SUCCESS,
        status: 0,
        message: 'User not found',
      });
    }
  
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

export const generateWithdrawalPassword = async (req: Request, res: Response) => {
  const {password, otp ,authenticator_code, device_info,device_type} = req.body
  const { user_id: user_id } = req.body.user;
try {
    if (!user_id) {
      return res.status(400).send({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }
    if(!password){
      return res.status(400).send({
        status: "3",
        message: "provide password",
      });
    }
    //passwrod regex Capital letter + small letter + number + special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegex.test(password)){
      return res.status(200).send({
        status: "0",
        message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    }

    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
      select: {
        email: true,
        user_id: true,
        isAuth: true,
        secret_key: true,
        withdrawal_password: true,
        withdrawal_pass_locktime: true,
        anti_phishing_code: true,
      },
    });

    const ip_address = req.headers["x-real-ip"] as string || (req.headers["x-forwarded-for"] as string).split(",")[0];
    // get client information
    const result: IClientInfo | undefined = await getClientInfo(ip_address,device_type,device_info);


    if(!otp){
      await sendOTPVerificationEmail(user?.email as string, result,user?.user_id as string,user?.anti_phishing_code as string)
      return res.status(200).send({
        status: "1",
        message:
          "OTP has been sent to your email.",
        showAuth: user?.isAuth === "Active" ? true : false,
        verify:'no'
      });
    }

    if (user?.isAuth === "Active") {
          if (!authenticator_code) {
            // throw new Error('Please provide authenticator code');
            return res
              .status(200)
              .send({ status: "0", message: "Please provide authenticator code" });
          }
    
          const verified = speakeasy.totp.verify({
            secret: JSON.parse(user.secret_key || "").base32,
            encoding: "base32",
            token: authenticator_code,
            window: 1, // Number of 30-second intervals to check before and after the current time
          });
    
          if (!verified) {
            // throw new Error('Please provide correct authenticator code');
            return res.status(200).send({
              status: "0",
              message: "Please provide correct authenticator code",
            });
          }
    }

    // verify otp
    const verifyOTP = await verifyOtp(user?.user_id as string, otp);
    // if not verified
    if (!verifyOTP?.verified) {
      return res.status(200).send({ status: "0", message: verifyOTP?.msg });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        user_id: user_id,
      },
      data: {
        withdrawal_password: passwordHash,
        withdrawal_pass_locktime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

      await createActivityLog({
      user_id: user?.user_id as string,
      ip_address: ip_address ?? "",
      activity_type: "Login",
      device_type: device_type ?? "",
      device_info: device_info ?? "",
      location: result?.location ?? "",
    });
    return res.status(200).json({
      status: "1",
      message: "Withdrawal password updated successfully, you can withdraw after 24 hours once password updated",
    });
  } catch (error) {
    console.error("Error fetching data:", (error as Error).message);
    res.status(500).send({
      status: "0",
      message: "Unable to fetch data from Binance API",
    });
  }
}

 

