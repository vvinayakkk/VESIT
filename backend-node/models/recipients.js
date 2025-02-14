const mongoose = require('mongoose');

const RecipientSchema = new mongoose.Schema({
  name: { 
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
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    default: 'Recipient' 
  },
  food_requests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FoodRequest' 
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

//const Recipient = mongoose.model('Recipient', RecipientSchema);

module.exports =  mongoose.model('Recipient', RecipientSchema);