const redisClient = require('../configs/redis.config');

const storeOtp = async (email, otp) => {
    await redisClient.set(`otp:${email}`, otp, 'EX', 300); // Expire after 5 minutes
};

const verifyOtp = async (email, otp) => {
    const storedOtp = await redisClient.get(`otp:${email}`);
    if (storedOtp === otp) {
        await redisClient.del(`otp:${email}`); // Delete OTP after verification
        return true;
    }
    return false;
};

module.exports = {
    storeOtp,
    verifyOtp,
};
