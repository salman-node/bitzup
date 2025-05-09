import { Request, Response } from 'express';
import { getClientInfo, sendGeneralOTP } from '../utility/utility.functions';
import { prisma } from '../config/prisma.client';
import { IClientInfo } from '../types/models.types';
import { verifyOtp } from '../utility/utility.functions';
import { getIplocation } from '../utility/activity.log';

/*----- send OTP handler -----*/
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email, subject,ip_address,device_type,device_info }: 
    { 
       email: string;
       subject: string;
       ip_address:string;
       device_type:string;
       device_info:string
    } = req.body;

    if (!email || !subject || !ip_address || !device_type || !device_info) {
      // throw new Error('Please provide all field');
      return res.status(400).send({
          status:'3',
          message:"Please provide all field"
      })
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // throw new Error('Please provide valid email address');
      return res.status(200).send({
          status:'0',
          message:"Please provide valid email address"
      })
    }

    // check user
    const exist = await prisma.user.findUnique({
      where: { email },
      select: { user_id: true },
    });

    // user not present
    if (!exist) {
      // throw new Error('User not found with this email Id');
      return res.status(200).send({
          status:'0',
          message:"Invalid email address"
      })
    }

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    // send OTP email
    await prisma.otp.deleteMany({ where: { user_id: exist.user_id } });
    await sendGeneralOTP(email, subject, result,exist.user_id);
    
    const location: string = await getIplocation(ip_address);
    await prisma.activity_logs.create({
      data: {
        user_id: exist.user_id,
        ip_address,
        device_type,
        device_info,
        activity_type: 'Send OTP',
        location: location,
      },
    });

    return res.status(200).send({
      status: '1',
      message: 'OTP send to your email plz check',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: '0', message: (err as Error).message });
  }
};

export const sendEmailOtp = async (req: Request, res: Response) => {
  try {
    const { user_id, subject, ip_address, device_type, device_info }: { user_id: string; subject: string; ip_address:string; device_type:string; device_info:string } = req.body;

    if (!user_id || !subject || !ip_address || !device_type || !device_info) {
      // throw new Error('Please provide all field');
      return res.status(400).send({
          status:'3',
          message:"Please provide all field"
      })
    }  
    // check user
   const userEmail = await prisma.user.findFirst({
     where: { user_id },
     select: {
       email: true,
     },
   });

    // user not present
    if (!userEmail) {
      // throw new Error('User not found with this email Id');
      return res.status(400).send({
        status: '3',
        message: 'Invalid email address',
      })
    }

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    // send OTP email
    await prisma.otp.deleteMany({ where: { user_id: user_id } });
    await sendGeneralOTP(userEmail.email, subject, result,user_id);

    const location: string = await getIplocation(ip_address);

    await prisma.activity_logs.create({
      data: {
        user_id: user_id,
        ip_address,
        device_type,
        device_info,
        activity_type: 'Send OTP on email',
        location: location,
      },
    });
    return res.status(200).send({
      status: '1',
      message: 'OTP send to your email plz check',
    });
  } catch (err) {
    console.log(err);
   return res.status(500).send({ status: '0', message: (err as Error).message });
  }
};

/*----- verify OTP handler -----*/
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { id: user_id,email: email } = req.body.user;
    const { otp, ip_address, device_type, device_info } = req.body;

    // validate user
    if (!user_id || !email || !otp || !ip_address || !device_type || !device_info) {
      return res.status(200).send({
        status: '0',
        message: 'Please provide all field',
      });
    }

    // verify otp
    const verifyOTP = await verifyOtp(email, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      // throw new Error(verifyOTP?.msg);
      return res.status(200).send({
        status: '0',
        message: verifyOTP?.msg,
      });
    }
   
   const location: string = await getIplocation(ip_address);
   await prisma.activity_logs.create({
      data: {
        user_id: user_id,
        ip_address,
        device_type,
        device_info,
        activity_type: 'Verify OTP',
        location: location
      },
    });

   return  res.status(200).send({
      status: '1',
      message: 'OTP verified',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: '0', message: (err as Error).message });
  }
};
