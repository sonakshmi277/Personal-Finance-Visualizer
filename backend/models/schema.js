const mongoose = require("mongoose");
const newSchema = new mongoose.Schema({
  Amount: { type: Number, required: true },
  Description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, enum: ["Rent","Food","Education","Transportation","Others"], required: true }}, 
  { timestamps: true });

module.exports = mongoose.model("transaction_history", newSchema);