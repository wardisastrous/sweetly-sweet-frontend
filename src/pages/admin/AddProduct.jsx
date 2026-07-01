import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import { Upload, X, ImagePlus } from "lucide-react";

const CATEGORIES = ["dark", "milk", "white", "gifting", "seasonal"];

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", price: "", salePrice: "", stockQty: "", category: "dark",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const validFiles = files.filter((f) => {
      if (!f.type.startsWith("image/")) { toast.error(f.name + " is not an image"); return false; }
      if (f.size > 5 * 1024 * 1024) { toast.error(f.name + " is larger than 5MB"); return false; }
      return true;
    });
    setImageFiles((prev) => [...prev, ...validFiles]);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadImages() {
    const uploadedUrls = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axiosInstance.post("/api/admin/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      uploadedUrls.push(data.imageUrl);
    }
    return uploadedUrls;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.stockQty) {
      toast.error("Please fill in name, price, and stock quantity"); return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please add at least one product image"); return;
    }
    try {
      setUploading(true);
      const imageUrls = await uploadImages();
      setUploading(false);
      setSaving(true);
      await axiosInstance.post("/api/admin/products", {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        stockQty: parseInt(form.stockQty),
        category: form.category,
        imageUrls,
      });
      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  const isBusy = uploading || saving;

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8">
          <p className="section-eyebrow">Admin</p>
          <h1 className="section-heading">Add New Product</h1>
        </div>
      </div>
      <div className="px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="bg-white border border-beige-200 p-6 shadow-sm">
            <label className="label-luxury">Product Images</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square border border-beige-300 overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} disabled={isBusy}
                    className="absolute top-1 right-1 bg-white/90 border border-beige-300 p-1 hover:bg-red-50 transition-colors">
                    <X size={12} className="text-red-500" />
                  </button>
                </div>
              ))}
              <label className={"aspect-square border-2 border-dashed border-beige-300 flex flex-col items-center justify-center cursor-pointer hover:border-forest-400 transition-colors" + (isBusy ? " opacity-50 cursor-not-allowed" : "")}>
                <ImagePlus size={20} className="text-beige-400 mb-1" />
                <span className="text-[10px] font-mono text-beige-500 uppercase tracking-wide">Add image</span>
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} disabled={isBusy} className="hidden" />
              </label>
            </div>
            <p className="text-xs font-mono text-[#9a9a9a]">Max 5MB per image. JPG, PNG, or WebP.</p>
          </div>

          <div className="bg-white border border-beige-200 p-6 shadow-sm space-y-5">
            <div>
              <label className="label-luxury">Product Name</label>
              <input type="text" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Dark Truffle Box" className="input-luxury" disabled={isBusy} />
            </div>
            <div>
              <label className="label-luxury">Description</label>
              <textarea value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Rich dark chocolate truffles..." rows={4}
                className="input-luxury resize-none" disabled={isBusy} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-luxury">Price (₹)</label>
                <input type="number" min="0" step="0.01" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="899.00" className="input-luxury" disabled={isBusy} />
              </div>
              <div>
                <label className="label-luxury">Sale Price (optional)</label>
                <input type="number" min="0" step="0.01" value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                  placeholder="699.00" className="input-luxury" disabled={isBusy} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-luxury">Stock Quantity</label>
                <input type="number" min="0" value={form.stockQty}
                  onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                  placeholder="50" className="input-luxury" disabled={isBusy} />
              </div>
              <div>
                <label className="label-luxury">Category</label>
                <select value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-luxury bg-white" disabled={isBusy}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isBusy}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {uploading ? (<><Spinner size="sm" /> Uploading images...</>)
              : saving ? (<><Spinner size="sm" /> Saving product...</>)
              : (<><Upload size={16} /> Add Product</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
