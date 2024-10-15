const amqp = require('amqplib');

class RabbitMQService {
    constructor() {
        this.channel = null;
    }

    async connect() {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await connection.createChannel();
    }

    async sendToQueue(queue, message) {
        if (!this.channel) {
            await this.connect();
        }
        this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
            persistent: true
        });
    }
}

module.exports = new RabbitMQService();
