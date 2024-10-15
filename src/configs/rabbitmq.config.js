const amqp = require('amqplib');

let connection, channel;

const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log('RabbitMQ Connected');
    } catch (error) {
        console.error('RabbitMQ Connection Error:', error);
    }
};

const publishToQueue = async (queue, message) => {
    try {
        if (!channel) await connectRabbitMQ();
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
    } catch (error) {
        console.error('RabbitMQ Publish Error:', error);
    }
};

const consumeQueue = async (queue, callback) => {
    try {
        if (!channel) await connectRabbitMQ();
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                callback(msg.content.toString());
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('RabbitMQ Consume Error:', error);
    }
};

module.exports = {
    connectRabbitMQ,
    publishToQueue,
    consumeQueue,
};
