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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTPEmail = void 0;
var axios_1 = require("axios");
var defaults_1 = require("../config/defaults");
var otp_template_1 = require("../views/otp.template");
var password_template_1 = require("../views/password.template");
/*----- Send Email -----*/
var sendEmail = function (to_1) {
    var args_1 = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args_1[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([to_1], args_1, true), void 0, function (to, randomGenPass, otp, client_info) {
        var data, config;
        if (randomGenPass === void 0) { randomGenPass = ''; }
        return __generator(this, function (_a) {
            data = JSON.stringify({
                from: {
                    address: 'noreply@bitzup.com',
                    name: 'BitzUp',
                },
                to: [
                    {
                        email_address: {
                            address: to,
                        },
                    },
                ],
                subject: randomGenPass
                    ? 'Password Successfully Updated'
                    : 'Verify Your Email',
                htmlbody: randomGenPass ? password_template_1.passwordTemplate : otp_template_1.otpTemplate,
                merge_info: {
                    email: to,
                    password: randomGenPass,
                    randomOTP: otp,
                    base_url: defaults_1.default.BASE_URL,
                    ip: client_info === null || client_info === void 0 ? void 0 : client_info.ip,
                    city: client_info === null || client_info === void 0 ? void 0 : client_info.city,
                    region: client_info === null || client_info === void 0 ? void 0 : client_info.region,
                    country_name: client_info === null || client_info === void 0 ? void 0 : client_info.country_name,
                    os_name: client_info === null || client_info === void 0 ? void 0 : client_info.os_name,
                    client_name: client_info === null || client_info === void 0 ? void 0 : client_info.client_name,
                    client_type: client_info === null || client_info === void 0 ? void 0 : client_info.client_type,
                    device: client_info === null || client_info === void 0 ? void 0 : client_info.device_type,
                },
            });
            config = {
                method: 'post',
                url: defaults_1.default.zepto_url,
                headers: {
                    Authorization: defaults_1.default.zoho_token,
                    'Content-Type': 'application/json',
                },
                data: data,
            };
            // Send request
            axios_1.default
                .request(config)
                .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
                .catch(function (error) {
                console.log(error);
            });
            return [2 /*return*/];
        });
    });
};
/*----- Send OTP Email -----*/
var sendOTPEmail = function (to, subject, otp, client_info) { return __awaiter(void 0, void 0, void 0, function () {
    var data, config;
    return __generator(this, function (_a) {
        data = JSON.stringify({
            from: {
                address: 'noreply@bitzup.com',
                name: 'BitzUp',
            },
            to: [
                {
                    email_address: {
                        address: to,
                    },
                },
            ],
            subject: subject,
            htmlbody: otp_template_1.otpTemplate,
            merge_info: {
                randomOTP: otp,
                base_url: defaults_1.default.BASE_URL,
                ip: client_info === null || client_info === void 0 ? void 0 : client_info.ip,
                city: client_info === null || client_info === void 0 ? void 0 : client_info.city,
                region: client_info === null || client_info === void 0 ? void 0 : client_info.region,
                country_name: client_info === null || client_info === void 0 ? void 0 : client_info.country_name,
                os_name: client_info === null || client_info === void 0 ? void 0 : client_info.os_name,
                client_name: client_info === null || client_info === void 0 ? void 0 : client_info.client_name,
                client_type: client_info === null || client_info === void 0 ? void 0 : client_info.client_type,
                device: client_info === null || client_info === void 0 ? void 0 : client_info.device_type,
            },
        });
        config = {
            method: 'post',
            url: defaults_1.default.zepto_url,
            headers: {
                Authorization: defaults_1.default.zoho_token,
                'Content-Type': 'application/json',
            },
            data: data,
        };
        // Send request
        axios_1.default
            .request(config)
            .then(function (response) {
            console.log(JSON.stringify(response.data));
        })
            .catch(function (error) {
            console.log(error);
        });
        return [2 /*return*/];
    });
}); };
exports.sendOTPEmail = sendOTPEmail;
exports.default = sendEmail;
