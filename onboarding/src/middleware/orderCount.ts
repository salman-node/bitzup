// import { Request, Response, NextFunction } from 'express';
// import { redisClient } from '../config/redisConnection';


// export const OpenOrderCount = async (req: Request, res: Response, next: NextFunction) => {
//     const { pair_id } = req.body;

//     const accountLimit = 200; // Max open orders per account
//     const maxAccounts = 5; // Set the maximum number of accounts you want to use (or you can dynamically set this based on available accounts)

//     try {
//         // Loop through the available accounts
//         for (let accountIndex = 1; accountIndex <= maxAccounts; accountIndex++) {
//             // Generate the Redis key for the specific account and pair
//             const redisKey = `OpenOrderCount:BinanceAccount${accountIndex}:${pair_id}`;
            
//             // Fetch the current open order count from Redis for the specific account and pair
//             const openOrderCount = await redisClient.get(redisKey);

//             // If the open order count is less than the account limit, assign the account and continue
//             if (openOrderCount && parseInt(openOrderCount) < accountLimit) {
//                 req.body.BinanceAccount = accountIndex; // Assign the account number to the request body
//                 console.log(`Using Binance Account ${accountIndex} for pair ${pair_id}`);
//                 return next();
//             }
//         }
//         // If all accounts have reached the limit, send a response or handle accordingly
//         console.log('All Binance accounts have reached the order limit.');
//         res.status(400).json({ status: '0', message: 'All Binance accounts have reached the order limit' });

//     } catch (error) {
//         console.error('Error fetching order count from Redis:', error);
//         res.status(500).json({ status: '0', message: 'Internal server error' });
//     }
// };
