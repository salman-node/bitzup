"use strict";
//remove all teh variables which are not used
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
exports.generateWithdrawalPassword = exports.withdrawalHistory = exports.withdrawFunds = void 0;
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const defaults_1 = __importDefault(require("../config/defaults"));
;
const activity_logs_1 = require("../utility/activity.logs");
const utility_functions_1 = require("../utility/utility.functions");
const speakeasy_1 = __importDefault(require("speakeasy"));
const utility_functions_2 = require("../utility/utility.functions");
const prisma = new client_1.PrismaClient();
// import winston from "winston";
const { v4: uuidv4 } = require('uuid');
function generateTransactionId() {
    return uuidv4().replace(/-/g, ''); // Remove hyphens
}
const withdrawFunds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { user_id } = req.body.user;
    const { chain_id, otp, authenticator_code, password, address, amount, currency_id, device_info, device_type } = req.body;
    if (!chain_id || !address || !amount || !currency_id || !device_info || !device_type) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: "Please provide all field",
        });
    }
    const user = yield prisma.user.findFirst({
        where: {
            user_id: user_id,
        },
        select: {
            withdrawal_password: true,
            withdrawal_pass_locktime: true,
            email: true,
            isAuth: true,
            user_id: true,
            secret_key: true,
            anti_phishing_code: true,
        }
    });
    console.log("user", user);
    if ((user === null || user === void 0 ? void 0 : user.withdrawal_password) == null) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: "0",
            withdrawal_password: false
        });
    }
    if ((user === null || user === void 0 ? void 0 : user.isAuth) === "Inactive") {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
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
    const currencyData = yield prisma.currencies.findFirst({
        where: {
            currency_id: currency_id,
        },
    });
    if (!currencyData) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: "Currency not found",
        });
    }
    const withdrawal_status = currencyData === null || currencyData === void 0 ? void 0 : currencyData.withdraw;
    const withdrawal_fee = currencyData === null || currencyData === void 0 ? void 0 : currencyData.withdrawl_fees;
    if (!withdrawal_status || withdrawal_status === "Inactive") {
        // return res.status(400).json({ status: '0', message: 'Withdrawal is inactive for this currency' });
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'Withdrawal is inactive for this currency',
        });
    }
    const userKycLevel = yield prisma.user.findFirst({
        where: {
            user_id: user_id,
        },
        select: {
            kyc_level: true,
        }
    });
    const userKycLevelData = userKycLevel === null || userKycLevel === void 0 ? void 0 : userKycLevel.kyc_level;
    const levelColumn = `withdraw_Limit_L${userKycLevelData}`;
    console.log("userKycLevelData", levelColumn);
    //get withdrawal limit according to user level
    const userWithdrawalLimit = yield prisma.withdrawal_limit.findFirst({
        where: {
            currency_id: currency_id,
        },
        select: {
            [levelColumn]: true,
        }
    });
    console.log("userWithdrawalLimit", userWithdrawalLimit);
    const withdrawalLimit = userWithdrawalLimit === null || userWithdrawalLimit === void 0 ? void 0 : userWithdrawalLimit[levelColumn];
    if (!withdrawalLimit) {
        return res.status(defaults_1.default.HTTP_SERVER_ERROR).send({
            status_code: defaults_1.default.HTTP_SERVER_ERROR,
            status: 0,
            message: "Withdrawal limit not found",
        });
    }
    const userWithdrawalAmount = yield prisma.$queryRaw `
      SELECT SUM(amount) AS amount
      FROM withdrawl_history
      WHERE user_id = ${user_id}
        AND coin_id = ${currency_id}
        AND created_at >= NOW() - INTERVAL 1 DAY;
    `;
    const userWithdrawalAmountData = ((_a = userWithdrawalAmount[0]) === null || _a === void 0 ? void 0 : _a.amount) || 0;
    const totalWithdrawalAmount = Number(userWithdrawalAmountData) + Number(amount);
    console.log("userWithdrawalAmountData", userWithdrawalAmountData);
    console.log("totalWithdrawalAmount", totalWithdrawalAmount);
    console.log("withdrawalLimit", withdrawalLimit);
    if (totalWithdrawalAmount > Number(withdrawalLimit)) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'Withdrawal limit exceeded.',
        });
    }
    const ip_address = req.headers["x-real-ip"] || req.headers["x-forwarded-for"].split(",")[0];
    // get client information
    const result = yield (0, utility_functions_1.getClientInfo)(ip_address, device_type, device_info);
    if (!otp) {
        yield (0, utility_functions_2.sendOTPVerificationEmail)(user === null || user === void 0 ? void 0 : user.email, result, user === null || user === void 0 ? void 0 : user.user_id, user === null || user === void 0 ? void 0 : user.anti_phishing_code);
        return res.status(200).send({
            status: "1",
            message: "OTP has been sent to your email.",
            showAuth: (user === null || user === void 0 ? void 0 : user.isAuth) === "Active" ? true : false,
            verify: 'no'
        });
    }
    if (!password) {
        return res.status(200).send({
            status: "0",
            message: 'Please provide password'
        });
    }
    const comparPassword = bcrypt.compare(password, user === null || user === void 0 ? void 0 : user.withdrawal_password);
    if (!comparPassword) {
        return res.status(200).send({
            status: "0",
            message: 'Incorrect password'
        });
    }
    if ((user === null || user === void 0 ? void 0 : user.isAuth) === "Active") {
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
    const verifyOTP = yield (0, utility_functions_1.verifyOtp)(user === null || user === void 0 ? void 0 : user.user_id, otp);
    // if not verified
    if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
        return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
    }
    //get user balance from balances table
    const userAssetBalance = yield prisma.balances.findMany({
        where: {
            user_id: user_id,
            currency_id: currency_id,
        },
        select: {
            current_balance: true,
        },
    });
    if (!userAssetBalance.length) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: "User balance not found",
        });
    }
    const userBalance = userAssetBalance[0].current_balance;
    //check if user has sufficient balance
    if (Number(userBalance) < Number(amount)) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: "Insufficient balance",
        });
    }
    //withdrawal fees is in % , reduce it from the amount
    const calculatedFee = (Number(amount) * Number(withdrawal_fee)) / 100;
    const finalWithdrawalAmount = Number(amount) - Number(calculatedFee);
    //debit balance of user from tbl_user_crypto_assets_balance_details
    yield prisma.balances.update({
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
    yield prisma.withdrawl_history.create({
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
    yield (0, activity_logs_1.createActivityLog)({
        user_id: user_id,
        ip_address: ip_address !== null && ip_address !== void 0 ? ip_address : "",
        activity_type: "Withdrawal",
        device_type: device_type !== null && device_type !== void 0 ? device_type : "",
        device_info: device_info !== null && device_info !== void 0 ? device_info : "",
        location: (_b = result === null || result === void 0 ? void 0 : result.location) !== null && _b !== void 0 ? _b : "",
    });
    return res.status(defaults_1.default.HTTP_SUCCESS).send({
        status_code: defaults_1.default.HTTP_SUCCESS,
        status: "1",
        message: 'Withdrawal request has been created successfully',
        Data: {
            transaction_id: transaction_id,
            withdrawal_amount: amount,
            final_amount: finalWithdrawalAmount,
            fees: calculatedFee,
        }
    });
});
exports.withdrawFunds = withdrawFunds;
const withdrawalHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body.user;
    if (!user_id) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'User not found',
        });
    }
    // prisam raw query to join 2 tables and get symbol from currencies table where coin_id = currencies.currency_id and chain_id = networks.id
    const withdrawalHistory = yield prisma.$queryRaw `
    SELECT w.*, c.symbol, n.chain_name as network_name, n.id,n.netw_fee as network_fee FROM withdrawl_history w
    JOIN currencies c ON w.coin_id = c.currency_id
    JOIN chains n ON w.chain_id = n.id
    WHERE w.user_id = ${user_id}
    ORDER BY w.date DESC;`;
    if (withdrawalHistory.length === 0) {
        return res.status(defaults_1.default.HTTP_SUCCESS).send({
            status_code: defaults_1.default.HTTP_SUCCESS,
            status: 0,
            message: 'No withdrawal history found',
        });
    }
    return res.status(defaults_1.default.HTTP_SUCCESS).send({
        status_code: defaults_1.default.HTTP_SUCCESS,
        status: '1',
        message: 'Withdrawal history fetched successfully',
        data: withdrawalHistory
    });
});
exports.withdrawalHistory = withdrawalHistory;
const generateWithdrawalPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { password, otp, authenticator_code, device_info, device_type } = req.body;
    const { user_id: user_id } = req.body.user;
    try {
        if (!user_id) {
            return res.status(400).send({
                status: "3",
                message: "You are not authorized or user not present",
            });
        }
        if (!password) {
            return res.status(400).send({
                status: "3",
                message: "provide password",
            });
        }
        //passwrod regex Capital letter + small letter + number + special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(200).send({
                status: "0",
                message: "Password should be minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
            });
        }
        const user = yield prisma.user.findUnique({
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
        const ip_address = req.headers["x-real-ip"] || req.headers["x-forwarded-for"].split(",")[0];
        // get client information
        const result = yield (0, utility_functions_1.getClientInfo)(ip_address, device_type, device_info);
        if (!otp) {
            yield (0, utility_functions_2.sendOTPVerificationEmail)(user === null || user === void 0 ? void 0 : user.email, result, user === null || user === void 0 ? void 0 : user.user_id, user === null || user === void 0 ? void 0 : user.anti_phishing_code);
            return res.status(200).send({
                status: "1",
                message: "OTP has been sent to your email.",
                showAuth: (user === null || user === void 0 ? void 0 : user.isAuth) === "Active" ? true : false,
                verify: 'no'
            });
        }
        if ((user === null || user === void 0 ? void 0 : user.isAuth) === "Active") {
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
        const verifyOTP = yield (0, utility_functions_1.verifyOtp)(user === null || user === void 0 ? void 0 : user.user_id, otp);
        // if not verified
        if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
            return res.status(200).send({ status: "0", message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg });
        }
        const passwordHash = yield bcrypt.hash(password, 10);
        yield prisma.user.update({
            where: {
                user_id: user_id,
            },
            data: {
                withdrawal_password: passwordHash,
                withdrawal_pass_locktime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });
        yield (0, activity_logs_1.createActivityLog)({
            user_id: user === null || user === void 0 ? void 0 : user.user_id,
            ip_address: ip_address !== null && ip_address !== void 0 ? ip_address : "",
            activity_type: "Login",
            device_type: device_type !== null && device_type !== void 0 ? device_type : "",
            device_info: device_info !== null && device_info !== void 0 ? device_info : "",
            location: (_c = result === null || result === void 0 ? void 0 : result.location) !== null && _c !== void 0 ? _c : "",
        });
        return res.status(200).json({
            status: "1",
            message: "Withdrawal password updated successfully, you can withdraw after 24 hours once password updated",
        });
    }
    catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).send({
            status: "0",
            message: "Unable to fetch data from Binance API",
        });
    }
});
exports.generateWithdrawalPassword = generateWithdrawalPassword;
//# sourceMappingURL=withdrawal.controller.js.map