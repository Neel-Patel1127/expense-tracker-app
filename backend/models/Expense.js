const mongoose = require("mongoose");

// This defines what one "Expense" looks like in the database
const expenseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // which user this expense belongs to
  },
  title: {
    type: String,
    required: true, // e.g. "Lunch", "Bus Ticket"
  },
  amount: {
    type: Number,
    required: true, // e.g. 250
  },
  category: {
    type: String,
    required: true, // e.g. "Food", "Transport"
  },
  date: {
    type: String,
    required: true, // e.g. "2024-06-15"
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model("Expense", expenseSchema);