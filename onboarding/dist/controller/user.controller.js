"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCountries = exports.VerifyForgetPassword = exports.forgotPass = exports.changePassword = exports.generate2FaKey = exports.delete2FaAuth = exports.get2FaAuth = exports.verifyOtpAuth = exports.verifyAuth = exports.logOut = exports.setAntiPhisingCode = exports.getUserActivity = exports.getuserProfile = exports.logIn = exports.getReferralCodeURl = exports.signUp = void 0;
const bcrypt = __importStar(require("bcrypt"));
const activity_log_1 = require("../utility/activity.log");
const activity_log_2 = require("../utility/activity.log");
const crypto_1 = require("crypto");
const defaults_1 = __importDefault(require("../config/defaults"));
const speakeasy_1 = __importDefault(require("speakeasy"));
const prisma_client_1 = require("../config/prisma.client");
const axios_1 = __importDefault(require("axios"));
const utility_functions_1 = require("../utility/utility.functions");
const utility_functions_2 = require("../utility/utility.functions");
// import { json } from "stream/consumers";
function generate9DigitUID() {
    return Math.floor(100000000 + Math.random() * 900000000);
}
/*----- SignUp -----*/
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, country_code, password, otp, device_type, device_info } = req.body;
        if (!name ||
            !email ||
            !phone ||
            !country_code ||
            !password ||
            !device_type ||
            !device_info) {
            // throw new Error('Please provide all field');
            return res
                .status(400)
                .send({ status: "3", message: "Please provide all field" });
        }
        // Check country
        const country = yield prisma_client_1.prisma.countries.findFirst({
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
        if (!passwordRegex.test(password)) {
            return res.status(200).send({
                status: "0",
                message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
        }
        // Check user
        const user_exist = yield prisma_client_1.prisma.user.findUnique({ where: { email }, select: { user_id: true } });
        if (user_exist) {
            return res
                .status(200)
                .send({ status: "0", message: "User already exist" });
        }
        const ip_address = req.headers['x-real-ip'] || req.headers['x-forwarded-for'].split(',')[0];
        // get client information
        const result = yield (0, utility_functions_2.getClientInfo)(ip_address, device_type, device_info);
        if (!otp) {
            const user_id = yield (0, utility_functions_1.generateUniqueId)("U", 12);
            // send OTP email verification
            yield (0, utility_functions_2.sendOTPVerificationEmail)(email, result, user_id);
            return res.status(200).send({
                status: "1",
                message: "OTP send to your email plz check",
                data: {
                    user_id: user_id,
                },
            });
        }
        var user_id;
        user_id = req.body.user_id;
        if (!user_id) {
            return res.status(500).send({ status: "0", message: "internal server error" });
        }
        const verifyOTP = yield (0, utility_functions_2.verifyOtp)(user_id, otp);
        // if not verified
        if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
            // throw new Error(verifyOTP?.msg);
            return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
        }
        const tokenString = (0, crypto_1.randomBytes)(8).toString("hex");
        // Password hashed
        const hashed_password = yield bcrypt.hash(password, defaults_1.default.saltworkFactor);
        // Creating user
        yield prisma_client_1.prisma.user.create({
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
        const ipLocation = yield (0, activity_log_2.getIplocation)(ip_address);
        yield (0, activity_log_1.createActivityLog)({
            user_id: user_id,
            ip_address: ip_address !== null && ip_address !== void 0 ? ip_address : "",
            activity_type: "Sign Up",
            device_type: device_type !== null && device_type !== void 0 ? device_type : "",
            device_info: device_info !== null && device_info !== void 0 ? device_info : "",
            location: ipLocation
        });
        return res.status(200).send({
            status: "1",
            message: "Successfully account created",
            user_id: user_id,
        });
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ status: "0", message: err.message });
    }
});
exports.signUp = signUp;
const getReferralCodeURl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield axios_1.default.post(defaults_1.default.BRANCH_URL, {
            branch_key: defaults_1.default.BRANCH_API_KEY,
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
                referral_code: user_id,
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
    }
    catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ status: "0", message: err.message });
    }
});
exports.getReferralCodeURl = getReferralCodeURl;
/*----- LogIn -----*/
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, password, otp, authenticator_code, fcm_token, source, device_type, device_info, } = req.body;
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
        if (!passwordRegex.test(password)) {
            return res.status(200).send({
                status: "0",
                message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
        }
        // check user
        const user = yield prisma_client_1.prisma.user.findUnique({
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
        if ((user === null || user === void 0 ? void 0 : user.status) == false) {
            return res.status(200).send({
                status: "0",
                message: "Login Disable.",
            });
        }
        var login_count = user === null || user === void 0 ? void 0 : user.login_count;
        var otp_count = user === null || user === void 0 ? void 0 : user.otp_count;
        // check if user is locked out
        if ((user === null || user === void 0 ? void 0 : user.lockout_time) != null && new Date() < (user === null || user === void 0 ? void 0 : user.lockout_time)) {
            return res.status(200).send({
                status: "0",
                message: "Your account is locked out until " +
                    (user === null || user === void 0 ? void 0 : user.lockout_time.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
            });
        }
        else if ((user === null || user === void 0 ? void 0 : user.lockout_time) !== null && new Date() > (user === null || user === void 0 ? void 0 : user.lockout_time)) {
            login_count = 0;
            otp_count = 0;
            yield prisma_client_1.prisma.user.updateMany({
                where: { user_id: user.user_id },
                data: {
                    login_count: 0,
                    otp_count: 0,
                    lockout_time: null,
                },
            });
        }
        // check password
        const same_password = yield (0, utility_functions_1.checkPassword)(password, user.password);
        if (!same_password) {
            // throw new Error('Please provide correct password');
            if (login_count + 1 >= 3) {
                // adjust this value as needed
                const lockoutTime = new Date();
                lockoutTime.setMinutes(lockoutTime.getMinutes() + 1); // adjust this value as needed
                yield prisma_client_1.prisma.user.updateMany({
                    where: { user_id: user.user_id },
                    data: {
                        login_count: { increment: 1 },
                        lockout_time: lockoutTime,
                    },
                });
                return res
                    .status(200).send({
                    status: "0",
                    message: "Your account is locked out for 1 minutes due to too many failed login attempts.",
                });
            }
            else {
                //   // increment login count
                yield prisma_client_1.prisma.user.updateMany({
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
        const ip_address = req.headers["x-real-ip"] || req.headers["x-forwarded-for"].split(",")[0];
        // get client information
        const result = yield (0, utility_functions_2.getClientInfo)(ip_address, device_type, device_info);
        // check verified
        if (!otp) {
            yield (0, utility_functions_2.sendOTPVerificationEmail)(email, result, user === null || user === void 0 ? void 0 : user.user_id, user === null || user === void 0 ? void 0 : user.anti_phishing_code);
            // if(!sentOtp?.verified){
            //   return res.status(200).send({
            //     status: "0",
            //     message: sentOtp?.msg,
            //   });
            // }
            return res.status(200).send({
                status: "1",
                message: "OTP has been sent to your email.",
                showAuth: user.isAuth === "Active" ? true : false,
                login: 'no'
            });
        }
        if (user.isAuth === "Active") {
            if (!authenticator_code) {
                // throw new Error('Please provide authenticator code');
                return res
                    .status(200)
                    .send({ status: "0", message: "Please provide authenticator code" });
            }
            const verified = speakeasy_1.default.totp.verify({
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
        const verifyOTP = yield (0, utility_functions_2.verifyOtp)(user.user_id, otp);
        // if not verified
        if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
            // throw new Error(verifyOTP?.msg);
            if ((verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg) === "Invalid OTP") {
                if (otp_count + 1 >= 3) {
                    // adjust this value as needed
                    const lockoutTime = new Date();
                    lockoutTime.setMinutes(lockoutTime.getMinutes() + 1); // adjust this value as needed
                    yield prisma_client_1.prisma.user.updateMany({
                        where: { user_id: user.user_id },
                        data: {
                            otp_count: { increment: 1 },
                            lockout_time: lockoutTime,
                        },
                    });
                    return res
                        .status(200).send({
                        status: "0",
                        message: "Your account is locked out for 1 minutes due to too many wrong OTP attempts.",
                    });
                }
                else {
                    //   // increment login count
                    yield prisma_client_1.prisma.user.updateMany({
                        where: { user_id: user.user_id },
                        data: {
                            otp_count: { increment: 1 },
                        },
                    });
                    return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
                }
            }
            return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
        }
        if (source.toUpperCase() === "APP") {
            yield prisma_client_1.prisma.$queryRaw `
      UPDATE user SET fcm_token = ${fcm_token}
      WHERE user_id=${user.user_id};
    `;
        }
        // delete password from user object
        const logUser = Object.assign({}, user);
        delete logUser.password;
        const token = yield (0, utility_functions_1.getToken)(user.user_id);
        //update token in db
        yield prisma_client_1.prisma.$queryRaw `
    UPDATE user SET token = ${token},
    login_count = 0,
    otp_count = 0,
    lockout_time = NULL
    WHERE user_id=${user.user_id};
  `;
        yield (0, activity_log_1.createActivityLog)({
            user_id: user.user_id,
            ip_address: ip_address !== null && ip_address !== void 0 ? ip_address : "",
            activity_type: "Login",
            device_type: device_type !== null && device_type !== void 0 ? device_type : "",
            device_info: device_info !== null && device_info !== void 0 ? device_info : "",
            location: (_a = result === null || result === void 0 ? void 0 : result.location) !== null && _a !== void 0 ? _a : "",
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "3", message: err.message });
    }
});
exports.logIn = logIn;
const getuserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body.user;
        if (!user_id) {
            return res.status(200).send({ status: "0", message: "User not found" });
        }
        const user = yield prisma_client_1.prisma.user.findUnique({
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
        if (user.withdrawal_password) {
            withdrawal_password = true;
        }
        const data = {
            name: user.name,
            email: user.email,
            uid: user.uid,
            withdrawal_password: withdrawal_password
        };
        res.status(200).send({ status: "1", message: "User found", data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "3", message: err.message });
    }
});
exports.getuserProfile = getuserProfile;
const getUserActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body.user;
        if (!user_id) {
            return res.status(200).send({ status: "0", message: "User not found" });
        }
        const activity = yield prisma_client_1.prisma.activity_logs.findMany({
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "3", message: err.message });
    }
});
exports.getUserActivity = getUserActivity;
const setAntiPhisingCode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield prisma_client_1.prisma.user.updateMany({
            where: { user_id: user_id },
            data: {
                anti_phishing_code: anti_phishing_code,
            },
        });
        res.status(200).send({ status: "1", message: "Anti phishing code set successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "3", message: err.message });
    }
});
exports.setAntiPhisingCode = setAntiPhisingCode;
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('in logout');
        const { user_id } = req.body.user;
        const { ip_address, device_type, device_info } = req.body;
        if (!ip_address || !device_type || !device_info) {
            return res.status(200).send({ status: "0", message: "Please provide all field" });
        }
        if (!user_id) {
            return res.status(200).send({ status: "0", message: "User not found" });
        }
        yield prisma_client_1.prisma.user.updateMany({
            where: { user_id: user_id },
            data: {
                token: null,
                token_string: "",
            },
        });
        const location = yield (0, activity_log_2.getIplocation)(ip_address);
        yield (0, activity_log_1.createActivityLog)({
            user_id: user_id,
            ip_address: ip_address !== null && ip_address !== void 0 ? ip_address : "",
            activity_type: "logout",
            device_type: device_type !== null && device_type !== void 0 ? device_type : "",
            device_info: device_info !== null && device_info !== void 0 ? device_info : "",
            location: location
        });
        res.status(200).send({ status: "1", message: "User logged out Successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "3", message: err.message });
    }
});
exports.logOut = logOut;
/*----- 2FA Authentication Verification  -----*/
const verifyAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, authenticator_code } = req.body;
        if (!authenticator_code) {
            // throw new Error('Please provide Authenticator code');
            return res
                .status(200)
                .send({ status: "0", message: "Please provide Authenticator code" });
        }
        // check user
        const user = yield prisma_client_1.prisma.user.findFirst({
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
        const verified = speakeasy_1.default.totp.verify({
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
        yield prisma_client_1.prisma.user.updateMany({
            where: { user_id: user_id },
            data: { isAuth: "Active" },
        });
        res.status(200).json({
            status: "1",
            data: { email: user.email, token: user.token, date: Date.now() },
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.verifyAuth = verifyAuth;
/*----- 2FA Authentication and Otp Verification  -----*/
const verifyOtpAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id: user_id, token: token, secret_key: secret_key, } = req.body.user;
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
            const verifyOTP = yield (0, utility_functions_2.verifyOtp)(user_id, otp);
            // if not verified
            if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                // throw new Error(verifyOTP?.msg);
                return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
            }
            res.status(200).send({
                status: "1",
                message: "OTP verified",
            });
        }
        else if (upperType === "2FA") {
            if (!authenticator_code) {
                // throw new Error('Please provide authenticator code');
                return res
                    .status(200)
                    .send({ status: "0", message: "Please provide authenticator code" });
            }
            const verified = speakeasy_1.default.totp.verify({
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
            yield prisma_client_1.prisma.user.updateMany({
                where: { user_id: user_id },
                data: { isAuth: "Active" },
            });
            res.status(200).json({
                status: "1",
                data: { user_id: user_id, token: token, date: Date.now() },
            });
        }
        else if (upperType === "BOTH") {
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
            const verified = speakeasy_1.default.totp.verify({
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
            const verifyOTP = yield (0, utility_functions_2.verifyOtp)(user_id, otp);
            // if not verified
            if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                // throw new Error(verifyOTP?.msg);
                return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
            }
            yield prisma_client_1.prisma.user.updateMany({
                where: { user_id: user_id },
                data: { isAuth: "Active" },
            });
            res.status(200).json({
                status: "1",
                message: "OTP verified",
                data: { user_id: user_id, token: token, date: Date.now() },
            });
        }
        else {
            // throw new Error('Invalid verification type');
            return res
                .status(400)
                .send({ status: "3", message: "Invalid verification type" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.verifyOtpAuth = verifyOtpAuth;
/*----- 2FA Authentication Data  -----*/
const get2FaAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id: userId } = req.body.user;
        if (!userId) {
            return res.status(400).json({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        const user = yield prisma_client_1.prisma.user.findFirst({
            where: { user_id: userId },
        });
        return res.status(200).json({
            status: "1",
            data: (user === null || user === void 0 ? void 0 : user.isAuth) === "Active" ? true : false,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.get2FaAuth = get2FaAuth;
/*----- delete 2FA Authentication  -----*/
const delete2FaAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id: userId } = req.body.user;
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
        const user = yield prisma_client_1.prisma.user.findFirst({
            where: { user_id: userId },
        });
        // user not present
        if (!user) {
            // throw new Error('User not found');
            return res.status(400).send({ status: "3", message: "User not found" });
        }
        // check password
        const same = yield (0, utility_functions_1.checkPassword)(password, user.password);
        if (!same) {
            // throw new Error('Please provide correct password');
            return res
                .status(200).
                json({ status: "0", message: "Please provide correct password" });
        }
        yield prisma_client_1.prisma.user.updateMany({
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.delete2FaAuth = delete2FaAuth;
/*----- 2FA Authentication Generate  -----*/
const generate2FaKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id: userId } = req.body.user;
        if (!userId) {
            return res.status(400).send({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        // check user
        const user = yield prisma_client_1.prisma.user.findFirst({
            where: { user_id: userId },
        });
        // user not present
        if (!user) {
            // throw new Error('User not found');
            return res.status(400).send({
                status: "3",
                message: "User not found",
            });
        }
        ;
        let secret;
        if (user.secret_key === null) {
            const temp_secret = speakeasy_1.default.generateSecret({
                length: 20,
                name: `BitzUp: ${user.email}`,
            });
            secret = JSON.stringify(temp_secret);
            yield prisma_client_1.prisma.user.updateMany({
                where: { user_id: userId },
                data: { secret_key: secret },
            });
        }
        else {
            secret = user.secret_key;
        }
        res.status(200).json({
            status: "1",
            data: secret,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.generate2FaKey = generate2FaKey;
/*----- Change password -----*/
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { old_password, new_password, confirm_new_password, otp, authenticator_code, device_type, device_info } = req.body;
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
        if (!passwordRegex.test(old_password)) {
            return res.status(200).send({
                status: "0",
                message: "Invalid old password",
            });
        }
        if (!passwordRegex.test(new_password)) {
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
        const user = yield prisma_client_1.prisma.user.findFirst({
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
        const same_password = yield (0, utility_functions_1.checkPassword)(old_password, user.password);
        if (!same_password) {
            return res.status(200).send({
                status: "0",
                message: "Please provide correct old password",
            });
        }
        const ip_address = req.headers["x-real-ip"] || req.headers["x-forwarded-for"].split(",")[0];
        // get client information
        const result = yield (0, utility_functions_2.getClientInfo)(ip_address, device_type, device_info);
        console.log('otp', otp);
        // check verified
        if (!otp) {
            yield (0, utility_functions_2.sendOTPVerificationEmail)(user.email, result, user.user_id, user === null || user === void 0 ? void 0 : user.anti_phishing_code);
            return res.status(200).send({
                status: "1",
                message: "OTP has been sent to your email.",
                showAuth: user.isAuth === "Active" ? true : false,
                login: 'no'
            });
        }
        if (user.isAuth === "Active") {
            if (!authenticator_code) {
                // throw new Error('Please provide authenticator code');
                return res
                    .status(200)
                    .send({ status: "0", message: "Please provide authenticator code" });
            }
            const verified = speakeasy_1.default.totp.verify({
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
        console.log('userID', user.user_id);
        // verify otp
        const verifyOTP = yield (0, utility_functions_2.verifyOtp)(user.user_id, otp);
        console.log('tituu', verifyOTP);
        // if not verified
        if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
            return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
        }
        const hash = yield bcrypt.hash(new_password, defaults_1.default.saltworkFactor);
        const token = yield (0, utility_functions_1.getToken)(user.user_id);
        yield prisma_client_1.prisma.user.updateMany({
            where: { user_id: user.user_id },
            data: { password: hash, token: token },
        });
        // activity log
        yield prisma_client_1.prisma.activity_logs.create({
            data: {
                user_id: user.user_id,
                ip_address: ip_address,
                activity_type: "Change Password",
                device_type: device_type,
                device_info: device_info,
                location: result === null || result === void 0 ? void 0 : result.location
            },
        });
        res.status(200).json({
            status: "1",
            message: "password changed successfully",
            token: token
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.changePassword = changePassword;
/*----- Forgot password -----*/
const forgotPass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { email, device_type, device_info } = req.body;
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
        const user = yield prisma_client_1.prisma.user.findUnique({
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
        const ip_address = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
        const clientInfo = yield (0, utility_functions_2.getClientInfo)(ip_address, device_type, device_info);
        // sending mail
        yield (0, utility_functions_2.sendOTPVerificationEmail)(user.email, clientInfo, user.user_id, user === null || user === void 0 ? void 0 : user.anti_phishing_code);
        // activity logs
        yield prisma_client_1.prisma.activity_logs.create({
            data: {
                user_id: user.user_id,
                ip_address: ip_address !== null && ip_address !== void 0 ? ip_address : "",
                activity_type: "Forgot Password",
                device_type: device_type !== null && device_type !== void 0 ? device_type : "",
                device_info: device_info !== null && device_info !== void 0 ? device_info : "",
                location: (_b = clientInfo === null || clientInfo === void 0 ? void 0 : clientInfo.location) !== null && _b !== void 0 ? _b : ""
            }
        });
        return res.status(200).json({
            status: "1",
            message: "otp sent successfully",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.forgotPass = forgotPass;
const VerifyForgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { new_password, confirm_new_password, otp, email, device_type, device_info } = req.body;
        if (!new_password || !confirm_new_password || !otp || !email || !device_type || !device_info) {
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
        const user = yield prisma_client_1.prisma.user.findFirst({
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
        const otpVerified = yield (0, utility_functions_2.verifyOtp)(user.user_id, otp);
        if (!(otpVerified === null || otpVerified === void 0 ? void 0 : otpVerified.verified)) {
            return res.status(200).send({
                status: "0",
                message: otpVerified === null || otpVerified === void 0 ? void 0 : otpVerified.msg,
            });
        }
        if (otpVerified === null || otpVerified === void 0 ? void 0 : otpVerified.verified) {
            // Password hashed
            const hash = yield bcrypt.hash(new_password, defaults_1.default.saltworkFactor);
            yield prisma_client_1.prisma.user.updateMany({
                where: { user_id: user.user_id },
                data: { password: hash, token: null },
            });
            const ip_address = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
            const location = yield (0, activity_log_2.getIplocation)(ip_address);
            yield prisma_client_1.prisma.activity_logs.create({
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.VerifyForgetPassword = VerifyForgetPassword;
/*----- Get Country List  -----*/
const getAllCountries = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get client information
        // const result: IClientInfo | undefined = await getClientInfo(req);
        const countries = yield prisma_client_1.prisma.countries.findMany({
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
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: "0", message: err.message });
    }
});
exports.getAllCountries = getAllCountries;
//# sourceMappingURL=user.controller.js.map