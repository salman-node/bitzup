import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { createActivityLog } from '../utility/activity.log'
import { getIplocation } from "../utility/activity.log";
import { randomBytes } from "crypto";
import config from "../config/defaults";
import speakeasy from "speakeasy";
import { prisma } from "../config/prisma.client";
import { IClientInfo, IUser, IUserPartial } from "../types/models.types";
import axios from "axios";
import {
  checkPassword,
  getToken,
  generateUniqueId,
} from "../utility/utility.functions";
import {
  sendOTPVerificationEmail,
  verifyOtp,
  getClientInfo,
} from "../utility/utility.functions";
// import { json } from "stream/consumers";

function generate9DigitUID() {
  return Math.floor(100000000 + Math.random() * 900000000);
}


/*----- SignUp -----*/
export const signUp = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      country_code,
      password,
      otp,
      device_type,
      device_info
    }: IUser = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !country_code ||
      !password ||
      !device_type ||
      !device_info
    ){        
      // throw new Error('Please provide all field');
      return res
        .status(400)
        .send({ status: "3", message: "Please provide all field" });
    }

    // Check country
    const country = await prisma.countries.findFirst({
      where: { phonecode: country_code },
    });
    if (!country) {
      // throw new Error('Country code invalid');
      return res
        .status(200)
        .send({ status: "0", message: "Country code invalid" });
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // throw new Error('Please provide valid email address');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide valid email address" });
    }

    // Check Phone
    if (typeof parseInt(phone) !== "string" && phone.trim().length < 7) {
      // throw new Error('Please provide valid phone number');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide valid phone number" });
    }

    //passwrod regex Capital letter + small letter + number + special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegex.test(password)){
      return res.status(200).send({
        status: "0",
        message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    }
    // Check user
    const user_exist = await prisma.user.findUnique({ where: { email }, select: { user_id: true } });
    if (user_exist) {
      return res
        .status(200)
        .send({ status: "0", message: "User already exist" });
    }

    const ip_address = req.headers['x-real-ip'] as string || (req.headers['x-forwarded-for'] as string).split(',')[0];

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(ip_address, device_type, device_info);

    if (!otp) {
      const user_id = await generateUniqueId("U", 12);
      // send OTP email verification
      await sendOTPVerificationEmail(email, result, user_id);
      return res.status(200).send({
        status: "1",
        message: "OTP send to your email plz check",
        data: {
          user_id: user_id,
        },
      });
    }

    var user_id: string;

    user_id = req.body.user_id;

    if(!user_id){
      return res.status(500).send({ status: "0", message: "internal server error" });
    }

    const verifyOTP = await verifyOtp(user_id, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      // throw new Error(verifyOTP?.msg);
      return res.status(200).send({ status: "0", message: verifyOTP?.msg });
    }
    const tokenString = randomBytes(8).toString("hex");
    // Password hashed
    const hashed_password = await bcrypt.hash(password, config.saltworkFactor);
    // Creating user
    await prisma.user.create({
      data: {
        user_id: user_id,
        name: name,
        email: email,
        phone: phone,
        country: JSON.stringify(country.id),
        token_string: tokenString,
        password: hashed_password,
        uid: generate9DigitUID()
      },
    });

    // update user verified
    // await prisma.user.update({
    //   where: { email: user.email },
    //   data: { isVerified: 'true' },
    // });

    const ipLocation:string = await getIplocation(ip_address);

    await createActivityLog({
      user_id: user_id,
      ip_address: ip_address ?? "",
      activity_type: "Sign Up",
      device_type: device_type ?? "",
      device_info: device_info ?? "",
      location: ipLocation
    });

    return res.status(200).send({
      status: "1",
      message: "Successfully account created",
      user_id: user_id,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "0", message: (err as Error).message });
  }
};

