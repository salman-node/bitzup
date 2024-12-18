"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.getAllCountries = exports.forgotPass = exports.changePassword = exports.generate2FaKey = exports.delete2FaAuth = exports.get2FaAuth = exports.verifyOtpAuth = exports.verifyAuth = exports.logIn = exports.signUp = void 0;
var bcrypt = require("bcrypt");
var crypto_1 = require("crypto");
var defaults_1 = require("../config/defaults");
var mail_function_1 = require("../utility/mail.function");
var speakeasy_1 = require("speakeasy");
var prisma_client_1 = require("../config/prisma.client");
var utility_functions_1 = require("../utility/utility.functions");
var utility_functions_2 = require("../utility/utility.functions");
/*----- SignUp -----*/
var signUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, phone, country_code, password, otp_verify, otp, country, exist, result, verifyOTP, hash, user, token, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 12, , 13]);
                _a = req.body, name_1 = _a.name, email = _a.email, phone = _a.phone, country_code = _a.country_code, password = _a.password, otp_verify = _a.otp_verify, otp = _a.otp;
                if (!name_1 ||
                    !email ||
                    !phone ||
                    !country_code ||
                    !password ||
                    !otp_verify) {
                    throw new Error('Please provide all field');
                }
                return [4 /*yield*/, prisma_client_1.prisma.countries.findFirst({
                        where: { phonecode: country_code },
                    })];
            case 1:
                country = _b.sent();
                if (!country) {
                    throw new Error('Country code invalid');
                }
                // Check Email
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    throw new Error('Please provide valid email address');
                }
                // Check Phone
                if (typeof parseInt(phone) !== 'string' && phone.trim().length < 5) {
                    throw new Error('Please provide valid phone number');
                }
                // check password
                if (password.length < 6) {
                    throw new Error('Password is too short! password must be min 6 char long');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({ where: { email: email } })];
            case 2:
                exist = _b.sent();
                if (exist) {
                    return [2 /*return*/, res
                            .status(200)
                            .send({ status: '0', message: 'User already exist' })];
                }
                return [4 /*yield*/, (0, utility_functions_2.getClientInfo)(req)];
            case 3:
                result = _b.sent();
                if (!(otp_verify === 'No')) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma_client_1.prisma.otp.deleteMany({ where: { email: email } })];
            case 4:
                _b.sent();
                // send OTP email verification
                return [4 /*yield*/, (0, utility_functions_2.sendOTPVerificationEmail)(email, result)];
            case 5:
                // send OTP email verification
                _b.sent();
                res.status(200).send({
                    status: '1',
                    message: 'OTP send to your email plz check',
                });
                return [2 /*return*/];
            case 6:
                if (!otp) {
                    throw new Error('Please provide otp first');
                }
                return [4 /*yield*/, (0, utility_functions_2.verifyOtp)(email, otp)];
            case 7:
                verifyOTP = _b.sent();
                // if not verified
                if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                    throw new Error(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg);
                }
                return [4 /*yield*/, bcrypt.hash(password, defaults_1.default.saltworkFactor)];
            case 8:
                hash = _b.sent();
                return [4 /*yield*/, prisma_client_1.prisma.user.create({
                        data: {
                            name: name_1,
                            email: email,
                            phone: phone,
                            country: country_code,
                            password: hash,
                        },
                    })];
            case 9:
                user = _b.sent();
                return [4 /*yield*/, (0, utility_functions_1.getToken)(user === null || user === void 0 ? void 0 : user.email)];
            case 10:
                token = _b.sent();
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: user.email },
                        data: { token: token },
                    })];
            case 11:
                _b.sent();
                res.status(200).send({
                    status: '1',
                    message: 'Successfully account created',
                    email: user.email,
                    token: token,
                });
                return [3 /*break*/, 13];
            case 12:
                err_1 = _b.sent();
                res.status(200).json({ status: '0', message: err_1.message });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.signUp = signUp;
