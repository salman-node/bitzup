"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = exports.getClientInfo = exports.verifyOtp = exports.sendOTPVerificationEmail = exports.sendGeneralOTP = exports.checkPassword = exports.checkOtp = exports.verifyToken = exports.getToken = void 0;
var bcrypt_1 = require("bcrypt");
var jsonwebtoken_1 = require("jsonwebtoken");
var crypto_1 = require("crypto");
var defaults_1 = require("../config/defaults");
var prisma_client_1 = require("../config/prisma.client");
var mail_function_1 = require("./mail.function");
var admin = require("firebase-admin");
var dotenv = require('dotenv');
;
var node_device_detector_1 = require("node-device-detector");
var geoip = require("geoip-lite");
dotenv.config();
// created new detector object
var detector = new node_device_detector_1.default({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
});
/*----- Generate token -----*/
var getToken = function (email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!defaults_1.default.jwtsecret) {
            throw new Error('JWT secret is not defined in the configuration.');
        }
        return [2 /*return*/, jsonwebtoken_1.default.sign({ email: email }, defaults_1.default.jwtsecret, {
                expiresIn: defaults_1.default.jwtExp,
            })];
    });
}); };
exports.getToken = getToken;
/*----- Verify token -----*/
/* export const verifyToken = async (token: string) => {
  console.log('verify token')
  
  if (!config.jwtsecret) {
    throw new Error('JWT secret is not defined in the configuration.');
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtsecret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
}; */
/*----- Verify token -----*/
var verifyToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!defaults_1.default.jwtsecret) {
                        throw new Error('JWT secret is not defined in the configuration.');
                    }
                    jsonwebtoken_1.default.verify(token, defaults_1.default.jwtsecret, function (err, _decoded) { return __awaiter(void 0, void 0, void 0, function () {
                        var payload, user, newToken, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!defaults_1.default.jwtsecret) {
                                        throw new Error('JWT secret is not defined in the configuration.');
                                    }
                                    payload = jsonwebtoken_1.default.verify(token, defaults_1.default.jwtsecret, {
                                        ignoreExpiration: true,
                                    });
                                    if (typeof payload === 'string') {
                                        throw new Error('Token is not valid.');
                                    }
                                    if (!err) return [3 /*break*/, 9];
                                    if (!(err.name === 'TokenExpiredError')) return [3 /*break*/, 7];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, prisma_client_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            SELECT * from user where email = ", ";"], ["\n            SELECT * from user where email = ", ";"])), payload.email)];
                                case 2:
                                    user = _a.sent();
                                    return [4 /*yield*/, (0, exports.getToken)(user[0].email)];
                                case 3:
                                    newToken = _a.sent();
                                    return [4 /*yield*/, prisma_client_1.prisma.$queryRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n            UPDATE user SET token = ", " where email = ", ";"], ["\n            UPDATE user SET token = ", " where email = ", ";"])), newToken, payload.email)];
                                case 4:
                                    _a.sent();
                                    resolve(payload);
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_1 = _a.sent();
                                    reject(error_1);
                                    return [3 /*break*/, 6];
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    reject(err);
                                    _a.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    resolve(payload);
                                    _a.label = 10;
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); })];
    });
}); };
exports.verifyToken = verifyToken;
/*----- Check OTP -----*/
var checkOtp = function (otp, hashedOTP) {
    return new Promise(function (resolve, reject) {
        bcrypt_1.default.compare(otp, hashedOTP, function (err, validOTP) {
            if (err) {
                reject(err);
            }
            resolve(validOTP);
        });
    });
};
exports.checkOtp = checkOtp;
/*----- Check password -----*/
var checkPassword = function (password, passwordHash) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                bcrypt_1.default.compare(password, passwordHash, function (err, same) {
                    if (err) {
                        reject(err);
                    }
                    resolve(same);
                });
            })];
    });
}); };
exports.checkPassword = checkPassword;
/*----- Send General OTP -----*/
var sendGeneralOTP = function (email, subject, client_info) { return __awaiter(void 0, void 0, void 0, function () {
    var randomOTP, hashedOTP, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                randomOTP = (0, crypto_1.randomBytes)(3).toString('hex');
                return [4 /*yield*/, bcrypt_1.default.hash(randomOTP, defaults_1.default.saltworkFactor)];
            case 1:
                hashedOTP = _a.sent();
                // storing hashed OTP to db
                return [4 /*yield*/, prisma_client_1.prisma.otp.create({
                        data: {
                            email: email,
                            opt: hashedOTP,
                            createdAt: Date.now().toString(),
                            expiresAt: "".concat(Date.now() + 300000),
                        },
                    })];
            case 2:
                // storing hashed OTP to db
                _a.sent();
                // sending OTP mail
                return [4 /*yield*/, (0, mail_function_1.sendOTPEmail)(email, subject, randomOTP, client_info)];
            case 3:
                // sending OTP mail
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log(err_1.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendGeneralOTP = sendGeneralOTP;
/*----- Send OTP Verification Email -----*/
var sendOTPVerificationEmail = function (email, client_info) { return __awaiter(void 0, void 0, void 0, function () {
    var randomOTP, hashedOTP, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                randomOTP = (0, crypto_1.randomBytes)(3).toString('hex');
                return [4 /*yield*/, bcrypt_1.default.hash(randomOTP, defaults_1.default.saltworkFactor)];
            case 1:
                hashedOTP = _a.sent();
                // storing hashed OTP to db
                return [4 /*yield*/, prisma_client_1.prisma.otp.create({
                        data: {
                            email: email,
                            opt: hashedOTP,
                            createdAt: Date.now().toString(),
                            expiresAt: "".concat(Date.now() + 300000),
                        },
                    })];
            case 2:
                // storing hashed OTP to db
                _a.sent();
                // sending mail
                return [4 /*yield*/, (0, mail_function_1.default)(email, '', randomOTP, client_info)];
            case 3:
                // sending mail
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                console.log(err_2.message);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.sendOTPVerificationEmail = sendOTPVerificationEmail;
/*----- Verify OTP -----*/
var verifyOtp = function (email, otp) { return __awaiter(void 0, void 0, void 0, function () {
    var userOtpRecord, expiresAt, hashedOTP, validOTP, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4 /*yield*/, prisma_client_1.prisma.otp.findFirst({
                        where: { email: email },
                    })];
            case 1:
                userOtpRecord = _a.sent();
                if (!userOtpRecord) {
                    return [2 /*return*/, {
                            verified: false,
                            msg: "Account record doesn't exist or has been verified already. please sign up or log in.",
                        }];
                }
                expiresAt = userOtpRecord.expiresAt;
                hashedOTP = userOtpRecord.opt;
                if (!(parseInt(expiresAt) < Date.now())) return [3 /*break*/, 3];
                // user otp has expired
                return [4 /*yield*/, prisma_client_1.prisma.otp.deleteMany({ where: { email: email } })];
            case 2:
                // user otp has expired
                _a.sent();
                return [2 /*return*/, {
                        verified: false,
                        msg: 'OTP has expired. Please please sign up or log in again.',
                    }];
            case 3: return [4 /*yield*/, (0, exports.checkOtp)(otp, hashedOTP)];
            case 4:
                validOTP = _a.sent();
                if (!!validOTP) return [3 /*break*/, 5];
                // supplied otp is wrong
                return [2 /*return*/, {
                        verified: false,
                        msg: 'Invalid OTP passed. Check your inbox.',
                    }];
            case 5: 
            // success
            return [4 /*yield*/, prisma_client_1.prisma.otp.deleteMany({ where: { email: email } })];
            case 6:
                // success
                _a.sent();
                return [2 /*return*/, {
                        verified: true,
                        msg: 'User Account verified successfully',
                    }];
            case 7: return [3 /*break*/, 9];
            case 8:
                err_3 = _a.sent();
                console.log(err_3.message);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtp = verifyOtp;
/*------ Get Client Information ------*/
var getClientInfo = function (req) { return __awaiter(void 0, void 0, void 0, function () {
    var ip, ipv4, userAgent, result, location_1, client_obj;
    var _a, _b;
    return __generator(this, function (_c) {
        try {
            ip = '237.84.2.178';
            ipv4 = ip[ip.length - 1];
            userAgent = req.get('user-agent');
            result = detector.detect(userAgent);
            location_1 = geoip.lookup(ipv4);
            client_obj = {
                ip: ipv4,
                city: location_1 === null || location_1 === void 0 ? void 0 : location_1.city,
                region: location_1 === null || location_1 === void 0 ? void 0 : location_1.region,
                country_name: location_1 === null || location_1 === void 0 ? void 0 : location_1.country,
                os_name: result === null || result === void 0 ? void 0 : result.os.name,
                client_name: (_a = result === null || result === void 0 ? void 0 : result.client) === null || _a === void 0 ? void 0 : _a.name,
                client_type: (_b = result === null || result === void 0 ? void 0 : result.client) === null || _b === void 0 ? void 0 : _b.type,
                device_type: result === null || result === void 0 ? void 0 : result.device.type,
            };
            return [2 /*return*/, client_obj];
        }
        catch (err) {
            console.log(err.message);
        }
        return [2 /*return*/];
    });
}); };
exports.getClientInfo = getClientInfo;
/*------- Send Notifications --------*/
var sendNotification = function (fcm_token, title, body) { return __awaiter(void 0, void 0, void 0, function () {
    var serviceAccount, response, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!admin.apps.length) {
                    serviceAccount = {
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
                return [4 /*yield*/, admin.messaging().send({
                        token: fcm_token,
                        notification: {
                            title: title,
                            body: body,
                        },
                        // data: {
                        //   click_action: 'YOUR_ACTION',
                        // },
                    })];
            case 1:
                response = _a.sent();
                // Handle the response
                console.log('Notification sent:', response);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.log('Error in Sending Notifications: ', error_2, error_2.message);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendNotification = sendNotification;
var templateObject_1, templateObject_2;
