import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const CATEGORIES = [
  "dark",
  "milk",
  "white",
  "gifting",
  "seasonal",
];

export default function AdminProducts() {
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    salePrice: "",
    stockQty: "",
    category: "dark",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () =>
      axiosInstance
        .get("/api/products")
        .then((res) => res.data),
  });

  const products = data?.content || [];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      price: "",
      salePrice: "",
      stockQty: "",
      category: "dark",
      imageUrl: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        salePrice: Number(form.salePrice),
        stockQty: Number(form.stockQty),
        category: form.category,
        imageUrls: [form.imageUrl],
      };

      if (editingId) {
        await axiosInstance.put(
          `/api/admin/products/${editingId}`,
          payload
        );
      } else {
        await axiosInstance.post(
          "/api/admin/products",
          payload
        );
      }

      alert(
        editingId
          ? "Product updated!"
          : "Product added!"
      );

      resetForm();
      refetch();

    } catch (err) {
      console.error(err);
      alert("Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      salePrice: product.salePrice || "",
      stockQty: product.stockQty || "",
      category: product.category || "dark",
      imageUrl: product.imageUrls?.[0] || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/api/admin/products/${id}`
      );

      refetch();

    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white p-8 rounded-xl shadow mb-10">

          <h1 className="text-3xl font-bold mb-8">
            {editingId
              ? "Edit Product"
              : "Add Product"}
          </h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />

            <textarea
              name="description"
              placeholder="Description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              name="salePrice"
              placeholder="Sale Price"
              value={form.salePrice}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              name="stockQty"
              placeholder="Stock Quantity"
              value={form.stockQty}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            >
              {CATEGORIES.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border p-3 rounded"
            />

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-700 text-white py-3 rounded"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 rounded"
                >
                  Cancel
                </button>
              )}
            </div>

          </form>
        </div>

        <div className="bg-white p-8 rounded-xl shadow">

          <h2 className="text-2xl font-bold mb-6">
            Existing Products
          </h2>

          {isLoading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="space-y-4">

              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {product.name}
                    </h3>

                    <p>
                      ₹{product.price}
                    </p>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        editProduct(product)
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}