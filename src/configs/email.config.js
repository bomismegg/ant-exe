const emailConfig = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10), // Convert the port to an integer
    secure: process.env.EMAIL_SECURE === 'true', // Ensure secure is a boolean
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false, // Optionally bypass certificate checks, adjust for production
    },
};

module.exports = { emailConfig };
