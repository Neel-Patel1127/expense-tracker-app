const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

router.get("/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId }).sort({
      createdAt: -1, 
    });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { userId, title, amount, category, date } = req.body;

  try {
    const newExpense = new Expense({ userId, title, amount, category, date });
    await newExpense.save();
    res.status(201).json({ message: "Expense added!", expense: newExpense });
  } catch (err) {
    res.status(500).json({ message: "Error adding expense", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense", error: err.message });
  }
});

module.exports = router;