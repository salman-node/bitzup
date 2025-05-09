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
exports.getRedisClient = exports.disconnectRedis = exports.RedisConnection = exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = require("./config");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.redisClient = (0, redis_1.createClient)({
    username: config_1.config.REDIS_USER,
    password: config_1.config.REDIS_AUTH,
    socket: {
        host: config_1.config.REDIS_HOST,
        port: config_1.config.REDIS_PORT
    }
});
const RedisConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield exports.redisClient.connect();
        console.log('Connected to Redis');
    }
    catch (error) {
        console.error('Error connecting to Redis:', error);
    }
});
exports.RedisConnection = RedisConnection;
const disconnectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.redisClient.quit();
        console.log('Disconnected from Redis');
    }
    catch (error) {
        console.error('Error disconnecting from Redis:', error);
    }
});
exports.disconnectRedis = disconnectRedis;
const getRedisClient = () => {
    return exports.redisClient;
};
exports.getRedisClient = getRedisClient;
//# sourceMappingURL=redisConnection.js.map