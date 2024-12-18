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
exports.verifyOTP = exports.sendOTP = void 0;
var utility_functions_1 = require("../utility/utility.functions");
var prisma_client_1 = require("../config/prisma.client");
var utility_functions_2 = require("../utility/utility.functions");
/*----- send OTP handler -----*/
var sendOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, subject, exist, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, subject = _a.subject;
                if (!email || !subject) {
                    throw new Error('Please provide all field');
                }
                // Check Email
                if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    throw new Error('Please provide valid email address');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findUnique({
                        where: { email: email },
                    })];
            case 1:
                exist = _b.sent();
                // user not present
                if (!exist) {
                    // throw new Error('User not found with this email Id');
                    return  res.status(200).send({ status: '0', message: 'Invalid email address.' });
                }
                return [4 /*yield*/, (0, utility_functions_1.getClientInfo)(req)];
            case 2:
                result = _b.sent();
                // send OTP email
                return [4 /*yield*/, prisma_client_1.prisma.otp.deleteMany({ where: { email: email } })];
            case 3:
                // send OTP email
                _b.sent();
                return [4 /*yield*/, (0, utility_functions_1.sendGeneralOTP)(email, subject, result)];
            case 4:
                _b.sent();
                res.status(200).send({
                    status: '1',
                    message: 'OTP send to your email plz check',
                });
                return [3 /*break*/, 6];
            case 5:
                err_1 = _b.sent();
                res.status(200).json({ status: '0', message: err_1.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.sendOTP = sendOTP;
/*----- verify OTP handler -----*/
var verifyOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user_id, email, otp, verifyOTP_1, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body.user, user_id = _a.id, email = _a.email;
                otp = req.body.otp;
                // validate user
                if (!user_id) {
                    return [2 /*return*/, res.json({
                            status: '0',
                            message: 'You are not authorized or user not present',
                        })];
                }
                if (!otp) {
                    throw new Error('Please provide otp');
                }
                return [4 /*yield*/, (0, utility_functions_2.verifyOtp)(email, otp)];
            case 1:
                verifyOTP_1 = _b.sent();
                // if not verified
                if (!(verifyOTP_1 === null || verifyOTP_1 === void 0 ? void 0 : verifyOTP_1.verified)) {
                    throw new Error(verifyOTP_1 === null || verifyOTP_1 === void 0 ? void 0 : verifyOTP_1.msg);
                }
                res.status(200).send({
                    status: '1',
                    message: 'OTP verified',
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _b.sent();
                res.status(200).json({ status: '0', message: err_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verifyOTP = verifyOTP;
