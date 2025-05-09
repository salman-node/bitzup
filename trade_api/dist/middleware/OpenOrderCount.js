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
exports.OpenOrderCount = void 0;
const config_1 = require("../config/config");
const redisConnection_1 = require("../config/redisConnection");
redisConnection_1.redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((error) => {
    console.error('Error connecting to Redis:', error);
});
const OpenOrderCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pair_id } = req.body;
    const accountLimit = 200; // Max open orders per account
    try {
        // Loop through the available accounts
        for (let accountIndex = 0; accountIndex <= config_1.AdminTradeAccounts.length; accountIndex++) {
            // Generate the Redis key for the specific account and pair
            const accountName = config_1.AdminTradeAccounts[accountIndex].name;
            const redisKey = `OpenOrderCount:${accountName}:${pair_id}`;
            // Fetch the current open order count from Redis for the specific account and pair
            const redisOpenOrderCount = yield redisConnection_1.redisClient.get(redisKey);
            const openOrderCount = parseInt(redisOpenOrderCount || '0', 10); // Default to 0 if no value is found 
            console.log('Open Order Count:', openOrderCount);
            // If the open order count is less than the account limit, assign the account and continue
            if (openOrderCount < accountLimit) {
                req.body.TradeAccount = accountName; // Assign the account number to the request body
                console.log(`Using Account ${accountName} for pair ${pair_id}`);
                return next();
            }
        }
        // If all accounts have reached the limit, send a response or handle accordingly
        console.log('All Binance accounts have reached the order limit.');
        res.status(400).json({ status: '0', message: 'Currently you can not place order.' });
    }
    catch (error) {
        console.error('Error fetching order count from Redis:', error);
        res.status(500).json({ status: '0', message: 'Internal server error' });
    }
});
exports.OpenOrderCount = OpenOrderCount;
//# sourceMappingURL=OpenOrderCount.js.map