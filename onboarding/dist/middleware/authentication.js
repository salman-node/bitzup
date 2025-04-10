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
exports.verifyUser = void 0;
const utility_functions_1 = require("../utility/utility.functions");
const prisma_client_1 = require("../config/prisma.client");
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
        const authUser = Object.assign({}, user);
        req.body.user = { user_id: authUser.user_id, secret_key: authUser.secret_key };
        next();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ status: '0', message: err.message });
    }
});
exports.verifyUser = verifyUser;
//# sourceMappingURL=authentication.js.map