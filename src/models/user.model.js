const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, enum: ['guest', 'host', 'admin'], default: 'guest' }], // Now an array of roles
    profilePicture: { type: String, default: null }, 
    phone: { type: String, default: null },
    properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }], 
    verified: { type: Boolean, default: false }, 
    status: { type: String, enum: ['pending', 'active', 'blocked'], default: 'pending' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, userSchema);
