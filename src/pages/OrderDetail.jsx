import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/ui/Spinner";
import { ArrowLeft, CheckCircle, Circle } from "lucide-react";

const STEPS = ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
const STEP_LABELS = { CONFIRMED:"Confirmed", SHIPPED:"Shipped", OUT_FOR_DELIVERY:"Out for Delivery", DELIVERED:"Delivered" };

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => axiosInstance.get(`/api/orders/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-32 bg-beige-100 min-h-screen"><Spinner size="lg" /></div>;
  if (!order) return <div className="text-center py-32 bg-beige-100 min-h-screen"><p className="text-[#8a8a8a] font-mono tracking-widest">Order not found.</p></div>;

  const stepIdx = STEPS.indexOf(order.orderStatus);

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[#8a8a8a] hover:text-forest-600 transition-colors text-xs font-mono tracking-widest uppercase mb-5">
            <ArrowLeft size={14} /> Back to Orders
          </button>
          <p className="section-eyebrow">Order #{String(order.id).padStart(6, "0")}</p>
          <h1 className="section-heading">
            {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
          </h1>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">

        {/* Tracking */}
        <div className="bg-white border border-beige-200 p-6 shadow-sm">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-8">Tracking</h2>
          <div className="flex items-start">
            {STEPS.map((step, i) => {
              const done   = i <= stepIdx;
              const active = i === stepIdx;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 border-2 flex items-center justify-center transition-colors ${
                      done ? "border-forest-500 bg-mint-50" : "border-beige-300 bg-white"
                    }`}>
                      {done
                        ? <CheckCircle size={16} className="text-forest-600" />
                        : <Circle size={16} className="text-beige-300" />}
                    </div>
                    <span className={`text-[10px] font-mono mt-2 text-center leading-tight max-w-[72px] tracking-wide ${
                      active ? "text-forest-600 font-semibold"
                        : done ? "text-[#5a5a5a]"
                        : "text-[#9a9a9a]"
                    }`}>
                      {STEP_LABELS[step]}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-6 transition-colors ${i < stepIdx ? "bg-forest-400" : "bg-beige-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div className="bg-white border border-beige-200 p-6 shadow-sm">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-5">Items</h2>
          <div className="space-y-4">
            {Array.isArray(order.items) &&
              order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-beige-100 last:border-0 last:pb-0">
                <img src={item.product?.imageUrls?.[0] || "https://placehold.co/48x48/EDE5D5/2d6e30?text=SS"}
                  alt={item.productName} className="w-14 h-14 object-cover bg-beige-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-[#1a1a1a] text-sm font-medium">{item.productName}</p>
                  <p className="text-xs font-mono text-[#8a8a8a] mt-1">{item.quantity} × ₹{Number(item.priceAtPurchase).toFixed(2)}</p>
                </div>
                <span className="font-mono font-semibold text-[#1a1a1a] shrink-0">
                  ₹{(item.quantity * item.priceAtPurchase).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-beige-200 mt-4 pt-4 flex justify-between font-mono font-bold text-[#1a1a1a]">
            <span>Total</span><span>₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-beige-200 p-6 shadow-sm">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-4">Delivery Address</h2>
          <p className="text-sm text-[#5a5a5a] font-mono leading-relaxed">
            {order.fullName}<br />{order.street}, {order.city}<br />{order.state} — {order.pincode}<br />{order.phone}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white border border-beige-200 p-6 shadow-sm">
          <h2 className="text-xs font-mono tracking-widest uppercase text-[#6a6a6a] mb-4">Payment</h2>
          <div className="flex items-center justify-between text-sm font-mono">
            <span className="text-[#5a5a5a]">Status</span>
            <span className={order.paymentStatus === "PAID" ? "text-forest-600 font-semibold" : "text-yellow-600"}>
              {order.paymentStatus}
            </span>
          </div>
          {order.paymentId && (
            <div className="flex items-center justify-between text-sm font-mono mt-2">
              <span className="text-[#5a5a5a]">Payment ID</span>
              <span className="text-[#9a9a9a] text-xs">{order.paymentId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}