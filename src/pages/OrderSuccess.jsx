import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
  const { state } = useLocation();
  return (
    <div className="bg-beige-100 min-h-[85vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border-2 border-forest-500 bg-mint-50 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={32} className="text-forest-600" />
        </div>
        <p className="section-eyebrow text-center">Confirmed</p>
        <h1 className="font-display text-4xl font-semibold text-[#1a1a1a] mb-3">Order Placed!</h1>
        <p className="text-[#5a5a5a] leading-relaxed mb-3">
          Thank you for your order. We'll start crafting it right away.
        </p>
        {state?.orderId && (
          <p className="text-xs font-mono text-[#8a8a8a] mb-10 tracking-widest">
            ORDER ID: <span className="text-forest-600">#{String(state.orderId).padStart(6, "0")}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/orders" className="btn-primary flex items-center justify-center gap-2">Track Order <ArrowRight size={15} /></Link>
          <Link to="/products" className="btn-outline flex items-center justify-center gap-2">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}