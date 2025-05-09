import { createClient } from 'redis';

export const redisClient = createClient({
    username: process.env.REDIS_USER,
    password: process.env.REDIS_AUTH,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
  });
  
export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
}
export const disconnectRedis = async () => {
    try {
        await redisClient.quit();
        console.log('Disconnected from Redis');
    } catch (error) {
        console.error('Error disconnecting from Redis:', error);
    }
}
export const getRedisClient = () => {
    return redisClient;
}

