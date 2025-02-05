const mongoose = require('mongoose');

const FoodRequestSchema = new mongoose.Schema({
 recipient_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Recipient',
   required: true
 },
 food_category: {
   type: String, 
   required: true
 },
 quantity_needed: {
   type: Number,
   required: true
 },
 urgency_level: {
   type: String,
   required: true,
   enum: ['Low', 'Medium', 'High', 'Critical']
 },
 status: {
   type: String, 
   default: 'Pending'
 },
 created_at: {
   type: Date,
   default: Date.now
 }
});

const FoodRequest = mongoose.model('FoodRequest', FoodRequestSchema);

module.exports = { FoodRequest };