export const getReferralCodeURl = async (req: Request, res: Response) => {
  try {
    const { user_id: user_id } = req.body.user;
    if (!user_id) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    // const user = await prisma.user.findUnique({
    //   where: { user_id: user_id },
    //   select: {
    //     user_id: true,
    //     referral_url: true,
    //   },
    // });
    // if (user?.referral_url == null) {
        const response = await axios.post(config.BRANCH_URL, {
          branch_key: config.BRANCH_API_KEY,
          data: {
            '$canonical_identifier': `user/referral/user1234`,
            'referralCode': "user1234",
            '$og_title': 'Sign Up and get a reward',
            '$og_description': 'Use this referral and get a reward!',
            '$ios_url': `bitzup://referral/user1234`,
            '$fallback_url': `https://i.diawi.com/sZXPEr`,
          },
        });
        console.log('Branch link:', response.data.url);
        return res.status(200).send({ 
          status: "1",
          data: {
            referral_code : user_id,
            referral_url: response.data.url,
          },
        });
    // }
      // return res.status(200).send({ 
      //     status: "1",
      //     data: {
      //       referral_code : user?.user_id,
      //       referral_url: user?.referral_url,
      //     },
      //   });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ status: "0", message: (err as Error).message });
  }
};

/*----- LogIn -----*/
export const logIn = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      otp,
      authenticator_code,
      fcm_token,
      source,
      device_type,
      device_info,
    }: IUser = req.body;

    if (!email || !password || !device_info || !device_type) {
      return res
        .status(200)
        .send({ status: "0", message: "Please provide all field" });
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res
        .status(200)
        .send({ status: "0", message: "Please provide valid email address" });
    }

    //passwrod regex Capital letter + small letter + number + special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegex.test(password)){
      return res.status(200).send({
        status: "0",
        message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        user_id: true,
        password: true,
        isAuth: true,
        secret_key: true,
        login_count: true,
        lockout_time: true,
        otp_count: true,
        status: true,
        anti_phishing_code: true,
      },
    });

    // user not present
    if (!user) {
      return res
        .status(200)
        .send({ status: "0", message: "Invalid email address." });
    }
    if(user?.status == false) {
      return res.status(200).send({
        status: "0",
        message: "Login Disable.",
      });
    }
    var login_count = user?.login_count
    var otp_count = user?.otp_count

    // check if user is locked out
    if (user?.lockout_time != null && new Date() < user?.lockout_time) {
      return res.status(200).send({
        status: "0",
        message:
          "Your account is locked out until " +
          user?.lockout_time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      });
    } else if (user?.lockout_time !== null && new Date() > user?.lockout_time) {
      login_count = 0;
      otp_count = 0;
      await prisma.user.updateMany({
        where: { user_id: user.user_id },
        data: {
          login_count: 0,
          otp_count: 0,
          lockout_time: null,
        },
      });
    }
    // check password
    const same_password = await checkPassword(password, user.password);
    if (!same_password) {
      // throw new Error('Please provide correct password');
      if (login_count + 1 >= 3) {
        // adjust this value as needed
        const lockoutTime = new Date();
        lockoutTime.setMinutes(lockoutTime.getMinutes() + 1); // adjust this value as needed
        await prisma.user.updateMany({
          where: { user_id: user.user_id },
          data: {
            login_count: { increment: 1 },
            lockout_time: lockoutTime,
          },
        });
        return res
          .status(200).send({
            status: "0",
            message:
              "Your account is locked out for 1 minutes due to too many failed login attempts.",
          });
      } else {
        //   // increment login count
        await prisma.user.updateMany({
          where: { user_id: user.user_id },
          data: {
            login_count: { increment: 1 },
          },
        });
        return res
          .status(200)
          .send({ status: "0", message: "Please provide correct password" });
      }
    }
    
    const ip_address = req.headers["x-real-ip"] as string || (req.headers["x-forwarded-for"] as string).split(",")[0];
    // get client information
    const result: IClientInfo | undefined = await getClientInfo(ip_address,device_type,device_info);

    // check verified
    if (!otp) {
      await sendOTPVerificationEmail(email, result, user?.user_id,user?.anti_phishing_code as string);

      // if(!sentOtp?.verified){
      //   return res.status(200).send({
      //     status: "0",
      //     message: sentOtp?.msg,
      //   });
      // }

      return res.status(200).send({
        status: "1",
        message:
          "OTP has been sent to your email.",
        showAuth: user.isAuth === "Active" ? true : false,
        login:'no'
      });
    }

    if (user.isAuth === "Active") {
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
    const verifyOTP = await verifyOtp(user.user_id, otp);
    // if not verified
    if (!verifyOTP?.verified) {
      // throw new Error(verifyOTP?.msg);
      if (verifyOTP?.msg === "Invalid OTP") {
        if (otp_count + 1 >= 3) {
          // adjust this value as needed
          const lockoutTime = new Date();
          lockoutTime.setMinutes(lockoutTime.getMinutes() + 1); // adjust this value as needed
          await prisma.user.updateMany({
            where: { user_id: user.user_id },
            data: {
              otp_count: { increment: 1 },
              lockout_time: lockoutTime,
            },
          });
          return res
            .status(200).send({
              status: "0",
              message:
                "Your account is locked out for 1 minutes due to too many wrong OTP attempts.",
            });
        } else {
          //   // increment login count
          await prisma.user.updateMany({
            where: { user_id: user.user_id },
            data: {
              otp_count: { increment: 1 },
            },
          });
          return res.status(200).send({ status: "0", message: verifyOTP?.msg });
        }
      }
      return res.status(200).send({ status: "0", message: verifyOTP?.msg });
    }


    if (source.toUpperCase() === "APP") {
      await prisma.$queryRaw`
      UPDATE user SET fcm_token = ${fcm_token}
      WHERE user_id=${user.user_id};
    `;
    }

    // delete password from user object
    const logUser = { ...user } as IUserPartial;
    delete logUser.password;
    const token = await getToken(user.user_id);

    //update token in db
    await prisma.$queryRaw`
    UPDATE user SET token = ${token},
    login_count = 0,
    otp_count = 0,
    lockout_time = NULL
    WHERE user_id=${user.user_id};
  `;  

    await createActivityLog({
      user_id: user.user_id,
      ip_address: ip_address ?? "",
      activity_type: "Login",
      device_type: device_type ?? "",
      device_info: device_info ?? "",
      location: result?.location ?? "",
    });

    res.status(200).send({
      status: "1",
      // message: "User loggedIn Successfully",
      showAuth: logUser.isAuth === "Active" ? true : false,
      data: {
        user_id: user.user_id,
        token: token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "3", message: (err as Error).message });
  }
};

