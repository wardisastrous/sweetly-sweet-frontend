import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const STATUS_STYLE = {
  PENDING:          "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED:        "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED:          "bg-purple-50 text-purple-700 border-purple-200",
  OUT_FOR_DELIVERY: "bg-orange-50 text-orange-700 border-orange-200",
  DELIVERED:        "bg-mint-50 text-forest-700 border-mint-200",
  CANCELLED:        "bg-red-50 text-red-700 border-red-200",
};

export default function ManageOrders() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => axiosInstance.get("/api/admin/orders").then((r) => r.data),
  });

  async function updateStatus(orderId, status) {
    setUpdatingId(orderId);
    try {
      await axiosInstance.patch(`/api/admin/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8">
          <p className="section-eyebrow">Fulfillment</p>
          <h1 className="section-heading">Orders</h1>
        </div>
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : !orders?.length ? (
          <p className="text-center py-24 text-[#8a8a8a] font-mono text-sm tracking-widest uppercase">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-beige-200 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono font-semibold text-[#1a1a1a]">#{String(order.id).padStart(6, "0")}</p>
                    <p className="text-sm text-[#5a5a5a] mt-1">{order.fullName} · {order.phone}</p>
                    <p className="text-xs text-[#8a8a8a] mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-[#1a1a1a]">₹{Number(order.totalAmount).toFixed(2)}</p>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border mt-1 inline-block ${STATUS_STYLE[order.paymentStatus === "PAID" ? "DELIVERED" : "PENDING"]}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t border-beige-100 pt-4 mb-4">
                  <p className="text-xs font-mono text-[#8a8a8a] mb-2 uppercase tracking-widest">Items</p>
                  <div className="space-y-1">
                    {order.items?.map((item) => (
                      <p key={item.id} className="text-sm text-[#5a5a5a]">
                        {item.quantity}× {item.productName}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border-t border-beige-100 pt-4">
                  <p className="text-xs font-mono text-[#8a8a8a] mb-2 uppercase tracking-widest">
                    {order.street}, {order.city}, {order.state} — {order.pincode}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      disabled={updatingId === order.id || order.orderStatus === status}
                      className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wide border transition-colors disabled:opacity-40 ${
                        order.orderStatus === status
                          ? "bg-forest-700 text-white border-forest-700"
                          : "border-beige-300 text-[#5a5a5a] hover:border-forest-400"
                      }`}
                    >
                      {updatingId === order.id ? <Spinner size="sm" /> : status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}