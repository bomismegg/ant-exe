const redis = require('redis');
const logger = require('../utils/logger');

// Create Redis client (Redis v4+)
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Ensure connection is made
redisClient.on('error', (err) => logger.error('Redis Client Error', err));

redisClient.on('connect', () => {
    logger.info('Redis client connected');
});

// Connect Redis client asynchronously
(async () => {
    await redisClient.connect();
})();

module.exports = redisClient;
