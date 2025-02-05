const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
 donor_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Donor',
   required: true
 },
 recipient_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Recipient',
   required: true
 },
 food_items: [{
   type: String,
   required: true
 }],
 pickup_time: {
   type: Date,
   required: true
 },
 delivery_status: {
   type: String,
   default: 'Pending',
   enum: ['Pending', 'In Progress', 'Completed', 'Cancelled']
 },
 agent_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'DeliveryAgent',
   required: true
 },
 created_at: {
   type: Date,
   default: Date.now
 }
});

//const Transaction = mongoose.model('Delivery', TransactionSchema);

module.exports = mongoose.model('Delivery', TransactionSchema);