/*----- LogIn -----*/
var logIn = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, otp_verify, otp, authenticator_code, fcm_token, source, user, same, result, verified, verifyOTP, logUser, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                _a = req.body, email = _a.email, password = _a.password, otp_verify = _a.otp_verify, otp = _a.otp, authenticator_code = _a.authenticator_code, fcm_token = _a.fcm_token, source = _a.source;
                if (!email || !password || !otp_verify) {
                    throw new Error('Please provide all field');
                }
                // Check Email
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    throw new Error('Please provide valid email address');
                }
                // check password
                if (password.length < 6)
                    throw new Error('Password is too short!');
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _b.sent();
                // user not present
                if (!user) {
                    throw new Error('User not found');
                }
                return [4 /*yield*/, (0, utility_functions_1.checkPassword)(password, user.password)];
            case 2:
                same = _b.sent();
                if (!same) {
                    throw new Error('Please provide correct password');
                }
                return [4 /*yield*/, (0, utility_functions_2.getClientInfo)(req)];
            case 3:
                result = _b.sent();
                if (!(otp_verify === 'No')) return [3 /*break*/, 6];
                return [4 /*yield*/, prisma_client_1.prisma.otp.deleteMany({ where: { email: email } })];
            case 4:
                _b.sent();
                // send OTP email verification
                return [4 /*yield*/, (0, utility_functions_2.sendOTPVerificationEmail)(email, result)];
            case 5:
                // send OTP email verification
                _b.sent();
                res.status(200).send({
                    status: '1',
                    message: 'Account need to be verified first for login. please check your email',
                    showAuth: user.isAuth === 'Active' ? true : false,
                });
                return [2 /*return*/];
            case 6:
                if (user.isAuth === 'Active') {
                    if (!authenticator_code) {
                        throw new Error('Please provide authenticator code');
                    }
                    verified = speakeasy_1.default.totp.verify({
                        secret: JSON.parse(user.secret_key || '').base32,
                        encoding: 'base32',
                        token: authenticator_code,
                        window: 1, // Number of 30-second intervals to check before and after the current time
                    });
                    if (!verified) {
                        throw new Error('Please provide correct authenticator code');
                    }
                }
                if (!otp) {
                    throw new Error('Please provide otp');
                }
                return [4 /*yield*/, (0, utility_functions_2.verifyOtp)(email, otp)];
            case 7:
                verifyOTP = _b.sent();
                // if not verified
                if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                    throw new Error(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg);
                }
                if (!(source.toUpperCase() === 'APP')) return [3 /*break*/, 9];
                return [4 /*yield*/, prisma_client_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      UPDATE user SET fcm_token = ", "\n      WHERE id=", ";\n    "], ["\n      UPDATE user SET fcm_token = ", "\n      WHERE id=", ";\n    "])), fcm_token, user.id)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                logUser = __assign({}, user);
                delete logUser.password;
                res.status(200).send({
                    status: '1',
                    message: 'User loggedIn Successfully',
                    showAuth: logUser.isAuth === 'Active' ? true : false,
                    data: {
                        email: logUser.email,
                        token: logUser.token,
                    },
                });
                return [3 /*break*/, 11];
            case 10:
                err_2 = _b.sent();
                res.status(200).json({ status: '0', message: err_2.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.logIn = logIn;
/*----- 2FA Authentication Verification  -----*/
var verifyAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, authenticator_code, user, verified, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, authenticator_code = _a.authenticator_code;
                if (!authenticator_code) {
                    throw new Error('Please provide Authenticator code');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _b.sent();
                // user not present
                if (!user) {
                    throw new Error('User not found');
                }
                if (!authenticator_code) {
                    throw new Error('Please provide authenticator code first');
                }
                verified = speakeasy_1.default.totp.verify({
                    secret: JSON.parse(user.secret_key || '').base32,
                    encoding: 'base32',
                    token: authenticator_code,
                    window: 1, // Number of 30-second intervals to check before and after the current time
                });
                if (!verified) {
                    throw new Error('Please provide correct authenticator code');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: user.email },
                        data: { isAuth: 'Active' },
                    })];
            case 2:
                _b.sent();
                res.status(200).json({
                    status: '1',
                    data: { email: user.email, token: user.token, date: Date.now() },
                });
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                console.log(err_3.message);
                res.status(200).json({ status: '0', message: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyAuth = verifyAuth;
/*----- 2FA Authentication and Otp Verification  -----*/
var verifyOtpAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, email, token, secret_key, _b, authenticator_code, otp, type, upperType, verifyOTP, verified, verified, verifyOTP, err_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 9, , 10]);
                _a = req.body.user, user_id = _a.id, email = _a.email, token = _a.token, secret_key = _a.secret_key;
                _b = req.body, authenticator_code = _b.authenticator_code, otp = _b.otp, type = _b.type;
                // user not present
                if (!user_id) {
                    throw new Error('User not found');
                }
                upperType = type.toUpperCase();
                if (!(upperType === 'OTP')) return [3 /*break*/, 2];
                if (!otp) {
                    throw new Error('Please provide otp');
                }
                return [4 /*yield*/, (0, utility_functions_2.verifyOtp)(email, otp)];
            case 1:
                verifyOTP = _c.sent();
                // if not verified
                if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                    throw new Error(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg);
                }
                res.status(200).send({
                    status: '1',
                    message: 'OTP verified',
                });
                return [3 /*break*/, 8];
            case 2:
                if (!(upperType === '2FA')) return [3 /*break*/, 4];
                if (!authenticator_code) {
                    throw new Error('Please provide authenticator code');
                }
                verified = speakeasy_1.default.totp.verify({
                    secret: JSON.parse(secret_key || '').base32,
                    encoding: 'base32',
                    token: authenticator_code,
                    window: 1, // Number of 30-second intervals to check before and after the current time
                });
                if (!verified) {
                    throw new Error('Please provide correct authenticator code');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: email },
                        data: { isAuth: 'Active' },
                    })];
            case 3:
                _c.sent();
                res.status(200).json({
                    status: '1',
                    data: { email: email, token: token, date: Date.now() },
                });
                return [3 /*break*/, 8];
            case 4:
                if (!(upperType === 'BOTH')) return [3 /*break*/, 7];
                if (!authenticator_code) {
                    throw new Error('Please provide authenticator code');
                }
                if (!otp) {
                    throw new Error('Please provide otp');
                }
                verified = speakeasy_1.default.totp.verify({
                    secret: JSON.parse(secret_key || '').base32,
                    encoding: 'base32',
                    token: authenticator_code,
                    window: 1, // Number of 30-second intervals to check before and after the current time
                });
                if (!verified) {
                    throw new Error('Please provide correct authenticator code');
                }
                return [4 /*yield*/, (0, utility_functions_2.verifyOtp)(email, otp)];
            case 5:
                verifyOTP = _c.sent();
                // if not verified
                if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                    throw new Error(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg);
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: email },
                        data: { isAuth: 'Active' },
                    })];
            case 6:
                _c.sent();
                res.status(200).json({
                    status: '1',
                    message: 'OTP verified',
                    data: { email: email, token: token, date: Date.now() },
                });
                return [3 /*break*/, 8];
            case 7: throw new Error('Invalid verification type');
            case 8: return [3 /*break*/, 10];
            case 9:
                err_4 = _c.sent();
                console.log(err_4.message);
                res.status(200).json({ status: '0', message: err_4.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.verifyOtpAuth = verifyOtpAuth;
/*----- 2FA Authentication Data  -----*/
var get2FaAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                userId = req.body.user.id;
                if (!userId) {
                    return [2 /*return*/, res.json({
                            status: '0',
                            message: 'You are not authorized or user not present',
                        })];
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { id: userId },
                    })];
            case 1:
                user = _a.sent();
                res.status(200).json({
                    status: '1',
                    data: (user === null || user === void 0 ? void 0 : user.isAuth) === 'Active' ? true : false,
                });
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                res.status(200).json({ status: '0', message: err_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.get2FaAuth = get2FaAuth;
/*----- delete 2FA Authentication  -----*/
var delete2FaAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, password, user, same, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = req.body.user.id;
                password = req.body.password;
                if (!password) {
                    throw new Error('Please provide password');
                }
                if (!userId) {
                    return [2 /*return*/, res.json({
                            status: '0',
                            message: 'You are not authorized or user not present',
                        })];
                }
                // check password
                if (password.length < 6)
                    throw new Error('Password is too short!');
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { id: userId },
                    })];
            case 1:
                user = _a.sent();
                // user not present
                if (!user) {
                    throw new Error('User not found');
                }
                return [4 /*yield*/, (0, utility_functions_1.checkPassword)(password, user.password)];
            case 2:
                same = _a.sent();
                if (!same) {
                    throw new Error('Please provide correct password');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { id: userId },
                        data: {
                            secret_key: null,
                            isAuth: 'Inactive',
                        },
                    })];
            case 3:
                _a.sent();
                res.status(200).json({
                    status: '1',
                    message: 'Successfully deleted 2fa authentication',
                });
                return [3 /*break*/, 5];
            case 4:
                err_6 = _a.sent();
                console.log(err_6.message);
                res.status(200).json({ status: '0', message: err_6.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.delete2FaAuth = delete2FaAuth;
/*----- 2FA Authentication Generate  -----*/
var generate2FaKey = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, email, user, secret, temp_secret, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body.user, userId = _a.id, email = _a.email;
                if (!userId) {
                    return [2 /*return*/, res.json({
                            status: '0',
                            message: 'You are not authorized or user not present',
                        })];
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _b.sent();
                // user not present
                if (!user) {
                    throw new Error('User not found');
                }
                secret = void 0;
                if (!(user.secret_key === null)) return [3 /*break*/, 3];
                temp_secret = speakeasy_1.default.generateSecret({
                    length: 20,
                    name: "BitzUp: ".concat(user.email),
                });
                secret = JSON.stringify(temp_secret);
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: user.email },
                        data: { secret_key: secret },
                    })];
            case 2:
                _b.sent();
                return [3 /*break*/, 4];
            case 3:
                secret = user.secret_key;
                _b.label = 4;
            case 4:
                res.status(200).json({
                    status: '1',
                    data: secret,
                });
                return [3 /*break*/, 6];
            case 5:
                err_7 = _b.sent();
                res.status(200).json({ status: '0', message: err_7.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.generate2FaKey = generate2FaKey;
/*----- Change password -----*/
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, old_password, new_password, email, user, same, hash, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, old_password = _a.old_password, new_password = _a.new_password;
                email = req.body.user.email;
                // check password
                if (old_password.length < 6) {
                    throw new Error('Old Password is too short! password must be min 6 char long');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                user = _b.sent();
                // user not present
                if (!user) {
                    throw new Error('User not found');
                }
                return [4 /*yield*/, (0, utility_functions_1.checkPassword)(old_password, user.password)];
            case 2:
                same = _b.sent();
                if (!same) {
                    throw new Error('Please provide correct password');
                }
                // check password
                if (new_password.length < 6) {
                    throw new Error('New Password is too short! password must be min 6 char long');
                }
                return [4 /*yield*/, bcrypt.hash(new_password, defaults_1.default.saltworkFactor)];
            case 3:
                hash = _b.sent();
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: user.email },
                        data: { password: hash },
                    })];
            case 4:
                _b.sent();
                res.status(200).json({
                    status: '1',
                    message: 'Successfully Reset your Account Password',
                });
                return [3 /*break*/, 6];
            case 5:
                err_8 = _b.sent();
                res.status(200).json({ status: '0', message: err_8.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
/*----- Forgot password -----*/
var forgotPass = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var randomGenPass, _a, email, otp, user, verifyOTP, hash, result, client_info, err_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                randomGenPass = (0, crypto_1.randomBytes)(8).toString('hex');
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                _a = req.body, email = _a.email, otp = _a.otp;
                if (!email || !otp) {
                    throw new Error('Please provide all field');
                }
                // Check Email
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    throw new Error('Please provide valid email address');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 2:
                user = _b.sent();
                // user not present
                if (!user) {
                    throw new Error('User not found');
                }
                return [4 /*yield*/, (0, utility_functions_2.verifyOtp)(email, otp)];
            case 3:
                verifyOTP = _b.sent();
                // if not verified
                if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
                    throw new Error(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg);
                }
                return [4 /*yield*/, bcrypt.hash(randomGenPass, defaults_1.default.saltworkFactor)];
            case 4:
                hash = _b.sent();
                return [4 /*yield*/, prisma_client_1.prisma.user.update({
                        where: { email: user.email },
                        data: { password: hash },
                    })];
            case 5:
                result = _b.sent();
                return [4 /*yield*/, (0, utility_functions_2.getClientInfo)(req)];
            case 6:
                client_info = _b.sent();
                // send user a mail
                return [4 /*yield*/, (0, mail_function_1.default)(user.email, randomGenPass, '', client_info)];
            case 7:
                // send user a mail
                _b.sent();
                res.status(200).json({
                    status: '1',
                    message: 'Please Check Your Registered Email',
                    email: result.email,
                });
                return [3 /*break*/, 9];
            case 8:
                err_9 = _b.sent();
                res.status(200).json({ status: '0', message: err_9.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.forgotPass = forgotPass;
/*----- Get Country List  -----*/
var getAllCountries = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var countries, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma_client_1.prisma.countries.findMany({
                        select: {
                            name: true,
                            phonecode: true,
                        },
                    })];
            case 1:
                countries = _a.sent();
                res.status(200).json({
                    status: '1',
                    message: 'successfully fetched all countries',
                    data: countries,
                });
                return [3 /*break*/, 3];
            case 2:
                err_10 = _a.sent();
                res.status(200).json({ status: '0', message: err_10.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllCountries = getAllCountries;
var templateObject_1;
