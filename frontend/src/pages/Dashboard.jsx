import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { getStoredUser } from "../utils/auth";
import { API_BASE_URL } from "../utils/api";

const categoryIcons = {
  Food: "🍔", Transport: "🚌", Shopping: "🛍️",
  Health: "💊", Entertainment: "🎮", Education: "📚", Other: "📦",
};

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getStoredUser();

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      return;
    }

    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/expenses/${user._id}`);
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, [user?._id]);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryCount = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  const recentExpenses = expenses.slice(0, 5);

  const monthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Overview</p>
            <h2 className="text-3xl font-black text-white">
              Hey, {user?.name?.split(" ")[0]} 👋
            </h2>
          </div>
          <Link
            to="/expenses"
            className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-4 py-2 rounded-lg text-xs uppercase tracking-wide transition-colors"
          >
            + Add Expense
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Total Spent</p>
            <p className="text-4xl font-black text-white tabular-nums">
              ₹{totalExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-600 mt-2">{expenses.length} transactions</p>
          </div>

          <div className="bg-lime-400 rounded-2xl p-6">
            <p className="text-xs font-semibold text-lime-700 uppercase tracking-wider mb-3">This Month</p>
            <p className="text-4xl font-black text-zinc-950 tabular-nums">
              ₹{thisMonthExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-lime-700 mt-2">{monthName}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Top Category</p>
            <p className="text-4xl font-black text-white">
              {topCategory ? categoryIcons[topCategory[0]] : "—"}
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              {topCategory ? `${topCategory[0]} · ₹${topCategory[1].toLocaleString()}` : "No data yet"}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Category Breakdown */}
          {Object.keys(categoryCount).length > 0 && (
            <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">
                By Category
              </p>
              <div className="space-y-4">
                {Object.entries(categoryCount)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amount]) => {
                    const pct = Math.round((amount / totalExpenses) * 100);
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-zinc-300 font-medium flex items-center gap-2">
                            <span>{categoryIcons[cat] || "📦"}</span>
                            {cat}
                          </span>
                          <span className="text-white font-bold tabular-nums">
                            ₹{amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1.5">
                          <div
                            className="bg-lime-400 h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-right text-xs text-zinc-600 mt-0.5">{pct}%</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Recent Expenses */}
          <div className={`${Object.keys(categoryCount).length > 0 ? "lg:col-span-3" : "lg:col-span-5"} bg-zinc-900 border border-zinc-800 rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Recent Transactions
              </p>
              <Link to="/expenses" className="text-lime-400 text-xs font-semibold hover:text-lime-300 uppercase tracking-wide">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-zinc-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recentExpenses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🧾</p>
                <p className="text-zinc-500 text-sm">No expenses yet.</p>
                <Link
                  to="/expenses"
                  className="mt-3 inline-block text-lime-400 text-sm font-semibold hover:text-lime-300"
                >
                  Add your first expense →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentExpenses.map((exp) => (
                  <div
                    key={exp._id}
                    className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-800 rounded-lg flex items-center justify-center text-base">
                        {categoryIcons[exp.category] || "📦"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{exp.title}</p>
                        <p className="text-xs text-zinc-500">{exp.category} · {exp.date}</p>
                      </div>
                    </div>
                    <span className="font-black text-white tabular-nums">
                      ₹{exp.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;