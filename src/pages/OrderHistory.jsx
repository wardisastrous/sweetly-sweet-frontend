import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Spinner from "../components/ui/Spinner";
import { Package, ChevronRight, ArrowRight } from "lucide-react";

const STATUS_STYLE = {
  PENDING:          "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED:        "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED:          "bg-purple-50 text-purple-700 border-purple-200",
  OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  DELIVERED:        "bg-mint-50 text-forest-700 border-mint-200",
  CANCELLED:        "bg-red-50 text-red-700 border-red-200",
};

export default function OrderHistory() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => axiosInstance.get("/api/orders/my-orders").then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-32 bg-beige-100 min-h-screen"><Spinner size="lg" /></div>;

  return (
    <div className="bg-beige-100 min-h-screen">
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow">Account</p>
          <h1 className="section-heading">My Orders</h1>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!orders?.length ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 border border-beige-300 bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Package size={28} className="text-beige-400" />
            </div>
            <p className="text-[#8a8a8a] font-mono text-sm tracking-widest uppercase mb-6">No orders yet</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">Start Shopping <ArrowRight size={15} /></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`}
                className="block bg-white border border-beige-200 p-5 hover:border-forest-300 hover:shadow-sm transition-all duration-200 group shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono font-semibold text-[#1a1a1a] text-sm">#{String(order.id).padStart(6, "0")}</p>
                    <p className="text-xs font-mono text-[#8a8a8a] mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </p>
                    <p className="text-sm text-[#5a5a5a] mt-2 font-mono">
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                      <span className="text-beige-400 mx-2">·</span>
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border ${STATUS_STYLE[order.orderStatus] || "bg-beige-50 text-[#5a5a5a] border-beige-200"}`}>
                      {order.orderStatus.replace(/_/g, " ")}
                    </span>
                    <ChevronRight size={16} className="text-beige-400 group-hover:text-forest-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}