"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendEmailOtp = exports.sendOTP = void 0;
const utility_functions_1 = require("../utility/utility.functions");
const prisma_client_1 = require("../config/prisma.client");
const utility_functions_2 = require("../utility/utility.functions");
/*----- send OTP handler -----*/
const sendOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, subject, ip_address, device_type, device_info } = req.body;
        if (!email || !subject || !ip_address || !device_type || !device_info) {
            // throw new Error('Please provide all field');
            return res.status(400).send({
                status: '3',
                message: "Please provide all field"
            });
        }
        // Check Email
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            // throw new Error('Please provide valid email address');
            return res.status(200).send({
                status: '0',
                message: "Please provide valid email address"
            });
        }
        // check user
        const exist = yield prisma_client_1.prisma.user.findUnique({
            where: { email },
            select: { user_id: true },
        });
        // user not present
        if (!exist) {
            // throw new Error('User not found with this email Id');
            return res.status(200).send({
                status: '0',
                message: "Invalid email address"
            });
        }
        // get client information
        const result = yield (0, utility_functions_1.getClientInfo)(req);
        // send OTP email
        yield prisma_client_1.prisma.otp.deleteMany({ where: { user_id: exist.user_id } });
        yield (0, utility_functions_1.sendGeneralOTP)(email, subject, result, exist.user_id);
        yield prisma_client_1.prisma.activity_logs.create({
            data: {
                user_id: exist.user_id,
                ip_address,
                device_type,
                device_info,
                activity_type: 'Send OTP',
            },
        });
        return res.status(200).send({
            status: '1',
            message: 'OTP send to your email plz check',
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: '0', message: err.message });
    }
});
exports.sendOTP = sendOTP;
const sendEmailOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, subject, ip_address, device_type, device_info } = req.body;
        if (!user_id || !subject || !ip_address || !device_type || !device_info) {
            // throw new Error('Please provide all field');
            return res.status(400).send({
                status: '3',
                message: "Please provide all field"
            });
        }
        // check user
        const userEmail = yield prisma_client_1.prisma.user.findFirst({
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
            });
        }
        // get client information
        const result = yield (0, utility_functions_1.getClientInfo)(req);
        // send OTP email
        yield prisma_client_1.prisma.otp.deleteMany({ where: { user_id: user_id } });
        yield (0, utility_functions_1.sendGeneralOTP)(userEmail.email, subject, result, user_id);
        yield prisma_client_1.prisma.activity_logs.create({
            data: {
                user_id: user_id,
                ip_address,
                device_type,
                device_info,
                activity_type: 'Send OTP on email',
            },
        });
        return res.status(200).send({
            status: '1',
            message: 'OTP send to your email plz check',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ status: '0', message: err.message });
    }
});
exports.sendEmailOtp = sendEmailOtp;
/*----- verify OTP handler -----*/
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: user_id, email: email } = req.body.user;
        const { otp, ip_address, device_type, device_info } = req.body;
        // validate user
        if (!user_id || !email || !otp || !ip_address || !device_type || !device_info) {
            return res.status(200).send({
                status: '0',
                message: 'Please provide all field',
            });
        }
        // verify otp
        const verifyOTP = yield (0, utility_functions_2.verifyOtp)(email, otp);
        // if not verified
        if (!(verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.verified)) {
            // throw new Error(verifyOTP?.msg);
            return res.status(200).send({
                status: '0',
                message: verifyOTP === null || verifyOTP === void 0 ? void 0 : verifyOTP.msg,
            });
        }
        yield prisma_client_1.prisma.activity_logs.create({
            data: {
                user_id: user_id,
                ip_address,
                device_type,
                device_info,
                activity_type: 'Verify OTP',
            },
        });
        return res.status(200).send({
            status: '1',
            message: 'OTP verified',
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: '0', message: err.message });
    }
});
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=otp.controller.js.map