export const getuserProfile = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body.user;
    if (!user_id) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    const user = await prisma.user.findUnique({
      where: { user_id: user_id },
      select: {
        name: true,
        email: true,
        uid: true,
        withdrawal_password: true,
      },
    });
    if (!user) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    let withdrawal_password = false;
    if(user.withdrawal_password) {
      withdrawal_password = true;
    }
    const data = {
      name: user.name,
      email: user.email,
      uid: user.uid,
      withdrawal_password: withdrawal_password
    };
    res.status(200).send({ status: "1", message: "User found", data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "3", message: (err as Error).message });
  }
}

export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body.user;
    if (!user_id) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    const activity = await prisma.activity_logs.findMany({
      where: { user_id: user_id },
      select: {
        activity_type: true,
        ip_address: true,
        device_type: true,
        device_info: true,
        location: true,
        timestamp: true,
      },
      orderBy: { timestamp: "desc" },
      take: 10
    });
    if (!activity) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    res.status(200).send({ status: "1", message: "User found", data: activity });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "3", message: (err as Error).message });
  }
};  


export const setAntiPhisingCode = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body.user;
    const { anti_phishing_code } = req.body;
    if (!user_id) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    if (!anti_phishing_code) {
      return res.status(200).send({ status: "0", message: "Please provide anti phishing code" });
    }

    // anti phishing code regex numner and letter and length 8 -32
    const anti_phishing_code_regex = /^[a-zA-Z0-9]{8,32}$/;
    if (!anti_phishing_code_regex.test(anti_phishing_code)) {
      return res.status(200).send({ status: "0", message: "Anti phishing code should be number and letter only" });
    }

    await prisma.user.updateMany({
      where: { user_id: user_id },
      data: {
        anti_phishing_code: anti_phishing_code,
      },
    });
    res.status(200).send({ status: "1", message: "Anti phishing code set successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "3", message: (err as Error).message });
}
};  

