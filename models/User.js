const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true 
  },
  password: String,
  role: { 
    type: String, 
    enum: ["Admin", "Member"], 
    default: "Member" 
  },
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Tenant" 
  }
});

module.exports = mongoose.model("User", userSchema);

