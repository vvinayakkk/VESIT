const mongoose = require('mongoose');

const DeliveryAgentSchema = new mongoose.Schema({
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
    default: 'Delivery Agent' 
  },
  vehicle_type: { 
    type: String, 
    //required: true 
  },
  availability_status: { 
    type: String, 
    default: 'Available' 
  },
  assigned_pickups: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pickup' 
  }],
  completed_deliveries: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Delivery' 
  }],
  ratings: { 
    type: Number, 
    min: 0, 
    max: 5, 
    default: 0 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

//const DeliveryAgent = mongoose.model('DeliveryAgent', DeliveryAgentSchema);

module.exports = mongoose.model('DeliveryAgent', DeliveryAgentSchema);