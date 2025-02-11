const mongoose = require('mongoose');

const FoodListingSchema = new mongoose.Schema({
  donor_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    required: true 
  },
  food_name: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  unit: { 
    type: String, 
    required: true 
  },
  pickup_location: { 
    address: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere' // Enable geospatial queries
    }
  },
  expiry_date: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('FoodListing', FoodListingSchema);