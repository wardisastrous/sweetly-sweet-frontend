import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import {
  Plus,
  Trash2,
  Search,
  Package,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function ManageProducts() {
  const queryClient = useQueryClient();

  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () =>
      axiosInstance.get("/api/products?limit=100").then((r) => r.data),
  });

  const updateStock = useMutation({
    mutationFn: ({ id, stockQty }) =>
      axiosInstance.patch(`/api/admin/products/${id}/stock`, {
        stockQty,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
    onError: () => {
      toast.error("Failed to update stock");
    },
  });

  async function handleDelete(id, name) {
    if (!window.confirm(`Remove "${name}" from the store?`)) return;

    setDeletingId(id);

    try {
      await axiosInstance.delete(`/api/admin/products/${id}`);

      toast.success("Product removed");

      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Could not delete product"
      );
    } finally {
      setDeletingId(null);
    }
  }

  const products = data?.content || [];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const s = search.toLowerCase();

      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.category?.toLowerCase().includes(s)
      );
    }

    if (filter === "LOW") {
      list = list.filter(
        (p) => p.stockQty > 0 && p.stockQty <= 10
      );
    }

    if (filter === "OUT") {
      list = list.filter((p) => p.stockQty === 0);
    }

    return list;
  }, [products, search, filter]);

  const totalProducts = products.length;

  const lowStock = products.filter(
    (p) => p.stockQty > 0 && p.stockQty <= 10
  ).length;

  const outOfStock = products.filter(
    (p) => p.stockQty === 0
  ).length;

  return (
    <div>
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8 flex items-center justify-between">
          <div>
            <p className="section-eyebrow">Inventory</p>
            <h1 className="section-heading">Products</h1>
          </div>

          <Link
            to="/admin/products/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>
      </div>

      <div className="p-8">

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : (
          <>

            <div className="grid md:grid-cols-3 gap-4 mb-8">

              <div className="bg-white border border-beige-200 p-5">
                <Package className="mb-3 text-forest-700" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Products
                </p>
                <h2 className="text-3xl font-display">
                  {totalProducts}
                </h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-300 p-5">
                <AlertTriangle className="mb-3 text-yellow-600" />
                <p className="text-xs uppercase tracking-widest">
                  Low Stock
                </p>
                <h2 className="text-3xl font-display">
                  {lowStock}
                </h2>
              </div>

              <div className="bg-red-50 border border-red-300 p-5">
                <XCircle className="mb-3 text-red-600" />
                <p className="text-xs uppercase tracking-widest">
                  Out of Stock
                </p>
                <h2 className="text-3xl font-display">
                  {outOfStock}
                </h2>
              </div>

            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">

              <div className="relative flex-1">

                <Search
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <input
                  className="w-full border border-beige-300 pl-10 pr-4 py-2"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <select
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value)
                }
                className="border border-beige-300 px-3"
              >
                <option value="ALL">All Products</option>
                <option value="LOW">Low Stock</option>
                <option value="OUT">Out Of Stock</option>
              </select>

            </div>

                        {filteredProducts.length === 0 ? (
              <EmptyState
                icon={<Package size={48} />}
                title="No products found"
                description="Try changing your search or filter, or add a new product to your catalogue."
                buttonText="Add Product"
                buttonLink="/admin/products/new"
              />
            ) : (
              <div className="bg-white border border-beige-200 shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-beige-200 bg-beige-50">
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-left p-4">Price</th>
                      <th className="text-center p-4">Stock</th>
                      <th className="text-center p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-beige-100">
                    {filteredProducts.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-beige-50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                p.imageUrls?.[0] ||
                                "https://placehold.co/50x50"
                              }
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded"
                            />

                            <div>
                              <p className="font-medium">{p.name}</p>

                              <p className="text-xs text-gray-500">
                                #{p.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 capitalize">
                          {p.category}
                        </td>

                        <td className="p-4">
                          ₹{Number(p.salePrice ?? p.price).toFixed(2)}
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">

                            <button
                              className="w-7 h-7 rounded border"
                              disabled={
                                p.stockQty === 0 ||
                                updateStock.isPending
                              }
                              onClick={() =>
                                updateStock.mutate({
                                  id: p.id,
                                  stockQty: p.stockQty - 1,
                                })
                              }
                            >
                              -
                            </button>

                            <span
                              className={`w-10 text-center font-semibold ${
                                p.stockQty === 0
                                  ? "text-red-600"
                                  : p.stockQty <= 10
                                  ? "text-yellow-600"
                                  : "text-green-700"
                              }`}
                            >
                              {p.stockQty}
                            </span>

                            <button
                              className="w-7 h-7 rounded border"
                              disabled={updateStock.isPending}
                              onClick={() =>
                                updateStock.mutate({
                                  id: p.id,
                                  stockQty: p.stockQty + 1,
                                })
                              }
                            >
                              +
                            </button>

                          </div>
                        </td>

                        <td className="p-4 text-center">
                          {p.stockQty === 0 ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                              Out of Stock
                            </span>
                          ) : p.stockQty <= 10 ? (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                              Low Stock
                            </span>
                          ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              In Stock
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">

                            <Link
                              to={`/admin/products/${p.id}/edit`}
                              className="px-3 py-1 border rounded hover:bg-gray-100"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(p.id, p.name)
                              }
                              disabled={deletingId === p.id}
                              className="px-3 py-1 border border-red-300 text-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === p.id ? (
                                <Spinner size="sm" />
                              ) : (
                                "Delete"
                              )}
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}