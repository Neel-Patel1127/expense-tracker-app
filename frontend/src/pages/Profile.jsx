import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { getStoredUser } from "../utils/auth";
import { API_BASE_URL } from "../utils/api";

const initialsFromName = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

function Profile() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getStoredUser();

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const res = await axios.get(`${API_BASE_URL}/api/expenses/${user._id}`);
        setExpenses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load profile data", err);
        setError("Could not load profile insights right now.");
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [user?._id]);

  const stats = useMemo(() => {
    const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const monthlySpent = expenses
      .filter((item) => {
        const date = new Date(item.date);
        return Number.isFinite(date.getTime()) && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      })
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const categoryTotals = expenses.reduce((acc, item) => {
      const categoryName = item.category || "Other";
      acc[categoryName] = (acc[categoryName] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return {
      totalSpent,
      monthlySpent,
      totalTransactions: expenses.length,
      topCategory: topCategoryEntry ? topCategoryEntry[0] : "No data yet",
    };
  }, [expenses]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Account</p>
          <h2 className="text-3xl font-black text-white">Profile</h2>
          <p className="text-zinc-500 text-sm mt-1">Your account information and spending snapshot.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">User Details</p>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-lime-400 flex items-center justify-center">
                <span className="text-zinc-950 font-black text-lg uppercase">
                  {initialsFromName(user?.name)}
                </span>
              </div>

              <div>
                <p className="text-lg font-black text-white">{user?.name || "Unknown User"}</p>
                <p className="text-sm text-zinc-500">{user?.email || "No email found"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/40">
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">User ID</p>
                <p className="text-sm text-zinc-300 break-all">{user?._id || "Not available"}</p>
              </div>

              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/40">
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Account Status</p>
                <p className="text-sm font-semibold text-lime-400">Active</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">Spending Snapshot</p>

            {error && (
              <div className="bg-red-950 border border-red-800 text-red-300 rounded-xl px-4 py-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-zinc-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Total Spent</p>
                  <p className="text-2xl font-black text-white tabular-nums">₹{stats.totalSpent.toLocaleString()}</p>
                </div>

                <div className="bg-lime-400 rounded-xl p-5">
                  <p className="text-[11px] text-lime-700 uppercase tracking-widest font-semibold mb-2">This Month</p>
                  <p className="text-2xl font-black text-zinc-950 tabular-nums">₹{stats.monthlySpent.toLocaleString()}</p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Transactions</p>
                  <p className="text-2xl font-black text-white tabular-nums">{stats.totalTransactions}</p>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-2">Top Category</p>
                  <p className="text-2xl font-black text-white">{stats.topCategory}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Data Source</p>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Profile information is read from your local session and spending insights are calculated from your existing expense entries.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
