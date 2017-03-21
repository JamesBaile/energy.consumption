var mongoose = require('mongoose');

// Define our beer schema
var EnergyConsumptionSchema   = new mongoose.Schema({
  customerId: String,
  dateCreated: Date,
  lastAmended: Date,
  postcode: String,
  gasUsage: Number,
  electricityUsage: Number,
});

// Export the Mongoose model
module.exports = mongoose.model('EnergyConsumption', EnergyConsumptionSchema);
