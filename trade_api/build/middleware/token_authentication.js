"use strict";
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
exports.__esModule = true;
exports.checkLogin = exports.verifyUser = void 0;
var utility_functions_1 = require("../utility/utility.functions");
var prisma_client_1 = require("../config/prisma_client");
// export const verifyUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const { authorization } = req.headers;
//     console.log({ authorization });
//     if (!authorization) {
//       // throw new Error('You are not authorized');
//       return res.status(400).json({ status: '3', message: 'You are not authorized' });
//     } else if (!authorization.startsWith('Bearer ')) {
//       // throw new Error('You are not authorized');
//       return res.status(400).send({ status: '3', message: 'You are not authorized' });
//     }
//     const token = authorization.split(' ')[1];
//     if (token === 'null' || token === '' || token === 'undefined') {
//       // throw new Error('Something went wrong Please try again!!');
//       return res.status(400).json({ status: '3', message: 'Something went wrong Please try again!!' });
//     }
//     const payload: any = await verifyToken(token);
//     if (!payload) {
//       // throw new Error('You are not authorized');
//       return res.status(400).json({ status: '3', message: 'You are not authorized' });
//     }
//     const user = await prisma.user.findFirst({
//       where: { email: payload.email },
//     });
//     // console.log('user', payload.user_id);
//     const authUser = { ...user };
//     delete authUser.password;
//     req.body.user = authUser;
//     next();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };
var verifyUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, token, payload, user, authUser, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                authorization = req.headers.authorization;
                if (!authorization) {
                    // throw new Error('You are not authorized');
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                else if (!authorization.startsWith('Bearer ')) {
                    // throw new Error('You are not authorized');
                    return [2 /*return*/, res.status(400).send({ status: '3', message: 'You are not authorized' })];
                }
                token = authorization.split(' ')[1];
                if (token === 'null' || token === '' || token === 'undefined') {
                    // throw new Error('Something went wrong Please try again!!');
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                return [4 /*yield*/, (0, utility_functions_1.verifyToken)(token)];
            case 1:
                payload = _a.sent();
                if (!payload) {
                    // throw new Error('You are not authorized');
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findFirst({
                        where: { email: payload.email }
                    })];
            case 2:
                user = _a.sent();
                if ((user === null || user === void 0 ? void 0 : user.token_string) !== payload.token_string) {
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                authUser = __assign({}, user);
                req.body.user = { user_id: authUser.user_id };
                next();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(500).json({ status: '0', message: err_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.verifyUser = verifyUser;
var checkLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorization, token, payload, user, authUser, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                authorization = req.headers.authorization;
                if (!authorization) {
                    // throw new Error('You are not authorized');
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                if (!authorization) return [3 /*break*/, 3];
                if (!authorization.startsWith('Bearer ')) {
                    // throw new Error('You are not authorized');
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                token = authorization.split(' ')[1];
                if (token === 'null' || token === '') {
                    // throw new Error('Something went wrong Please try again!!');
                    return [2 /*return*/, res.status(400).json({ status: '3', message: 'You are not authorized' })];
                }
                return [4 /*yield*/, (0, utility_functions_1.verifyToken)(token)];
            case 1:
                payload = _a.sent();
                if (!payload) {
                    // throw new Error('You are not authorized');
                    return [2 /*return*/, res.status(200).json({ status: '0', message: 'You are not authorized' })];
                }
                return [4 /*yield*/, prisma_client_1.prisma.user.findFirst({
                        where: { email: payload.email }
                    })];
            case 2:
                user = _a.sent();
                authUser = __assign({}, user);
                delete authUser.password;
                req.body.user = authUser;
                req.body.login = 'True';
                return [3 /*break*/, 4];
            case 3:
                req.body.login = 'False';
                _a.label = 4;
            case 4:
                next();
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(500).json({ status: '0', message: err_2.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.checkLogin = checkLogin;
// import { Request, Response, NextFunction } from 'express';
// import { string } from 'joi';
// import { verify } from 'jsonwebtoken';
// const db = require("../model/db_query");
// export const Authentication = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // getting token from req(header)
//         let token = req.headers["x-api-key"];
//         const user_id = req.params.user_id;
//         console.log(user_id);
//         let userId = user_id;
//         if (!user_id) {
//             const { user_id } = req.body;
//             userId = user_id;
//         }
//         console.log("userId : " + userId);
//         const GetSecretKey = await db.Get_Where_Universal_Data_Specific(
//             "tbl_user_key_details",
//             { cuser_id_btx: userId },
//             ["cuser_id_btx", "secret_key_btx"]
//         );
//         console.log("GetSecretKey : " + GetSecretKey[0]);
//         if (GetSecretKey.length == 0) {
//             return res.status(400).send({
//                 status_code: 400,
//                 status: false,
//                 msg: "Please login.",
//             });
//         }
//         if (!token) token = req.headers["X-Api-Key"];
//         if (!token) {
//             return res.status(400).send({ Error: "Enter x-api-key In Header" });
//         }
//         // token verification
//         let checktoken: any = verify(token, GetSecretKey[0].secret_key_btx);
//         if (!checktoken) {
//             return res.status(404).send({ Status: false, msg: "Enter Valid Token" });
//         }
//         // req.checktoken = checktoken;
//         next();
//     } catch (err) {
//         res.status(500).send({ msg: err.message });
//     }
// };
//# sourceMappingURL=token_authentication.js.map