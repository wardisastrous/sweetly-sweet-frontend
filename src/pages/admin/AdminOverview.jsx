import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import { Plus, Package, ShoppingBag, Tag, ArrowRight } from "lucide-react";

export default function AdminOverview() {
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => axiosInstance.get("/api/admin/orders").then((r) => r.data),
  });

  const { data: productsPage, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: () => axiosInstance.get("/api/products?limit=100").then((r) => r.data),
  });

  const isLoading = ordersLoading || productsLoading;
  const totalRevenue = orders
    ?.filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + Number(o.totalAmount), 0) || 0;
  const pendingOrders = orders?.filter((o) => o.orderStatus === "PENDING" || o.orderStatus === "CONFIRMED").length || 0;

  return (
    <div>
      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8">
          <p className="section-eyebrow">Dashboard</p>
          <h1 className="section-heading">Overview</h1>
        </div>
      </div>

      <div className="p-8">
        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-beige-200 p-6 shadow-sm">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#8a8a8a] mb-2">Total Revenue</p>
                <p className="font-display text-3xl font-semibold text-forest-700">₹{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white border border-beige-200 p-6 shadow-sm">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#8a8a8a] mb-2">Total Orders</p>
                <p className="font-display text-3xl font-semibold text-[#1a1a1a]">{orders?.length || 0}</p>
              </div>
              <div className="bg-white border border-beige-200 p-6 shadow-sm">
                <p className="text-[10px] font-mono tracking-widest uppercase text-[#8a8a8a] mb-2">Pending Orders</p>
                <p className="font-display text-3xl font-semibold text-yellow-600">{pendingOrders}</p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Link to="/admin/products/new" className="bg-forest-700 text-white p-6 hover:bg-forest-800 transition-colors group">
                <Plus size={20} className="mb-3" />
                <p className="font-display font-semibold mb-1">Add Product</p>
                <p className="text-xs text-forest-200">List a new chocolate</p>
              </Link>
              <Link to="/admin/orders" className="bg-white border border-beige-200 p-6 hover:border-forest-300 transition-colors shadow-sm group">
                <ShoppingBag size={20} className="text-forest-600 mb-3" />
                <p className="font-display font-semibold text-[#1a1a1a] mb-1">Manage Orders</p>
                <p className="text-xs text-[#8a8a8a]">Update order status</p>
              </Link>
              <Link to="/admin/coupons" className="bg-white border border-beige-200 p-6 hover:border-forest-300 transition-colors shadow-sm group">
                <Tag size={20} className="text-forest-600 mb-3" />
                <p className="font-display font-semibold text-[#1a1a1a] mb-1">Manage Coupons</p>
                <p className="text-xs text-[#8a8a8a]">Create discount codes</p>
              </Link>
            </div>

            {/* Recent orders */}
            <div className="bg-white border border-beige-200 shadow-sm">
              <div className="flex items-center justify-between p-5 border-b border-beige-200">
                <h2 className="font-display font-semibold text-[#1a1a1a]">Recent Orders</h2>
                <Link to="/admin/orders" className="text-xs font-mono text-forest-600 hover:text-forest-800 flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {!orders?.length ? (
                <p className="p-8 text-center text-[#8a8a8a] text-sm">No orders yet.</p>
              ) : (
                <div className="divide-y divide-beige-100">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-mono text-sm font-medium text-[#1a1a1a]">#{String(order.id).padStart(6, "0")}</p>
                        <p className="text-xs text-[#8a8a8a] mt-0.5">{order.fullName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm text-[#1a1a1a]">₹{Number(order.totalAmount).toFixed(2)}</p>
                        <span className="text-[10px] font-mono uppercase text-forest-600">{order.orderStatus.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}