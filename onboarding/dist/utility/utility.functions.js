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
exports.generateUniqueId = exports.sendNotification = exports.getClientInfo = exports.verifyOtp = exports.sendOTPVerificationEmail = exports.sendGeneralOTP = exports.checkPassword = exports.checkOtp = exports.verifyToken = exports.getToken = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const defaults_1 = __importDefault(require("../config/defaults"));
const prisma_client_1 = require("../config/prisma.client");
const mail_function_1 = __importStar(require("./mail.function"));
const admin = __importStar(require("firebase-admin"));
const dotenv = require('dotenv');
;
const node_device_detector_1 = __importDefault(require("node-device-detector"));
const geoip = __importStar(require("geoip-lite"));
const uuid_1 = require("uuid");
dotenv.config();
// created new detector object
const detector = new node_device_detector_1.default({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});
/*----- Generate token -----*/
const getToken = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!defaults_1.default.jwtsecret) {
        throw new Error('JWT secret is not defined in the configuration.');
    }
    // get token_string and email from user table
    const token_data = yield prisma_client_1.prisma.user.findFirst({
        where: {
            user_id: user_id,
        },
        select: {
            email: true
        }
    });
    if (!token_data) {
        throw new Error('User not found.');
    }
    const token_string = (0, crypto_1.randomBytes)(8).toString("hex");
    const email = token_data.email;
    yield prisma_client_1.prisma.user.updateMany({
        where: {
            user_id: user_id,
        },
        data: {
            token_string: token_string
        }
    });
    return jsonwebtoken_1.default.sign({ token_string: token_string, email: email }, defaults_1.default.jwtsecret, {
        expiresIn: defaults_1.default.jwtExp,
    });
});
exports.getToken = getToken;
/*----- Verify token -----*/
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (!defaults_1.default.jwtsecret) {
            throw new Error('JWT secret is not defined in the configuration.');
        }
        jsonwebtoken_1.default.verify(token, defaults_1.default.jwtsecret, (err, _decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (!defaults_1.default.jwtsecret) {
                throw new Error('JWT secret is not defined in the configuration.');
            }
            const payload = jsonwebtoken_1.default.verify(token, defaults_1.default.jwtsecret, {
                ignoreExpiration: true,
            });
            if (typeof payload === 'string') {
                throw new Error('Token is not valid.');
            }
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    throw new Error('session expired, please login again.');
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve(payload);
            }
        }));
    }));
});
exports.verifyToken = verifyToken;
/*----- Check OTP -----*/
const checkOtp = (otp, hashedOTP) => {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(otp, hashedOTP, (err, validOTP) => {
            if (err) {
                reject(err);
            }
            resolve(validOTP);
        });
    });
};
exports.checkOtp = checkOtp;
/*----- Check password -----*/
const checkPassword = (password, passwordHash) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        bcrypt_1.default.compare(password, passwordHash, (err, same) => {
            if (err) {
                reject(err);
            }
            resolve(same);
        });
    });
});
exports.checkPassword = checkPassword;
/*----- Send General OTP -----*/
const sendGeneralOTP = (email, subject, client_info, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
        const randomOTP = (0, crypto_1.randomBytes)(3).toString('hex');
        const hashedOTP = yield bcrypt_1.default.hash(randomOTP, defaults_1.default.saltworkFactor);
        // storing hashed OTP to db
        yield prisma_client_1.prisma.otp.create({
            data: {
                user_id,
                otp: hashedOTP,
                createdAt: Date.now().toString(),
                expiresAt: `${Date.now() + 300000}`,
            },
        });
        // sending OTP mail
        yield (0, mail_function_1.sendOTPEmail)(email, subject, randomOTP, client_info);
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.sendGeneralOTP = sendGeneralOTP;
/*----- Send OTP Verification Email -----*/
const sendOTPVerificationEmail = (email, client_info, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const randomOTP = `${Math.floor(100000 + Math.random() * 900000)}`;
        const randomOTP = (0, crypto_1.randomBytes)(3).toString('hex');
        const hashedOTP = yield bcrypt_1.default.hash(randomOTP, defaults_1.default.saltworkFactor);
        // storing hashed OTP to db
        yield prisma_client_1.prisma.otp.create({
            data: {
                user_id: user_id,
                otp: hashedOTP,
                createdAt: Date.now().toString(),
                expiresAt: `${Date.now() + 300000}`,
            },
        });
        // sending mail
        yield (0, mail_function_1.default)(email, '', randomOTP, client_info);
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.sendOTPVerificationEmail = sendOTPVerificationEmail;
/*----- Verify OTP -----*/
const verifyOtp = (user_id, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check OTP
        const userOtpRecord = yield prisma_client_1.prisma.otp.findFirst({
            where: { user_id: user_id },
        });
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
            yield prisma_client_1.prisma.otp.deleteMany({ where: { user_id: user_id } });
            return {
                verified: false,
                msg: 'OTP has expired. Please please sign up or log in again.',
            };
        }
        else {
            const validOTP = yield (0, exports.checkOtp)(otp, hashedOTP);
            if (!validOTP) {
                // supplied otp is wrong
                return {
                    verified: false,
                    msg: "Invalid OTP",
                };
            }
            else {
                // success
                yield prisma_client_1.prisma.otp.deleteMany({ where: { user_id: user_id } });
                return {
                    verified: true,
                    msg: 'User Account verified successfully',
                };
            }
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.verifyOtp = verifyOtp;
/*------ Get Client Information ------*/
const getClientInfo = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // const ip = req.ip.split(':');
        const ip = '237.84.2.178';
        const ipv4 = ip[ip.length - 1];
        const userAgent = req.get('user-agent');
        // destructure information from user-agent
        const result = detector.detect(userAgent);
        const location = geoip.lookup(ipv4);
        // client object
        const client_obj = {
            ip: ipv4,
            city: location === null || location === void 0 ? void 0 : location.city,
            region: location === null || location === void 0 ? void 0 : location.region,
            country_name: location === null || location === void 0 ? void 0 : location.country,
            os_name: result === null || result === void 0 ? void 0 : result.os.name,
            client_name: (_a = result === null || result === void 0 ? void 0 : result.client) === null || _a === void 0 ? void 0 : _a.name,
            client_type: (_b = result === null || result === void 0 ? void 0 : result.client) === null || _b === void 0 ? void 0 : _b.type,
            device_type: result === null || result === void 0 ? void 0 : result.device.type,
        };
        return client_obj;
    }
    catch (err) {
        console.log(err.message);
    }
});
exports.getClientInfo = getClientInfo;
/*------- Send Notifications --------*/
const sendNotification = (fcm_token, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!admin.apps.length) {
            const serviceAccount = {
                type: process.env.FIREBASE_TYPE || '',
                project_id: process.env.FIREBASE_PROJECT_ID || '',
                private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || '',
                private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
                client_email: process.env.FIREBASE_CLIENT_EMAIL || '',
                client_id: process.env.FIREBASE_CLIENT_ID || '',
                auth_uri: process.env.FIREBASE_AUTH_URI || '',
                token_uri: process.env.FIREBASE_TOKEN_URI || '',
                auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL || '',
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
        const response = yield admin.messaging().send({
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
    }
    catch (error) {
        console.log('Error in Sending Notifications: ', error, error.message);
        // return {
        //   verified: false,
        //   msg: (error as Error).message,
        // };
    }
});
exports.sendNotification = sendNotification;
const generateUniqueId = (prefix, length) => __awaiter(void 0, void 0, void 0, function* () {
    let uuid = (0, uuid_1.v4)().replace(/-/g, "");
    let uuidLength = length - prefix.length;
    let trimmedUuid = uuid.substring(0, uuidLength);
    return (prefix + trimmedUuid).toUpperCase();
});
exports.generateUniqueId = generateUniqueId;
//# sourceMappingURL=utility.functions.js.map