export const logOut = async (req: Request, res: Response) => {
  try {
    console.log('in logout')
    const { user_id } = req.body.user;
    const { ip_address, device_type, device_info } = req.body;
    if (!ip_address || !device_type || !device_info) {
      return res.status(200).send({ status: "0", message: "Please provide all field" });
    }
    if (!user_id) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    await prisma.user.updateMany({
      where: { user_id: user_id },
      data: {
        token: null,
        token_string: "",
      },
    });

    const location:string = await getIplocation(ip_address);

    await createActivityLog({
      user_id: user_id,
      ip_address: ip_address ?? "",
      activity_type: "logout",
      device_type: device_type ?? "",
      device_info: device_info ?? "",
      location: location
    });

    res.status(200).send({ status: "1", message: "User logged out Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "3", message: (err as Error).message });
  }
};

/*----- 2FA Authentication Verification  -----*/
export const verifyAuth = async (req: Request, res: Response) => {
  try {
    const { user_id, authenticator_code } = req.body;

    if (!authenticator_code) {
      // throw new Error('Please provide Authenticator code');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide Authenticator code" });
    }

    // check user
    const user = await prisma.user.findFirst({
      where: { user_id: user_id },
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({ status: "3", message: "User not found" });
    }

    if (!authenticator_code) {
      // throw new Error('Please provide authenticator code first');
      return res.status(200).send({
        status: "0",
        message: "Please provide authenticator code first",
      });
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

    await prisma.user.updateMany({
      where: { user_id: user_id },
      data: { isAuth: "Active" },
    });

    res.status(200).json({
      status: "1",
      data: { email: user.email, token: user.token, date: Date.now() },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

/*----- 2FA Authentication and Otp Verification  -----*/
export const verifyOtpAuth = async (req: Request, res: Response) => {
  try {
    const {
      user_id: user_id,
      token: token,
      secret_key: secret_key,
    } = req.body.user;
    const { authenticator_code, otp, type } = req.body;

    // user not present
    if (!user_id) {
      // throw new Error('User not found');
      return res.status(400).send({ status: "3", message: "User not found" });
    }

    const upperType = type.toUpperCase();

    if (upperType === "OTP") {
      if (!otp) {
        // throw new Error('Please provide otp');
        return res
          .status(200)
          .send({ status: "0", message: "Please provide otp" });
      }

      // verify otp
      const verifyOTP = await verifyOtp(user_id, otp);

      // if not verified
      if (!verifyOTP?.verified) {
        // throw new Error(verifyOTP?.msg);
        return res.status(200).send({ status: "0", message: verifyOTP?.msg });
      }

      res.status(200).send({
        status: "1",
        message: "OTP verified",
      });
    } else if (upperType === "2FA") {
      if (!authenticator_code) {
        // throw new Error('Please provide authenticator code');
        return res
          .status(200)
          .send({ status: "0", message: "Please provide authenticator code" });
      }

      const verified = speakeasy.totp.verify({
        secret: JSON.parse(secret_key || "").base32,
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

      await prisma.user.updateMany({
        where: { user_id: user_id },
        data: { isAuth: "Active" },
      });

      res.status(200).json({
        status: "1",
        data: { user_id: user_id, token: token, date: Date.now() },
      });
    } else if (upperType === "BOTH") {
      if (!authenticator_code) {
        // throw new Error('Please provide authenticator code');
        return res
          .status(200)
          .send({ status: "0", message: "Please provide authenticator code" });
      }

      if (!otp) {
        // throw new Error('Please provide otp');
        return res
          .status(200)
          .send({ status: "0", message: "Please provide otp" });
      }

      const verified = speakeasy.totp.verify({
        secret: JSON.parse(secret_key || "").base32,
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

      // verify otp
      const verifyOTP = await verifyOtp(user_id, otp);

      // if not verified
      if (!verifyOTP?.verified) {
        // throw new Error(verifyOTP?.msg);
        return res.status(200).send({ status: "0", message: verifyOTP?.msg });
      }

      await prisma.user.updateMany({
        where: { user_id: user_id },
        data: { isAuth: "Active" },
      });

      res.status(200).json({
        status: "1",
        message: "OTP verified",
        data: { user_id: user_id, token: token, date: Date.now() },
      });
    } else {
      // throw new Error('Invalid verification type');
      return res
        .status(400)
        .send({ status: "3", message: "Invalid verification type" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

/*----- 2FA Authentication Data  -----*/
export const get2FaAuth = async (req: Request, res: Response) => {
  try {
    const { user_id: userId }: { user_id: string } = req.body.user;

    if (!userId) {
      return res.status(400).json({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }

    const user = await prisma.user.findFirst({
      where: { user_id: userId },
    });

    return res.status(200).json({
      status: "1",
      data: user?.isAuth === "Active" ? true : false,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

/*----- delete 2FA Authentication  -----*/
export const delete2FaAuth = async (req: Request, res: Response) => {
  try {
    const { user_id: userId }: { user_id: string } = req.body.user;
    const { password } = req.body;

    if (!password) {
      // throw new Error('Please provide password');
      return res
        .status(200)
        .json({ status: "0", message: "Please provide password" });
    }

    if (!userId) {
      return res.status(400).json({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }

    // check password
    if (password.length < 6) {
      // throw new Error('Password is too short!');
      return res
        .status(200)
        .json({ status: "0", message: "Password is too short!" });
    }
    // check user
    const user = await prisma.user.findFirst({
      where: { user_id: userId },
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({ status: "3", message: "User not found" });
    }

    // check password
    const same = await checkPassword(password, user.password);

    if (!same) {
      // throw new Error('Please provide correct password');
      return res
        .status(200).
        json({ status: "0", message: "Please provide correct password" });
    }

    await prisma.user.updateMany({
      where: { user_id: userId },
      data: {
        secret_key: null,
        isAuth: "Inactive",
      },
    });

    return res.status(200).json({
      status: "1",
      message: "Successfully deleted 2fa authentication",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

/*----- 2FA Authentication Generate  -----*/
export const generate2FaKey = async (req: Request, res: Response) => {
  try {
    const { user_id: userId } = req.body.user;

    if (!userId) {
      return res.status(400).send({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }

    // check user
    const user = await prisma.user.findFirst({
      where: { user_id: userId },
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({
        status: "3",
        message: "User not found",
      });
    };

    let secret;

    if (user.secret_key === null) {
      const temp_secret = speakeasy.generateSecret({
        length: 20,
        name: `BitzUp: ${user.email}`,
      });

      secret = JSON.stringify(temp_secret);

      await prisma.user.updateMany({
        where: { user_id: userId },
        data: { secret_key: secret },
      });
    } else {
      secret = user.secret_key;
    }

    res.status(200).json({
      status: "1",
      data: secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

/*----- Change password -----*/
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { old_password,new_password,confirm_new_password, otp,authenticator_code,device_type, device_info } = req.body;
    const user_id = req.body.user.user_id;

    if (!old_password || !new_password || !confirm_new_password || !device_type || !device_info) {
      return res.status(200).send({
        status: "0",
        message: "Please provide all field",
      });
    }

    // check password
    //passwrod regex Capital letter + small letter + number + special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(!passwordRegex.test(old_password)){
      return res.status(200).send({
        status: "0",
        message: "Invalid old password",
      });
    }

    if(!passwordRegex.test(new_password)){
      return res.status(200).send({
        status: "0",
        message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    }

    if (new_password !== confirm_new_password) {
      return res.status(200).send({
        status: "0",
        message: "New Password and Confirm New Password are not same"
      });
    }

    // check user
    const user = await prisma.user.findFirst({
      where: { user_id: user_id },
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({
        status: "3",
        message: "User not found",
      });
    }

    const same_password = await checkPassword(old_password, user.password);

    if (!same_password) {
      return res.status(200).send({
        status: "0",
        message: "Please provide correct old password",
      });
    }

    const ip_address = req.headers["x-real-ip"] as string || (req.headers["x-forwarded-for"] as string).split(",")[0];
    // get client information
    const result: IClientInfo | undefined = await getClientInfo(ip_address,device_type,device_info);
   console.log('otp',otp);
        // check verified
    if (!otp) {
      await sendOTPVerificationEmail(user.email, result, user.user_id,user?.anti_phishing_code as string);  

      return res.status(200).send({
        status: "1",
        message:
          "OTP has been sent to your email.",
        showAuth: user.isAuth === "Active" ? true : false,
        login:'no'
      });
    }

    if (user.isAuth === "Active") {
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
   console.log('userID',user.user_id);
    // verify otp
    const verifyOTP = await verifyOtp(user.user_id, otp);
    console.log('tituu',verifyOTP);
    // if not verified
    if (!verifyOTP?.verified) {
      return res.status(200).send({ status: "0", message: verifyOTP?.msg });
    }

      const hash = await bcrypt.hash(new_password, config.saltworkFactor);

      const token = await getToken(user.user_id);

      await prisma.user.updateMany({
        where: { user_id: user.user_id },
        data: { password: hash, token: token },
      });

 
      // activity log
      await prisma.activity_logs.create({
        data: {
          user_id: user.user_id,
          ip_address: ip_address,
          activity_type: "Change Password",
          device_type: device_type,
          device_info: device_info,
          location: result?.location as string
        },
      });

      res.status(200).json({
        status: "1",
        message: "password changed successfully",
        token: token
      });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

/*----- Forgot password -----*/
export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email, device_type, device_info }: IUser = req.body;

    if (!email || !device_type || !device_info) {
      // throw new Error('Please provide all field');
      return res.status(400).send({
        status: "3",
        message: "Please provide all field",
      });
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // throw new Error('Please provide valid email address');
      return res.status(200).send({
        status: "0",
        message: "Please provide valid email address",
      });
    }

    // check user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        email: true,
        anti_phishing_code: true,
      }
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(200).send({
        status: "0",
        message: "User not found",
      });
    }

    const ip_address =  req.headers['x-real-ip'] as string || req.headers['x-forwarded-for'] as string;

    const clientInfo = await getClientInfo(ip_address, device_type, device_info);
    // sending mail

    await sendOTPVerificationEmail(user.email, clientInfo, user.user_id,user?.anti_phishing_code as string);
  
    // activity logs
    await prisma.activity_logs.create({
      data: {
        user_id: user.user_id,
        ip_address: ip_address ?? "",
        activity_type: "Forgot Password",
        device_type: device_type ?? "",
        device_info: device_info ?? "",
        location: clientInfo?.location ?? ""
      }
    });

    return res.status(200).json({
      status: "1",
      message: "otp sent successfully",
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};

export const VerifyForgetPassword = async (req: Request, res: Response) => {
  try {
    const { new_password, confirm_new_password, otp, email, device_type, device_info } = req.body;
    if (!new_password || !confirm_new_password || !otp || !email  || !device_type || !device_info) {
      return res.status(200).send({
        status: "0",
        message: "Please provide all field",
      });
    }
    // check password
    if (new_password.length < 6) {
      return res.status(200).send({
        status: "0",
        message: "Old Password is too short! password must be of 6 length",
      });
    }
    if (otp.length !== 6) {
      return res.status(200).send({
        status: "0",
        message: "OTP is too short! OTP must be 6 char long",
      });
    }

    if (new_password !== confirm_new_password) {
      return res.status(200).send({
        status: "0",
        message: "New Password and Confirm New Password are not same"
      });
    }

    // check user
    const user = await prisma.user.findFirst({
      where: { email: email }
    });
   

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({
        status: "3",
        message: "User not found",
      });
    }

    const otpVerified = await verifyOtp(user.user_id, otp);

    if (!otpVerified?.verified) {
      return res.status(200).send({
        status: "0",
        message: otpVerified?.msg,
      });
    }
    if (otpVerified?.verified) {
      // Password hashed
      const hash = await bcrypt.hash(new_password, config.saltworkFactor);

      await prisma.user.updateMany({
        where: { user_id: user.user_id },
        data: { password: hash, token: null },
      });

      const ip_address =  req.headers['x-real-ip'] as string || req.headers['x-forwarded-for'] as string;
      const location:string = await getIplocation(ip_address);
      await prisma.activity_logs.create({
        data: {
          user_id: user.user_id,
          ip_address: ip_address,
          activity_type: "Change Password",
          device_type: device_type,
          device_info: device_info,
          location: location
        },
      });

      res.status(200).json({
        status: "1",
        message: "password changed successfully",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};





/*----- Get Country List  -----*/
export const getAllCountries = async (_req: Request, res: Response) => {
  try {
    // get client information
    // const result: IClientInfo | undefined = await getClientInfo(req);

    const countries = await prisma.countries.findMany({
      select: {
        name: true,
        phonecode: true,
      },
    });
    res.status(200).json({
      status: "1",
      message: "successfully fetched all countries",
      data: countries,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "0", message: (err as Error).message });
  }
};
