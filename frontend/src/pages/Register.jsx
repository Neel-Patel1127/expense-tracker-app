import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
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

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-zinc-900 border-r border-zinc-800 p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-lime-400 rounded flex items-center justify-center">
            <span className="text-zinc-950 font-black text-base">₹</span>
          </div>
          <span className="font-black text-white text-xl tracking-tight uppercase">Spendly</span>
        </div>

        <div>
          <p className="text-5xl font-black text-white leading-tight">
            Start tracking<br />
            your money<br />
            <span className="text-lime-400">today.</span>
          </p>
          <p className="text-zinc-400 mt-6 text-base leading-relaxed max-w-xs">
            Set up your free account in seconds. No credit card, no subscriptions — just clarity.
          </p>
        </div>

        <div className="bg-zinc-800 rounded-xl p-5 border border-zinc-700">
          <p className="text-zinc-400 text-sm italic">
            "I finally know where my salary disappears every month."
          </p>
          <p className="text-zinc-500 text-xs mt-2 font-medium">— A happy user</p>
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

          <h2 className="text-2xl font-black text-white mb-1">Create account</h2>
          <p className="text-zinc-500 text-sm mb-8">Free forever. Takes 30 seconds.</p>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-lime-400 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

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
                placeholder="Min 6 characters"
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-lime-400 font-semibold hover:text-lime-300">
              Sign in →
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default Register;