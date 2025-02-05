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
    type: String, 
    required: true 
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
const FoodListing = mongoose.model('FoodListing', FoodListingSchema);
module.exports = { FoodListing};