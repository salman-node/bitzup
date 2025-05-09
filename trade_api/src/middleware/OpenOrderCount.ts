import { Request, Response, NextFunction } from 'express';
import { AdminTradeAccounts} from "../config/config"
import { redisClient } from '../config/redisConnection';

redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((error) => {
    console.error('Error connecting to Redis:', error);
});
export const OpenOrderCount = async (req: Request, res: Response, next: NextFunction) => {
    const { pair_id } = req.body;

    const accountLimit = 200; // Max open orders per account
    try {
        // Loop through the available accounts
        for (let accountIndex = 0; accountIndex <= AdminTradeAccounts.length; accountIndex++) {
            // Generate the Redis key for the specific account and pair
            const accountName = AdminTradeAccounts[accountIndex].name;
            const redisKey = `OpenOrderCount:${accountName}:${pair_id}`;
            
            // Fetch the current open order count from Redis for the specific account and pair
            const redisOpenOrderCount = await redisClient.get(redisKey);
            const openOrderCount = parseInt(redisOpenOrderCount || '0', 10); // Default to 0 if no value is found 
            console.log('Open Order Count:', openOrderCount);

            // If the open order count is less than the account limit, assign the account and continue
            if (openOrderCount  < accountLimit) {
                req.body.TradeAccount = accountName; // Assign the account number to the request body
                console.log(`Using Account ${accountName} for pair ${pair_id}`);
                return next();
            }
        }
        // If all accounts have reached the limit, send a response or handle accordingly
        console.log('All Binance accounts have reached the order limit.');
        res.status(400).json({ status: '0', message: 'Currently you can not place order.' });

    } catch (error) {
        console.error('Error fetching order count from Redis:', error);
        res.status(500).json({ status: '0', message: 'Internal server error' });
    }
};
