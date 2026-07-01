import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function ManageProducts() {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => axiosInstance.get("/api/products?limit=100").then((r) => r.data),
  });

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove "${name}" from the store?`)) return;
    setDeletingId(id);
    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);
      toast.success("Product removed");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  }

  const products = data?.content || [];

  return (
    <div>
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8 flex items-center justify-between">
          <div>
            <p className="section-eyebrow">Inventory</p>
            <h1 className="section-heading">Products</h1>
          </div>
          <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#8a8a8a] font-mono text-sm tracking-widest uppercase mb-6">No products yet</p>
            <Link to="/admin/products/new" className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Add your first product
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-beige-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-200 bg-beige-50">
                  <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-[#8a8a8a]">Product</th>
                  <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-[#8a8a8a]">Category</th>
                  <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-[#8a8a8a]">Price</th>
                  <th className="text-left p-4 font-mono text-[10px] tracking-widest uppercase text-[#8a8a8a]">Stock</th>
                  <th className="text-right p-4 font-mono text-[10px] tracking-widest uppercase text-[#8a8a8a]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-beige-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrls?.[0] || "https://placehold.co/40x40/EDE5D5/2d6e30?text=SS"}
                          alt={p.name}
                          className="w-10 h-10 object-cover bg-beige-100"
                        />
                        <span className="font-medium text-[#1a1a1a]">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#5a5a5a] capitalize">{p.category}</td>
                    <td className="p-4 font-mono text-[#1a1a1a]">
                      ₹{Number(p.salePrice ?? p.price).toFixed(2)}
                      {p.salePrice && (
                        <span className="text-[#9a9a9a] line-through ml-2 text-xs">₹{Number(p.price).toFixed(2)}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`font-mono ${p.stockQty === 0 ? "text-red-500" : "text-[#5a5a5a]"}`}>
                        {p.stockQty}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deletingId === p.id}
                        className="text-red-500 hover:text-red-700 p-1.5 disabled:opacity-50 transition-colors"
                        title="Remove product"
                      >
                        {deletingId === p.id ? <Spinner size="sm" /> : <Trash2 size={15} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}