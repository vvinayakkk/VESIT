const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    business_name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    phone_number: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      default: 'Donor' 
    },
    food_listings: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'FoodListing' 
    }],
    verification_status: { 
      type: String, 
      default: 'Pending' 
    },
    created_at: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  const Donor = mongoose.model('Donor', DonorSchema);
  
  module.exports = { Donor };