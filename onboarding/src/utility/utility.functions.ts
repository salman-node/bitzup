import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { randomBytes } from 'crypto';
import config from '../config/defaults';
import { prisma } from '../config/prisma.client';
import sendEmail, { sendOTPEmail } from './mail.function';
import { IClientInfo } from '../types/models.types';
import { JwtPayload } from 'jsonwebtoken';
import * as admin from 'firebase-admin';
const dotenv = require('dotenv');;
import DeviceDetector, { DetectResult } from 'node-device-detector';
import * as geoip from 'geoip-lite';
import  { v4 as uuidv4 } from 'uuid';

dotenv.config();

// created new detector object
const detector = new DeviceDetector({
  clientIndexes: true,
  deviceIndexes: true,
  deviceAliasCode: false,
});

/*----- Generate token -----*/
export const getToken = async (user_id: string) => {
  if (!config.jwtsecret) {
    throw new Error('JWT secret is not defined in the configuration.');
  }

  // get token_string and email from user table
  const token_data = await prisma.user.findFirst({
    where: {
      user_id: user_id,
    },
    select: {
      token_string: true,
      email: true
    }
  })
  if (!token_data) {
    throw new Error('User not found.');
  }
  const token_string = randomBytes(8).toString("hex");
  const email = token_data.email;

  await prisma.user.updateMany({
    where: {
      user_id: user_id,
    },
    data: {
      token_string: token_string
    }
  })

  return jwt.sign({ token_string: token_string, email: email }, config.jwtsecret, {
    expiresIn: config.jwtExp,
  });
};


/*----- Verify token -----*/
export const verifyToken = async (token: string) => {
  return new Promise(async (resolve, reject) => {
    if (!config.jwtsecret) {
      throw new Error('JWT secret is not defined in the configuration.');
    }
    jwt.verify(token, config.jwtsecret, async (err, _decoded: any) => {
      if (!config.jwtsecret) {
        throw new Error('JWT secret is not defined in the configuration.');
      }
      const payload: JwtPayload | string = jwt.verify(token, config.jwtsecret, {
        ignoreExpiration: true,
      });
      if (typeof payload === 'string') {
        throw new Error('Token is not valid.');
      }
      if (err) {
        if (err.name === 'TokenExpiredError') {
          throw new Error('session expired, please login again.');
        
        } else {
          reject(err);
        }
      } else {
        resolve(payload);
      }
    });
  });
};

/*----- Check OTP -----*/
export const checkOtp = (otp: string, hashedOTP: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(otp, hashedOTP, (err, validOTP) => {
      if (err) {
        reject(err);
      }

      resolve(validOTP);
    });
  });
};

/*----- Check password -----*/
export const checkPassword = async (password: string, passwordHash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        reject(err);
      }
      resolve(same);
    });
  });
};

