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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIplocation = exports.verifyToken = exports.getToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const defaults_1 = __importDefault(require("../config/defaults"));
const prisma_client_1 = require("../config/prisma_client");
const dotenv = require('dotenv');
;
const axios_1 = __importDefault(require("axios"));
dotenv.config();
/*----- Generate token -----*/
const getToken = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!defaults_1.default.jwtsecret) {
        throw new Error('JWT secret is not defined in the configuration.');
    }
    // get token_string and email from user table
    const token_data = yield prisma_client_1.prisma.user.findFirst({
        where: {
            user_id: user_id,
        },
        select: {
            token_string: true,
            email: true
        }
    });
    if (!token_data) {
        throw new Error('User not found.');
    }
    const token_string = token_data.token_string;
    const email = token_data.email;
    return jsonwebtoken_1.default.sign({ token_string: token_string, email: email }, defaults_1.default.jwtsecret, {
        expiresIn: '100d',
    });
});
exports.getToken = getToken;
/*----- Verify token -----*/
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        if (!defaults_1.default.jwtsecret) {
            throw new Error('JWT secret is not defined in the configuration.');
        }
        jsonwebtoken_1.default.verify(token, defaults_1.default.jwtsecret, (err, _decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (!defaults_1.default.jwtsecret) {
                throw new Error('JWT secret is not defined in the configuration.');
            }
            const payload = jsonwebtoken_1.default.verify(token, defaults_1.default.jwtsecret);
            if (typeof payload === 'string') {
                throw new Error('Token is not valid.');
            }
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return new Error('Session expired, please login again.');
                    // Token is expired, generate a new token
                    // try {
                    //   const user:any = await prisma.$queryRaw`
                    //   SELECT * from user where email = ${payload.email} and token_string = ${payload.token_string};`;
                    //   const newToken = await getToken(user.email);
                    //   await prisma.$queryRaw`
                    //   UPDATE user SET token = ${newToken} where email = ${payload.email};`;
                    //   resolve(payload);
                    // } catch (error) {
                    //   reject(error);
                    // }
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve(payload);
            }
        }));
    }));
});
exports.verifyToken = verifyToken;
function getIplocation(ip) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`http://ip-api.com/json/${ip}`);
            const data = response.data;
            if (data.status === 'success') {
                return `${data.city}, ${data.regionName}, ${data.country}`;
            }
            else {
                return 'Unknown';
            }
        }
        catch (err) {
            console.error('Failed to fetch location from IP:', err.message);
            return 'Unknown';
        }
    });
}
exports.getIplocation = getIplocation;
//# sourceMappingURL=utility.functions.js.map