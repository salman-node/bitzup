const { createClient }  = require('redis');
const {config} = require('../config/config');

exports.redisClient = createClient({
    username: config.REDIS_USER,
    password: config.REDIS_AUTH,
    socket: {
        host: config.REDIS_HOST,
        port: 18514
    }
  });
  
// export const connectRedis = async () => {
//     try {
//         await redisClient.connect();
//         console.log('Connected to Redis');
//     } catch (error) {
//         console.error('Error connecting to Redis:', error);
//     }
// }
// export const disconnectRedis = async () => {
//     try {
//         await redisClient.quit();
//         console.log('Disconnected from Redis');
//     } catch (error) {
//         console.error('Error disconnecting from Redis:', error);
//     }
// }
// export const getRedisClient = () => {
//     return redisClient;
// }

