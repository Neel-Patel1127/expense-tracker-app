import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import { getStoredUser } from "../utils/auth";
import { API_BASE_URL } from "../utils/api";

const CATEGORIES = ["Food", "Transport", "Shopping", "Health", "Entertainment", "Education", "Other"];

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState("");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const user = getStoredUser();

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    fetchExpenses();
  }, [user?._id]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/expenses/${user._id}`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/api/expenses`, {
        userId: user._id,
        title,
        amount: Number(amount),
        category,
        date,
      });

      setTitle("");
      setAmount("");
      setCategory("Food");
      setDate("");
      setShowForm(false);
      setSuccessMsg("Expense added ✓");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchExpenses();
    } catch (err) {
      console.error("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    const matchedExpense = expenses.find((item) => item._id === id) || null;
    setExpenseToDelete(matchedExpense);
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    if (deletingId) return;
    setShowDeleteConfirm(false);
    setTimeout(() => setExpenseToDelete(null), 200);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete?._id) return;

    setDeletingId(expenseToDelete._id);
    try {
      await axios.delete(`${API_BASE_URL}/api/expenses/${expenseToDelete._id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== expenseToDelete._id));
      setShowDeleteConfirm(false);
      setSuccessMsg("Expense deleted ✓");
      setTimeout(() => setSuccessMsg(""), 3000);
      setTimeout(() => setExpenseToDelete(null), 200);
    } catch (err) {
      console.error("Failed to delete");
    } finally {
      setDeletingId("");
    }
  };

  const filteredExpenses =
    filterCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  const totalFiltered = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Expenses</p>
            <h2 className="text-3xl font-black text-white">All Transactions</h2>
            <p className="text-zinc-500 text-sm mt-1">{expenses.length} records total</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`font-black px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-all ${
              showForm
                ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                : "bg-lime-400 hover:bg-lime-300 text-zinc-950"
            }`}
          >
            {showForm ? "✕ Cancel" : "+ Add Expense"}
          </button>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="bg-lime-400/10 border border-lime-400/30 text-lime-400 rounded-lg px-4 py-3 mb-5 text-sm font-medium">
            {successMsg}
          </div>
        )}

        {/* Add Expense Form */}
        {showForm && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 mb-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">New Expense</p>
            <form onSubmit={handleAddExpense}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lunch, Bus Ticket"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full bg-zinc-800 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black py-3 rounded-lg transition-colors text-sm uppercase tracking-wide disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Expense"}
              </button>
            </form>
          </div>
        )}

        {/* Filter + Count Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex gap-2 flex-wrap">
            {["All", ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all ${
                  filterCategory === cat
                    ? "bg-lime-400 text-zinc-950"
                    : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {filteredExpenses.length > 0 && (
            <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">
              {filteredExpenses.length} items ·{" "}
              <span className="text-white font-bold">₹{totalFiltered.toLocaleString()}</span>
            </p>
          )}
        </div>

        {/* Expense List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <p className="text-4xl mb-3">🧾</p>
            <p className="text-zinc-500 text-sm">No expenses found.</p>
            {filterCategory !== "All" && (
              <button
                onClick={() => setFilterCategory("All")}
                className="mt-3 text-lime-400 text-sm font-semibold hover:text-lime-300"
              >
                Clear filter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredExpenses.map((expense) => (
              <ExpenseCard
                key={expense._id}
                expense={expense}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>

      <div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 transition-all duration-200 ${
          showDeleteConfirm ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={closeDeleteConfirm}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close delete confirmation"
        />

        <div
          className={`relative w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 transition-all duration-200 ${
            showDeleteConfirm ? "translate-y-0 opacity-100 sm:scale-100" : "translate-y-6 opacity-0 sm:scale-95"
          }`}
        >
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Delete Transaction</p>
          <h3 className="text-xl font-black text-white mb-2">Are you sure?</h3>
          <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
            This will permanently delete
            {expenseToDelete?.title ? ` "${expenseToDelete.title}"` : " this transaction"}.
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={closeDeleteConfirm}
              disabled={Boolean(deletingId)}
              className="px-4 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={Boolean(deletingId)}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-black transition-colors disabled:opacity-50"
            >
              {deletingId ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expenses;