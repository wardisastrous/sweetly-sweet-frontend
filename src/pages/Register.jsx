import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";
import Spinner from "../components/ui/Spinner";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/api/auth/register", form);
      dispatch(setCredentials({ token: data.token, user: data.user }));
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-[85vh] bg-beige-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-beige-200 shadow-sm p-10">
          <div className="mb-8 text-center">
            <div className="w-10 h-10 bg-forest-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xs font-mono font-bold">SS</span>
            </div>
            <p className="section-eyebrow text-center">Join us</p>
            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">Create account</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name",     label: "Full Name", type: "text",     placeholder: "Your Name" },
              { key: "email",    label: "Email",     type: "email",    placeholder: "you@example.com" },
              { key: "phone",    label: "Phone",     type: "tel",      placeholder: "98765XXXXX" },
              { key: "password", label: "Password",  type: "password", placeholder: "Min 8 characters" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="label-luxury">{label}</label>
                <input type={type} required value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder} className="input-luxury" />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2">
              {loading ? <Spinner size="sm" /> : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-[#8a8a8a] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-forest-600 hover:text-forest-800 transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}