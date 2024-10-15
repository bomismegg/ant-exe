const { consumeQueue } = require('../configs/rabbitmq.config');
const EmailService = require('../services/email.service');

const processEmailTask = async (message) => {
    const emailData = JSON.parse(message);
    await EmailService.sendEmail(emailData);
};

consumeQueue('emailQueue', processEmailTask);
