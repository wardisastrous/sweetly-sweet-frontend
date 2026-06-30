import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCart, setCoupon, clearCoupon } from "../features/cart/cartSlice";
import Spinner from "../components/ui/Spinner";
import { Trash2, Plus, Minus, Tag, ArrowRight } from "lucide-react";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, coupon, discount } = useSelector((s) => s.cart);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => axiosInstance.get("/api/cart").then((r) => { dispatch(setCart(r.data)); return r.data; }),
  });

  async function updateQty(productId, quantity) {
    if (quantity < 1) return removeItem(productId);
    try {
      const { data } = await axiosInstance.put("/api/cart", { productId, quantity });
      dispatch(setCart(data));
    } catch { toast.error("Could not update quantity"); }
  }

  async function removeItem(productId) {
    try {
      const { data } = await axiosInstance.delete(`/api/cart/${productId}`);
      dispatch(setCart(data));
    } catch { toast.error("Could not remove item"); }
  }

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const subtotal = items.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0);
      const { data } = await axiosInstance.post("/api/coupons/apply", { code: couponInput, orderTotal: subtotal });
      dispatch(setCoupon({ code: couponInput, discount: data.discountAmount }));
      toast.success(`Coupon applied! Saved ₹${data.discountAmount.toFixed(2)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    } finally { setCouponLoading(false); }
  }

  const subtotal = items.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0);
  const delivery  = subtotal >= 499 ? 0 : 49;
  const total     = Math.max(0, subtotal - discount) + delivery;

  if (isLoading) return <div className="flex justify-center py-32 bg-beige-100 min-h-screen"><Spinner size="lg" /></div>;

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Review</p>
          <h1 className="section-heading">Your Cart</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-[#8a8a8a] font-mono text-sm tracking-widest uppercase mb-6">Your cart is empty</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">Browse Chocolates <ArrowRight size={16} /></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const price = item.product.salePrice ?? item.product.price;
                return (
                  <div key={item.id} className="bg-white border border-beige-200 p-4 flex gap-4 hover:border-beige-300 transition-colors shadow-sm">
                    <img src={item.product.imageUrls?.[0] || "https://placehold.co/80x80/EDE5D5/2d6e30?text=SS"}
                      alt={item.product.name} className="w-20 h-20 object-cover bg-beige-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-mono tracking-widest uppercase text-forest-600 mb-1">{item.product.category}</p>
                      <h3 className="font-display font-medium text-[#1a1a1a] text-sm leading-snug line-clamp-2">{item.product.name}</h3>
                      <p className="font-mono text-forest-700 text-sm mt-1">₹{Number(price).toFixed(2)}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-beige-300">
                          <button onClick={() => updateQty(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-[#5a5a5a] hover:text-forest-600 hover:bg-beige-50 transition-colors"><Minus size={13} /></button>
                          <span className="px-3 text-sm font-mono text-[#1a1a1a] border-x border-beige-300">{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-[#5a5a5a] hover:text-forest-600 hover:bg-beige-50 transition-colors"><Plus size={13} /></button>
                        </div>
                        <button onClick={() => removeItem(item.product.id)}
                          className="text-[#9a9a9a] hover:text-red-500 transition-colors p-1.5"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-semibold text-[#1a1a1a]">₹{(price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="bg-white border border-beige-200 p-5 shadow-sm">
                <h3 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-4 flex items-center gap-2"><Tag size={14} /> Apply Coupon</h3>
                {coupon ? (
                  <div className="flex items-center justify-between bg-mint-50 border border-mint-200 px-3 py-2.5">
                    <span className="text-forest-700 text-xs font-mono">{coupon} — saved ₹{Number(discount).toFixed(2)}</span>
                    <button onClick={() => dispatch(clearCoupon())} className="text-red-500 text-xs font-mono hover:text-red-700 transition-colors">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" placeholder="Coupon code" value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="input-luxury flex-1 text-xs" />
                    <button onClick={applyCoupon} disabled={couponLoading}
                      className="px-4 bg-forest-600 text-white text-xs font-mono font-bold tracking-widest uppercase hover:bg-forest-700 disabled:opacity-50 transition-colors">
                      {couponLoading ? <Spinner size="sm" /> : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white border border-beige-200 p-5 shadow-sm">
                <h3 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-5">Order Summary</h3>
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex justify-between text-[#5a5a5a]"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-forest-600"><span>Discount</span><span>−₹{Number(discount).toFixed(2)}</span></div>}
                  <div className="flex justify-between text-[#5a5a5a]">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? "text-forest-600" : ""}>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
                  </div>
                  <div className="border-t border-beige-200 pt-3 flex justify-between text-[#1a1a1a] font-bold text-base">
                    <span>Total</span><span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                  Checkout <ArrowRight size={15} />
                </button>
                {subtotal < 499 && (
                  <p className="text-xs font-mono text-[#8a8a8a] text-center mt-3">
                    Add ₹{(499 - subtotal).toFixed(2)} more for free delivery
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}