/*----- Send General OTP -----*/
export const sendGeneralOTP = async (
  email: string,
  subject: string,
  client_info: IClientInfo | undefined,
  user_id:string
) => {
  try {
    // const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOTP = randomBytes(3).toString('hex');
    const hashedOTP = await bcrypt.hash(randomOTP, config.saltworkFactor);

    // storing hashed OTP to db
    await prisma.otp.create({
      data: {
        user_id,
        otp: hashedOTP,
        createdAt: Date.now().toString(),
        expiresAt: `${Date.now() + 300000}`,
      },
    });

    // sending OTP mail
    await sendOTPEmail(email, subject, randomOTP, client_info);
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*----- Send OTP Verification Email -----*/
export const sendOTPVerificationEmail = async (
  email: string,
  client_info: IClientInfo | undefined,
  user_id:string
) => {
  try {
    // const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
    const randomOTP = randomBytes(3).toString('hex');
    const hashedOTP = await bcrypt.hash(randomOTP, config.saltworkFactor);

    // storing hashed OTP to db
    await prisma.otp.create({
      data: {
        user_id:user_id,
        otp: hashedOTP,
        createdAt: Date.now().toString(),
        expiresAt: `${Date.now() + 300000}`,
      },
    });

    // sending mail
    await sendEmail(email, '', randomOTP, client_info);
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*----- Verify OTP -----*/
export const verifyOtp = async (user_id: string, otp: string) => {
  try {
    // Check OTP
    const userOtpRecord = await prisma.otp.findFirst({
      where: { user_id: user_id },
    })

    if (!userOtpRecord) {
      return {
        verified: false,
        msg: `Invalid OTP.`,
      };
    }

    // user otp record exist
    const expiresAt = userOtpRecord.expiresAt;
    const hashedOTP = userOtpRecord.otp;

    if (parseInt(expiresAt) < Date.now()) {
      // user otp has expired
      await prisma.otp.deleteMany({ where: { user_id:user_id } });
      return {
        verified: false,
        msg: 'OTP has expired. Please please sign up or log in again.',
      };
    } else {
      const validOTP = await checkOtp(otp, hashedOTP);
      if (!validOTP) {
        // supplied otp is wrong
        return {
          verified: false,
          msg: "Invalid OTP",
        };
      } else {
        // success
        await prisma.otp.deleteMany({ where: { user_id:user_id } });
        return {
          verified: true,
          msg: 'User Account verified successfully',
        };
      }
    }
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*------ Get Client Information ------*/
export const getClientInfo = async (req: Request) => {
  try {
    // const ip = req.ip.split(':');
    const ip = '237.84.2.178';
    const ipv4 = ip[ip.length - 1];
    const userAgent = req.get('user-agent');

    // destructure information from user-agent
    const result: DetectResult = detector.detect(userAgent as string);

    const location = geoip.lookup(ipv4);

    // client object
    const client_obj: IClientInfo = {
      ip: ipv4,
      city: location?.city,
      region: location?.region,
      country_name: location?.country,
      os_name: result?.os.name,
      client_name: result?.client?.name,
      client_type: result?.client?.type,
      device_type: result?.device.type,
    };

    return client_obj;
  } catch (err) {
    console.log((err as Error).message);
  }
};

/*------- Send Notifications --------*/
export const sendNotification = async (
  fcm_token: string,
  title: string,
  body: string,
) => {
  try {
    if (!admin.apps.length) {
    const serviceAccount = {
      type: process.env.FIREBASE_TYPE || '',
      project_id: process.env.FIREBASE_PROJECT_ID || '',
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
      private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
        /\\n/g,
        '\n',
      ),
      client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
      client_id: process.env.FIREBASE_CLIENT_ID || '',
      auth_uri: process.env.FIREBASE_AUTH_URI || '',
      token_uri: process.env.FIREBASE_TOKEN_URI || '',
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || '',
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL || '',
      universe_domain: 'googleapis.com',
    };

    admin.initializeApp({
      credential: admin.credential.cert(Object(serviceAccount)),
    });
  }

    // Check if FCM token is provided
    if (!fcm_token) {
      console.log('Fcm token is not provided');
    }

    // Send the notification using the FCM token
    const response = await admin.messaging().send({
      token: fcm_token,
      notification: {
        title,
        body,
      },
      // data: {
      //   click_action: 'YOUR_ACTION',
      // },
    });
    

    // Handle the response
    console.log('Notification sent:', response);
    // return {
    //   verified: true,
    //   msg: "Notification sent",
    // };
  } catch (error) {
    console.log('Error in Sending Notifications: ',error,(error as Error).message);
    // return {
    //   verified: false,
    //   msg: (error as Error).message,
    // };
  }
};


export const generateUniqueId = async (prefix:string, length:number) => {
  let uuid = uuidv4().replace(/-/g, "");
  let uuidLength = length - prefix.length;
  let trimmedUuid = uuid.substring(0, uuidLength);
  return (prefix + trimmedUuid).toUpperCase();
};
