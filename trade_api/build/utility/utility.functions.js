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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.verifyToken = exports.getToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var defaults_1 = __importDefault(require("../config/defaults"));
var prisma_client_1 = require("../config/prisma_client");
var dotenv = require('dotenv');
;
dotenv.config();
/*----- Generate token -----*/
var getToken = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var token_data, token_string, email;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!defaults_1["default"].jwtsecret) {
                    throw new Error('JWT secret is not defined in the configuration.');
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findFirst({
                        where: {
                            user_id: user_id
                        },
                        select: {
                            token_string: true,
                            email: true
                        }
                    })];
            case 1:
                token_data = _a.sent();
                if (!token_data) {
                    throw new Error('User not found.');
                }
                token_string = token_data.token_string;
                email = token_data.email;
                return [2 /*return*/, jsonwebtoken_1["default"].sign({ token_string: token_string, email: email }, defaults_1["default"].jwtsecret, {
                        expiresIn: defaults_1["default"].jwtExp
                    })];
        }
    });
}); };
exports.getToken = getToken;
/*----- Verify token -----*/
var verifyToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!defaults_1["default"].jwtsecret) {
                        throw new Error('JWT secret is not defined in the configuration.');
                    }
                    jsonwebtoken_1["default"].verify(token, defaults_1["default"].jwtsecret, function (err, _decoded) { return __awaiter(void 0, void 0, void 0, function () {
                        var payload, user, newToken, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!defaults_1["default"].jwtsecret) {
                                        throw new Error('JWT secret is not defined in the configuration.');
                                    }
                                    payload = jsonwebtoken_1["default"].verify(token, defaults_1["default"].jwtsecret, {
                                        ignoreExpiration: true
                                    });
                                    if (typeof payload === 'string') {
                                        throw new Error('Token is not valid.');
                                    }
                                    if (!err) return [3 /*break*/, 9];
                                    if (!(err.name === 'TokenExpiredError')) return [3 /*break*/, 7];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 5, , 6]);
                                    return [4 /*yield*/, prisma_client_1.prisma.$queryRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            SELECT * from user where email = ", " and token_string = ", ";"], ["\n            SELECT * from user where email = ", " and token_string = ", ";"])), payload.email, payload.token_string)];
                                case 2:
                                    user = _a.sent();
                                    return [4 /*yield*/, (0, exports.getToken)(user.email)];
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
var templateObject_1, templateObject_2;
//# sourceMappingURL=utility.functions.js.map