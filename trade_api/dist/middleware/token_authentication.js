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
exports.checkLogin = exports.verifyUser = void 0;
const utility_functions_1 = require("../utility/utility.functions");
const prisma_client_1 = require("../config/prisma_client");
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
const verifyUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            // throw new Error('You are not authorized');
            return res.status(400).json({ status: '3', message: 'You are not authorized' });
        }
        else if (!authorization.startsWith('Bearer ')) {
            // throw new Error('You are not authorized');
            return res.status(400).send({ status: '3', message: 'You are not authorized' });
        }
        const token = authorization.split(' ')[1];
        if (token === 'null' || token === '' || token === 'undefined') {
            // throw new Error('Something went wrong Please try again!!');
            return res.status(400).json({ status: '3', message: 'You are not authorized' });
        }
        const payload = yield (0, utility_functions_1.verifyToken)(token);
        if (!payload) {
            // throw new Error('You are not authorized');
            return res.status(400).json({ status: '3', message: 'You are not authorized' });
        }
        const user = yield prisma_client_1.prisma.user.findFirst({
            where: { email: payload.email },
        });
        if ((user === null || user === void 0 ? void 0 : user.token_string) !== payload.token_string) {
            return res.status(400).json({ status: '3', message: 'You are not authorized' });
        }
        // console.log('user', payload.user_id);
        const authUser = Object.assign({}, user);
        req.body.user = { user_id: authUser.user_id };
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: '0', message: err.message });
    }
});
exports.verifyUser = verifyUser;
const checkLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            // throw new Error('You are not authorized');
            return res.status(400).json({ status: '3', message: 'You are not authorized' });
        }
        if (authorization) {
            if (!authorization.startsWith('Bearer ')) {
                // throw new Error('You are not authorized');
                return res.status(400).json({ status: '3', message: 'You are not authorized' });
            }
            const token = authorization.split(' ')[1];
            if (token === 'null' || token === '') {
                // throw new Error('Something went wrong Please try again!!');
                return res.status(400).json({ status: '3', message: 'You are not authorized' });
            }
            const payload = yield (0, utility_functions_1.verifyToken)(token);
            if (!payload) {
                // throw new Error('You are not authorized');
                return res.status(200).json({ status: '0', message: 'You are not authorized' });
            }
            const user = yield prisma_client_1.prisma.user.findFirst({
                where: { email: payload.email },
            });
            const authUser = Object.assign({}, user);
            delete authUser.password;
            req.body.user = authUser;
            req.body.login = 'True';
        }
        else {
            req.body.login = 'False';
        }
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: '0', message: err.message });
    }
});
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