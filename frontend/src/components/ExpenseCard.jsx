const categoryConfig = {
  Food:          { icon: "🍔", color: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  Transport:     { icon: "🚌", color: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  Shopping:      { icon: "🛍️", color: "bg-pink-400/10 text-pink-400 border-pink-400/20" },
  Health:        { icon: "💊", color: "bg-red-400/10 text-red-400 border-red-400/20" },
  Entertainment: { icon: "🎮", color: "bg-purple-400/10 text-purple-400 border-purple-400/20" },
  Education:     { icon: "📚", color: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20" },
  Other:         { icon: "📦", color: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20" },
};

function ExpenseCard({ expense, onDelete }) {
  const cfg = categoryConfig[expense.category] || categoryConfig.Other;

  return (
    <div className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-200">

      {/* Left */}
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg border flex items-center justify-center text-lg flex-shrink-0 ${cfg.color}`}>
          {cfg.icon}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{expense.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.color}`}>
              {expense.category}
            </span>
            <span className="text-xs text-zinc-500">{expense.date}</span>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="font-black text-white text-base tabular-nums">
          ₹{expense.amount.toLocaleString()}
        </span>
        <button
          onClick={() => onDelete(expense._id)}
          className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all text-base"
          title="Delete"
        >
          ✕
        </button>
      </div>

    </div>
  );
}

export default ExpenseCard;