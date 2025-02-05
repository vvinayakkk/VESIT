const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
 assignment_id: {
   type: String,
   required: true,
   unique: true
 },
 agent_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'DeliveryAgent',
   required: true
 },
 donation_id: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Donation',
   required: true
 },
 pickup_location: {
   type: String,
   required: true
 },
 delivery_location: {
   type: String,
   required: true
 },
 status: {
   type: String,
   enum: ['Assigned', 'In Progress', 'Completed', 'Cancelled'],
   default: 'Assigned'
 },
 created_at: {
   type: Date,
   default: Date.now
 }
});

const Pickup = mongoose.model('Pickup', PickupSchema);

module.exports = { Pickup };