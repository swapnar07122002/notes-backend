const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);

