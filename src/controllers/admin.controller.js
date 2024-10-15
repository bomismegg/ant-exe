const User = require('../models/user.model');
const rabbitMQService = require('../services/rabbitmq.service');

class AdminController {
    // Approve host request
    async approveHostRequest(req, res) {
        try {
            const { userId } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                throw new BusinessLogicError('User not found.');
            }

            if (user.role === 'host') {
                return res.status(400).json({ message: 'User is already a host.' });
            }

            // Update user role to host
            user.role = 'host';
            await user.save();

            res.status(200).json({ message: 'User has been successfully promoted to host.' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    // Fetch all pending host requests (admin queue)
    async fetchPendingHostRequests(req, res) {
        try {
            const messages = await rabbitMQService.getMessagesFromQueue('adminQueue');
            res.status(200).json(messages);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new AdminController();
