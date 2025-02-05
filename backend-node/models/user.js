const mongoose = require('mongoose');

const foodInventorySchema = new mongoose.Schema({
    food_name: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: ''
    },
    expiry_date: {
        type: Date,
        default: null
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'Household'
    },
    food_inventory: {
        type: [foodInventorySchema],
        default: []
    },
    donation_history: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Donation',
        default: []
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
