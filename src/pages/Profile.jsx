import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";
import Spinner from "../components/ui/Spinner";
import { Save, User, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [loading, setLoading] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.put("/api/users/me", form);
      dispatch(setCredentials({ token: localStorage.getItem("token"), user: data }));
      toast.success("Profile updated");
    } catch { toast.error("Could not update profile"); }
    finally { setLoading(false); }
  }

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Account</p>
          <h1 className="section-heading">My Profile</h1>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <div className="bg-white border border-beige-200 p-6 shadow-sm">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 border border-beige-300 bg-beige-100 flex items-center justify-center">
              <User size={28} className="text-beige-500" />
            </div>
            <div>
              <p className="font-display text-[#1a1a1a] text-xl font-semibold">{user?.name}</p>
              <p className="text-[#6a6a6a] text-sm font-mono mt-0.5">{user?.email}</p>
              <span className="text-[10px] font-mono tracking-widest uppercase text-forest-600 border border-forest-200 bg-mint-50 px-2 py-0.5 mt-1.5 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            {[
              { key: "name",  label: "Full Name",     type: "text" },
              { key: "phone", label: "Phone Number",  type: "tel" },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="label-luxury">{label}</label>
                <input type={type} value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input-luxury" />
              </div>
            ))}
            <div>
              <label className="label-luxury">Email</label>
              <input type="email" value={user?.email || ""} disabled
                className="input-luxury opacity-50 cursor-not-allowed bg-beige-50" />
              <p className="text-xs font-mono text-[#9a9a9a] mt-1.5 tracking-wide">Email cannot be changed</p>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {loading ? <Spinner size="sm" /> : <><Save size={15} /> Save Changes</>}
            </button>
          </form>
        </div>

        <div className="bg-white border border-beige-200 p-6 shadow-sm">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-4">Quick Links</h2>
          <Link to="/orders" className="flex items-center justify-between py-3 border-b border-beige-100 group">
            <div className="flex items-center gap-3">
              <Package size={16} className="text-beige-400 group-hover:text-forest-500 transition-colors" />
              <span className="text-sm text-[#4a4a4a] group-hover:text-forest-600 transition-colors">My Orders</span>
            </div>
            <span className="text-xs font-mono text-beige-400 group-hover:text-forest-500 transition-colors">→</span>
          </Link>
          <Link to="/cart" className="flex items-center justify-between py-3 group">
            <div className="flex items-center gap-3">
              <span className="text-beige-400 group-hover:text-forest-500 transition-colors text-sm">🛒</span>
              <span className="text-sm text-[#4a4a4a] group-hover:text-forest-600 transition-colors">My Cart</span>
            </div>
            <span className="text-xs font-mono text-beige-400 group-hover:text-forest-500 transition-colors">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}