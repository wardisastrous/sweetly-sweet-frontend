import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCart } from "../features/cart/cartSlice";
import StarRating from "../components/ui/StarRating";
import Spinner from "../components/ui/Spinner";
import { ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => axiosInstance.get(`/api/products/${id}`).then((r) => r.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => axiosInstance.get(`/api/products/${id}/reviews`).then((r) => r.data),
  });

  async function addToCart() {
    if (!isAuthenticated) { toast.error("Please login first"); return; }
    try {
      const { data } = await axiosInstance.post("/api/cart", { productId: product.id, quantity: qty });
      dispatch(setCart(data));
      toast.success("Added to cart");
    } catch { toast.error("Could not add to cart"); }
  }

  if (isLoading) return <div className="flex justify-center py-32 bg-beige-100 min-h-screen"><Spinner size="lg" /></div>;
  if (!product)  return <div className="text-center py-32 bg-beige-100 min-h-screen"><p className="text-[#8a8a8a] font-mono tracking-widest">Product not found.</p></div>;

  const displayPrice = product.salePrice ?? product.price;
  const onSale    = product.salePrice && product.salePrice < product.price;
  const discount  = onSale ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const images    = product.imageUrls?.length ? product.imageUrls : ["https://placehold.co/600x600/EDE5D5/2d6e30?text=SS"];

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#8a8a8a] hover:text-forest-600 transition-colors text-xs font-mono tracking-widest uppercase mb-10">
          <ArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative border border-beige-200 bg-white aspect-square overflow-hidden shadow-sm">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
              {onSale && (
                <div className="absolute top-4 left-4 bg-forest-600 text-white text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase">
                  {discount}% Off
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 border-2 overflow-hidden transition-colors ${
                      i === activeImg ? "border-forest-500" : "border-beige-200 hover:border-beige-400"
                    }`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-forest-600 mb-2">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight mb-4">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.avgRating || 0} size={14} />
              <span className="text-xs font-mono text-[#8a8a8a]">({reviews?.length || 0} reviews)</span>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-beige-200">
              <span className="font-mono text-3xl font-bold text-[#1a1a1a]">₹{Number(displayPrice).toFixed(2)}</span>
              {onSale && <span className="font-mono text-xl text-[#9a9a9a] line-through">₹{Number(product.price).toFixed(2)}</span>}
            </div>

            <p className="text-[#5a5a5a] leading-relaxed mb-8">{product.description}</p>

            {product.stockQty > 0 ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-beige-300 bg-white">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="p-3 text-[#5a5a5a] hover:text-forest-600 hover:bg-beige-50 transition-colors"><Minus size={15} /></button>
                  <span className="px-5 font-mono font-medium text-[#1a1a1a] border-x border-beige-300">{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(product.stockQty, q + 1))}
                    className="p-3 text-[#5a5a5a] hover:text-forest-600 hover:bg-beige-50 transition-colors"><Plus size={15} /></button>
                </div>
                <button onClick={addToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <ShoppingCart size={16} /> Add to Cart
                </button>
              </div>
            ) : (
              <div className="py-3 bg-beige-100 text-[#8a8a8a] text-center font-mono text-sm tracking-widest uppercase border border-beige-300">
                Out of Stock
              </div>
            )}

            <p className="text-xs font-mono text-[#9a9a9a] mt-3 tracking-wide">{product.stockQty} units available</p>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-beige-200">
              {[
                { icon: "🍫", text: "100% Pure Cocoa" },
                { icon: "📦", text: "Careful Packaging" },
                { icon: "🚚", text: "Free above ₹499" },
                { icon: "↩️", text: "7-day Returns" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2">
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-xs font-mono text-[#6a6a6a] tracking-wide">{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {reviews?.length > 0 && (
          <section className="mt-16 pt-16 border-t border-beige-200">
            <p className="section-eyebrow">Feedback</p>
            <h2 className="section-heading mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="bg-white border border-beige-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-medium text-[#1a1a1a] text-sm">{r.userName}</span>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <p className="text-[#5a5a5a] text-sm leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}