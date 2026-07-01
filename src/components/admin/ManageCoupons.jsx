import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import { Plus, Trash2, Tag } from "lucide-react";

export default function ManageCoupons() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({
    code: "", discountType: "PERCENT", discountValue: "", minOrder: "0", maxUses: "100", expiry: "",
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => axiosInstance.get("/api/admin/coupons").then((r) => r.data),
  });

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) {
      toast.error("Please fill in code and discount value");
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.post("/api/admin/coupons", {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrder: parseFloat(form.minOrder || 0),
        maxUses: parseInt(form.maxUses || 100),
        expiry: form.expiry ? new Date(form.expiry).toISOString() : null,
        isActive: true,
      });
      toast.success("Coupon created");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setForm({ code: "", discountType: "PERCENT", discountValue: "", minOrder: "0", maxUses: "100", expiry: "" });
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create coupon");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, code) {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/admin/coupons/${id}`);
      toast.success("Coupon deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete coupon");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8 flex items-center justify-between">
          <div>
            <p className="section-eyebrow">Promotions</p>
            <h1 className="section-heading">Coupons</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> {showForm ? "Cancel" : "New Coupon"}
          </button>
        </div>
      </div>

      <div className="p-8">
        {showForm && (
          <form onSubmit={handleCreate} className="bg-white border border-beige-200 p-6 shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-luxury">Coupon Code</label>
                <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="SWEET20" className="input-luxury" disabled={saving} />
              </div>
              <div>
                <label className="label-luxury">Discount Type</label>
                <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                  className="input-luxury bg-white" disabled={saving}>
                  <option value="PERCENT">Percentage (%)</option>
                  <option value="FLAT">Flat amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="label-luxury">Discount Value</label>
                <input type="number" min="0" value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "PERCENT" ? "15" : "100"} className="input-luxury" disabled={saving} />
              </div>
              <div>
                <label className="label-luxury">Minimum Order (₹)</label>
                <input type="number" min="0" value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  placeholder="499" className="input-luxury" disabled={saving} />
              </div>
              <div>
                <label className="label-luxury">Max Uses</label>
                <input type="number" min="1" value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  className="input-luxury" disabled={saving} />
              </div>
              <div>
                <label className="label-luxury">Expiry Date (optional)</label>
                <input type="date" value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  className="input-luxury" disabled={saving} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {saving ? <Spinner size="sm" /> : <><Plus size={16} /> Create Coupon</>}
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : !coupons?.length ? (
          <div className="text-center py-24">
            <Tag size={32} className="mx-auto text-beige-400 mb-4" />
            <p className="text-[#8a8a8a] font-mono text-sm tracking-widest uppercase">No coupons yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white border border-beige-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold text-forest-700">{c.code}</span>
                  <button onClick={() => handleDelete(c.id, c.code)} disabled={deletingId === c.id}
                    className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 transition-colors">
                    {deletingId === c.id ? <Spinner size="sm" /> : <Trash2 size={14} />}
                  </button>
                </div>
                <p className="text-sm text-[#1a1a1a] font-medium mb-1">
                  {c.discountType === "PERCENT" ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                </p>
                <p className="text-xs text-[#8a8a8a]">Min order: ₹{Number(c.minOrder).toFixed(2)}</p>
                <p className="text-xs text-[#8a8a8a]">Used: {c.usedCount} / {c.maxUses}</p>
                {c.expiry && (
                  <p className="text-xs text-[#8a8a8a] mt-1">
                    Expires: {new Date(c.expiry).toLocaleDateString("en-IN")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}