const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: String,
  slug: { 
    type: String, 
    unique: true 
  },
  plan: { 
    type: String, 
    enum: ["Free", "Pro"], 
    default: "Free" 
  }
});

module.exports = mongoose.model("Tenant", tenantSchema);

