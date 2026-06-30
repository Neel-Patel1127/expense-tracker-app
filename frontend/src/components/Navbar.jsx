import { Link, useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-lime-400 rounded flex items-center justify-center">
            <span className="text-zinc-950 font-black text-sm">₹</span>
          </div>
          <span className="font-black text-white text-lg tracking-tight uppercase">
            Spendly
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className="text-sm text-zinc-400 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/expenses"
            className="text-sm text-zinc-400 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all"
          >
            Expenses
          </Link>
          <Link
            to="/profile"
            className="text-sm text-zinc-400 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-zinc-800 transition-all"
          >
            Profile
          </Link>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-lime-400 flex items-center justify-center">
              <span className="text-zinc-950 font-bold text-xs uppercase">
                {user?.name?.[0]}
              </span>
            </div>
            <span className="text-sm text-zinc-300 font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wide"
          >
            Logout
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;