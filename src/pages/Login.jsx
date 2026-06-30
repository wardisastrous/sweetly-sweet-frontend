import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";
import Spinner from "../components/ui/Spinner";
import logo from "../assets/logo1.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/api/auth/login", form);
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success("Welcome back");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[85vh] bg-beige-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-beige-200 shadow-sm p-10">
          <div className="mb-8 text-center">
            <img src={logo} alt="Sweetly Sweet" className="w-16 h-16 mx-auto mb-4" />
            <p className="section-eyebrow text-center">Welcome back</p>
            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">Sign in</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-luxury">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com" className="input-luxury" />
            </div>
            <div>
              <label className="label-luxury">Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••" className="input-luxury" />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Spinner size="sm" /> : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-[#8a8a8a] mt-6">
            No account?{" "}
            <Link to="/register" className="text-forest-600 hover:text-forest-800 transition-colors font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}