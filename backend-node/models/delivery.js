const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
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
   address: { type: String, required: true },
   coordinates: {
     type: [Number],
     index: '2dsphere'
   }
 },
 delivery_location: {
   address: { type: String, required: true },
   coordinates: {
     type: [Number],
     index: '2dsphere'
   }
 },
 current_location: {
   coordinates: {
     type: [Number],
     index: '2dsphere'
   },
   timestamp: { type: Date, default: Date.now }
 },
 status: {
   type: String,
   enum: [
     'Assigned',
     'In Progress',
     'Pickup Reached',
     'In Transit',
     'At Destination',
     'Completed',
     'Delayed',
     'Cancelled'
   ],
   default: 'Assigned'
 },
 issues: [{
   type: {
     type: String,
     enum: ['DELAY', 'VEHICLE_BREAKDOWN', 'TRAFFIC', 'OTHER']
   },
   description: String,
   timestamp: Date,
   location: {
     coordinates: {
       type: [Number],
       index: '2dsphere'
     },
     timestamp: Date
   },
   resolved: {
     type: Boolean,
     default: false
   }
 }],
 eta: Date,
 actual_route: [{
   coordinates: [Number],
   timestamp: Date,
   event: String
 }],
 created_at: {
   type: Date,
   default: Date.now
 }
});

// Add index for geospatial queries
DeliverySchema.index({ 'current_location.coordinates': '2dsphere' });

module.exports = mongoose.model('Delivery', DeliverySchema);