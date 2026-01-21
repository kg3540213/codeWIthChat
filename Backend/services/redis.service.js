import dotenv from 'dotenv';
dotenv.config();
import Redis from 'ioredis';

console.log('Connecting to Redis at', process.env.REDIS_HOST, process.env.REDIS_PORT);
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});


redisClient.on('connect', () => {
    console.log('Redis connected');
})

export default redisClient;