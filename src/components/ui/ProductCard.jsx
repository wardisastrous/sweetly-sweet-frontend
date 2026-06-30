import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import { setCart } from "../../features/cart/cartSlice";
import StarRating from "./StarRating";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const displayPrice = product.salePrice ?? product.price;
  const onSale = product.salePrice && product.salePrice < product.price;
  const discount = onSale
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  async function addToCart(e) {
    e.preventDefault();
    if (!isAuthenticated) { toast.error("Please login to add items"); return; }
    try {
      const { data } = await axiosInstance.post("/api/cart", { productId: product.id, quantity: 1 });
      dispatch(setCart(data));
      toast.success("Added to cart");
    } catch { toast.error("Could not add to cart"); }
  }

  return (
    <Link to={`/products/${product.id}`} className="card-luxury group block relative overflow-hidden">
      {/* Badge */}
      {onSale && (
        <div className="absolute top-3 left-3 z-10 bg-forest-600 text-white text-[10px] font-mono font-bold tracking-widest px-2 py-1 uppercase">
          {discount}% Off
        </div>
      )}
      {product.stockQty === 0 && (
        <div className="absolute top-3 left-3 z-10 bg-beige-500 text-white text-[10px] font-mono tracking-widest px-2 py-1 uppercase">
          Sold Out
        </div>
      )}

      {/* Add button */}
      <button onClick={addToCart} disabled={product.stockQty === 0}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white border border-beige-300 text-[#5a5a5a]
                   flex items-center justify-center hover:bg-forest-600 hover:text-white hover:border-forest-600
                   disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
        <Plus size={14} />
      </button>

      {/* Image */}
      <div className="aspect-square bg-beige-100 overflow-hidden">
        <img
          src={product.imageUrls?.[0] || "https://placehold.co/400x400/EDE5D5/2d6e30?text=SS"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="p-4 border-t border-beige-200 bg-white">
        {product.category && (
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-forest-600 mb-1.5">{product.category}</p>
        )}
        <h3 className="font-display text-[#1a1a1a] font-medium text-sm leading-snug mb-2 line-clamp-2 group-hover:text-forest-700 transition-colors">
          {product.name}
        </h3>
        <StarRating rating={product.avgRating || 0} />
        <div className="flex items-center gap-2 mt-3">
          <span className="font-mono font-semibold text-[#1a1a1a]">₹{Number(displayPrice).toFixed(2)}</span>
          {onSale && (
            <span className="font-mono text-xs text-[#9a9a9a] line-through">₹{Number(product.price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}