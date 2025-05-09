import { createClient } from 'redis';
import {config} from "./config"
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = createClient({
    username: config.REDIS_USER,
    password: config.REDIS_AUTH,
    socket: {
        host: config.REDIS_HOST,
        port: config.REDIS_PORT
    }
  });
  
export const RedisConnection = async () => {
    try {
        return await redisClient.connect();
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

