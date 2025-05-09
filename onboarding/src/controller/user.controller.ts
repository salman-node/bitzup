import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { createActivityLog } from '../utility/activity.log'
import { getIplocation } from "../utility/activity.log";
import { randomBytes } from "crypto";
import config from "../config/defaults";
import speakeasy from "speakeasy";
import { prisma } from "../config/prisma.client";
import { IClientInfo, IUser, IUserPartial } from "../types/models.types";
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
      otp_verify, // if no send otp , if yes already verified
      otp,
      device_type,
      ip_address,
      device_info
    }: IUser = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !country_code ||
      !password ||
      !otp_verify ||
      !device_type ||
      !ip_address ||
      !device_info
    ) {
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

    // check password
    if (password.length < 6) {
      // throw new Error(
      //   'Password is too short! password must be min 6 char long',
      // );
      return res.status(200).send({
        status: "0",
        message: "Password is too short! password must be min 6 char long",
      });
    }
    // Check user
    const user_exist = await prisma.user.findUnique({ where: { email }, select: { user_id: true } });
    if (user_exist) {
      return res
        .status(200)
        .send({ status: "0", message: "User already exist" });
    }

    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    if (otp_verify === "No") {
      const user_id = await generateUniqueId("U", 12);
      await prisma.otp.deleteMany({ where: { user_id: user_id } });
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

    if (!otp) {
      // throw new Error('Please provide otp first');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide otp first" });
    }

    var user_id: string;

    if (otp_verify == "Yes") {
      user_id = req.body.user_id;
    } else {
      user_id = "";
    }
    // verify otp

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

/*----- LogIn -----*/
export const logIn = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      otp_verify,
      otp,
      authenticator_code,
      fcm_token,
      source,
      ip_address,
      device_type,
      device_info,
    }: IUser = req.body;

    // const ip_address = req.headers[]

    if (!email || !password || !otp_verify || !device_info || !device_type || !ip_address) {
      // throw new Error('Please provide all field');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide all field" });
    }

    // Check Email
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      // throw new Error('Please provide valid email address');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide valid email address" });
    }

    // check password
    if (password.length < 6) {
      // throw new Error('Password is too short!')
      return res
        .status(200)
        .send({ status: "0", message: "Password is too short!" });
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
        otp_count: true
      },
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res
        .status(200)
        .send({ status: "0", message: "Invalid email address." });
    }
    var login_count = user?.login_count
    var otp_count = user?.otp_count

    // check if user is locked out
    if (user?.lockout_time != null && new Date() < user?.lockout_time) {
      return res.status(200).send({
        status: "0",
        message:
          "Your account is locked out until " +
          user?.lockout_time.toLocaleString(),
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
    // get client information
    const result: IClientInfo | undefined = await getClientInfo(req);

    // check verified
    if (otp_verify === "No") {
      await prisma.otp.deleteMany({ where: { user_id: user.user_id } });
      // send OTP email verification
      await sendOTPVerificationEmail(email, result, user.user_id);
      return res.status(200).send({
        status: "1",
        message:
          "OTP has been sent to your email.",
        showAuth: user.isAuth === "Active" ? true : false,
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

    if (!otp) {
      // throw new Error('Please provide otp');
      return res
        .status(200)
        .send({ status: "0", message: "Please provide otp" });
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
    // if(!fcm_token){
    //   throw new Error('FCM token is null');
    // }

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

    const location:string = await getIplocation(ip_address);

    await createActivityLog({
      user_id: user.user_id,
      ip_address: ip_address ?? "",
      activity_type: "Login",
      device_type: device_type ?? "",
      device_info: device_info ?? "",
      location: location
    });

    res.status(200).send({
      status: "1",
      message: "User loggedIn Successfully",
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
      },
    });
    if (!user) {
      return res.status(200).send({ status: "0", message: "User not found" });
    }
    res.status(200).send({ status: "1", message: "User found", data: user });
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

export const logOut = async (req: Request, res: Response) => {
  try {
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
    const { new_password, confirm_new_password, otp, email, ip_address, device_type, device_info } = req.body;

    if (!new_password || !confirm_new_password || !otp || !email || !ip_address || !device_type || !device_info) {
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
      where: { email: email },
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({
        status: "3",
        message: "User not found",
      });
    }

    const same_password = await checkPassword(new_password, user.password);

    if (same_password) {
      return res.status(200).send({
        status: "0",
        message: "Kuch naya password daal bhai, purana wala nahi chalega bro.",
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


      const location:string = await getIplocation(ip_address);
      // activity log
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

/*----- Forgot password -----*/
export const forgotPass = async (req: Request, res: Response) => {
  try {
    const { email, otp, ip_address, device_type, device_info }: IUser = req.body;

    if (!email || !otp || !ip_address || !device_type || !device_info) {
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
        email: true
      }
    });

    // user not present
    if (!user) {
      // throw new Error('User not found');
      return res.status(400).send({
        status: "3",
        message: "User not found",
      });
    }

    // verify otp
    const verifyOTP = await verifyOtp(user.user_id, otp);

    // if not verified
    if (!verifyOTP?.verified) {
      // throw new Error(verifyOTP?.msg);
      return res.status(200).send({
        status: "0",
        message: verifyOTP?.msg,
      });
    }

    const location:string = await getIplocation(ip_address);  
    // activity logs
    await prisma.activity_logs.create({
      data: {
        user_id: user.user_id,
        ip_address: ip_address ?? "",
        activity_type: "Forgot Password",
        device_type: device_type ?? "",
        device_info: device_info ?? "",
        location: location
      },
    })
    if (verifyOTP?.verified) {
      return res.status(200).json({
        status: "1",
        message: "Otp Verified Successfully",
      });
    }

    return res.status(400).json({
      status: "0",
      message: "Something went wrong",
    })

    // // Password hashed
    // const hash = await bcrypt.hash(randomGenPass, config.saltworkFactor);

    // // Update user password
    // const result = await prisma.user.update({
    //   where: { email: user.email },
    //   data: { password: hash },
    // });

    // get client information
    // const client_info: IClientInfo | undefined = await getClientInfo(req);

    // send user a mail
    // await sendEmail(user.email, randomGenPass, "", client_info);

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
