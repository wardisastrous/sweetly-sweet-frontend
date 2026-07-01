import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { clearCart } from "../features/cart/cartSlice";
import Spinner from "../components/ui/Spinner";
import { MapPin, ShieldCheck } from "lucide-react";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, coupon, discount } = useSelector((s) => s.cart);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ fullName:"", phone:"", street:"", city:"", state:"", pincode:"" });

  const subtotal = items.reduce((s, i) => s + (i.product.salePrice ?? i.product.price) * i.quantity, 0);
  const delivery  = subtotal >= 499 ? 0 : 49;
  const total     = Math.max(0, subtotal - discount) + delivery;

  async function handlePlaceOrder() {
    if (Object.values(address).some((v) => !v.trim())) { toast.error("Please fill in all address fields"); return; }
    setLoading(true);
    try {
      const { data: order } = await axiosInstance.post("/api/orders/checkout", { address, couponCode: coupon });
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.razorpayAmount,
        currency: "INR",
        name: "Sweetly Sweet",
        description: `Order #${order.orderId}`,
        order_id: order.razorpayOrderId,
        handler: async (response) => {
          try {
            await axiosInstance.post("/api/orders/verify-payment", {
              orderId: order.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            dispatch(clearCart());
            navigate("/order-success", { state: { orderId: order.orderId } });
          } catch { toast.error("Payment verification failed."); }
        },
        prefill: { name: address.fullName, contact: address.phone },
        theme: { color: "#2d6e30" },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed."));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create order");
    } finally { setLoading(false); }
  }

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Final Step</p>
          <h1 className="section-heading">Checkout</h1>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-6 flex items-center gap-2"><MapPin size={14} /> Delivery Address</h2>
            <div className="bg-white border border-beige-200 p-6 space-y-4 shadow-sm">
              {[
                { key:"fullName", label:"Full Name",       placeholder:"Enter your full name" },
                { key:"phone",    label:"Phone",           placeholder:"Enter your phone number" },
                { key:"street",   label:"Street Address",  placeholder:"Enter your street address" },
                { key:"city",     label:"City",            placeholder:"Enter your city" },
                { key:"state",    label:"State",           placeholder:"Enter your state" },
                { key:"pincode",  label:"Pincode",         placeholder:"Enter your pincode" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="label-luxury">{label}</label>
                  <input type="text" value={address[key]}
                    onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                    placeholder={placeholder} className="input-luxury" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-6">Order Summary</h2>
            <div className="bg-white border border-beige-200 p-6 shadow-sm">
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const price = item.product.salePrice ?? item.product.price;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <img src={item.product.imageUrls?.[0] || "https://placehold.co/48x48/EDE5D5/2d6e30?text=SS"}
                        alt={item.product.name} className="w-12 h-12 object-cover bg-beige-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display text-[#1a1a1a] truncate">{item.product.name}</p>
                        <p className="text-xs font-mono text-[#8a8a8a]">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-mono text-[#1a1a1a] shrink-0">₹{(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-beige-200 pt-4 space-y-2.5 text-sm font-mono">
                <div className="flex justify-between text-[#5a5a5a]"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-forest-600"><span>Coupon ({coupon})</span><span>−₹{Number(discount).toFixed(2)}</span></div>}
                <div className="flex justify-between text-[#5a5a5a]">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? "text-forest-600" : ""}>{delivery === 0 ? "Free" : `₹${delivery}`}</span>
                </div>
                <div className="border-t border-beige-200 pt-3 flex justify-between text-[#1a1a1a] font-bold text-base">
                  <span>Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={handlePlaceOrder} disabled={loading || items.length === 0}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Spinner size="sm" /> : `Pay ₹${total.toFixed(2)}`}
              </button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <ShieldCheck size={14} className="text-[#9a9a9a]" />
                <p className="text-xs font-mono text-[#9a9a9a] tracking-widest uppercase">Secured by Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}