import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-zinc-900 border-r border-zinc-800 p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-lime-400 rounded flex items-center justify-center">
            <span className="text-zinc-950 font-black text-base">₹</span>
          </div>
          <span className="font-black text-white text-xl tracking-tight uppercase">Spendly</span>
        </div>

        <div>
          <p className="text-5xl font-black text-white leading-tight">
            Know where<br />
            every rupee<br />
            <span className="text-lime-400">goes.</span>
          </p>
          <p className="text-zinc-400 mt-6 text-base leading-relaxed max-w-xs">
            Track expenses, understand your spending patterns, and take control of your finances.
          </p>
        </div>

        <div className="flex gap-8">
          <div>
            <p className="text-2xl font-black text-white">100%</p>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wide">Private</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">Free</p>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wide">Forever</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">Fast</p>
            <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wide">& Simple</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-lime-400 rounded flex items-center justify-center">
              <span className="text-zinc-950 font-black text-sm">₹</span>
            </div>
            <span className="font-black text-white text-lg tracking-tight uppercase">Spendly</span>
          </div>

          <h2 className="text-2xl font-black text-white mb-1">Sign in</h2>
          <p className="text-zinc-500 text-sm mb-8">Welcome back. Enter your credentials.</p>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black py-3 rounded-lg transition-colors text-sm uppercase tracking-wide mt-2 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-8">
            No account?{" "}
            <Link to="/register" className="text-lime-400 font-semibold hover:text-lime-300">
              Create one →
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Login;