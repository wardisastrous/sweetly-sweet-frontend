import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import CountUp from "react-countup";
import {
  Plus,
  ShoppingBag,
  Tag,
  ArrowRight,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#2d6e30",
  "#b98a36",
  "#d97706",
  "#2563eb",
  "#dc2626",
];

export default function AdminOverview() {

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () =>
      axiosInstance
        .get("/api/admin/analytics")
        .then((r) => r.data),
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () =>
      axiosInstance
        .get("/api/admin/orders")
        .then((r) => r.data),
  });

  const isLoading = analyticsLoading || ordersLoading;

  const statusData =
    analytics?.orderStatusCounts
      ? Object.entries(analytics.orderStatusCounts).map(
          ([name, value]) => ({
            name,
            value,
          })
        )
      : [];

  return (
    <div>

      <div className="bg-white border-b border-beige-200 py-12">
        <div className="px-8">
          <p className="section-eyebrow">
            Dashboard
          </p>

          <h1 className="section-heading">
            Overview
          </h1>
        </div>
      </div>

      <div className="p-8">

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : (
          <>

            {/* KPI CARDS */}

            <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-4 mb-8">

              <div className="bg-white border border-beige-200 p-6">
                <DollarSign className="text-forest-700 mb-3" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Revenue
                </p>

                <h2 className="text-3xl font-display font-semibold">
                  ₹
                  <CountUp
                    end={Number(analytics?.totalRevenue ?? 0)}
                    duration={1.5}
                    decimals={2}
                    separator=","
                  />
                </h2>
              </div>

              <div className="bg-white border border-beige-200 p-6">
                <ShoppingBag className="text-forest-700 mb-3" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Orders
                </p>

                <h2 className="text-3xl font-display">
                  <CountUp
                    end={analytics?.totalOrders ?? 0}
                    duration={1.5}
                    separator=","
                  />
                </h2>
              </div>

              <div className="bg-white border border-beige-200 p-6">
                <Users className="text-forest-700 mb-3" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Customers
                </p>

                <h2 className="text-3xl font-display">
                  <CountUp
                    end={analytics?.totalCustomers ?? 0}
                    duration={1.5}
                    separator=","
                  />
                </h2>
              </div>

              <div className="bg-white border border-beige-200 p-6">
                <Package className="text-forest-700 mb-3" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Products Sold
                </p>

                <h2 className="text-3xl font-display">
                  <CountUp
                    end={analytics?.productsSold ?? 0}
                    duration={1.5}
                    separator=","
                  />
                </h2>
              </div>

              <div className="bg-white border border-beige-200 p-6">
                <ShoppingCart className="text-forest-700 mb-3" />
                <p className="text-xs uppercase tracking-widest text-gray-500">
                  Avg Order
                </p>

                <h2 className="text-3xl font-display">
                  ₹
                  <CountUp
                    end={Number(analytics?.averageOrderValue ?? 0)}
                    duration={1.5}
                    decimals={2}
                    separator=","
                  />
                </h2>
              </div>

            </div>

            {/* CHARTS */}

            <div className="grid lg:grid-cols-2 gap-6 mb-8">

              <div className="bg-white border border-beige-200 p-6">

                <h2 className="font-display text-xl mb-5">
                  Monthly Revenue
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart
                    data={analytics?.monthlyRevenue || []}
                  >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2d6e30"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

              <div className="bg-white border border-beige-200 p-6">

                <h2 className="font-display text-xl mb-5">
                  Order Status
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <PieChart>

                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >

                      {statusData.map(
                        (entry, index) => (
                          <Cell
                            key={index}
                            fill={
                              COLORS[
                                index % COLORS.length
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip />

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

                        <div className="grid lg:grid-cols-2 gap-6 mb-8">

              {/* Top Selling Products */}

              <div className="bg-white border border-beige-200 shadow-sm">

                <div className="border-b border-beige-200 p-5">
                  <h2 className="font-display text-xl">
                    Top Selling Products
                  </h2>
                </div>

                {!analytics?.topProducts?.length ? (

                  <p className="p-8 text-center text-gray-500">
                    No sales yet.
                  </p>

                ) : (

                  <div className="divide-y divide-beige-100">

                    {analytics.topProducts.map((product, index) => (

                      <div
                        key={product.productName}
                        className="flex items-center justify-between p-4"
                      >

                        <div>
                          <p className="font-medium text-[#1a1a1a]">
                            {index + 1}. {product.productName}
                          </p>
                        </div>

                        <span className="font-mono text-forest-700">
                          {product.quantitySold} sold
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

              {/* Quick Actions */}

              <div className="grid gap-4">

                <Link
                  to="/admin/products/new"
                  className="bg-forest-700 text-white p-6 hover:bg-forest-800 transition-colors"
                >

                  <Plus size={22} className="mb-3" />

                  <p className="font-display text-lg font-semibold mb-1">
                    Add Product
                  </p>

                  <p className="text-sm text-forest-200">
                    Add a new chocolate product
                  </p>

                </Link>

                <Link
                  to="/admin/orders"
                  className="bg-white border border-beige-200 p-6 hover:border-forest-300 transition-colors"
                >

                  <ShoppingBag
                    size={22}
                    className="text-forest-700 mb-3"
                  />

                  <p className="font-display text-lg font-semibold mb-1">
                    Manage Orders
                  </p>

                  <p className="text-sm text-gray-500">
                    Update order status
                  </p>

                </Link>

                <Link
                  to="/admin/coupons"
                  className="bg-white border border-beige-200 p-6 hover:border-forest-300 transition-colors"
                >

                  <Tag
                    size={22}
                    className="text-forest-700 mb-3"
                  />

                  <p className="font-display text-lg font-semibold mb-1">
                    Manage Coupons
                  </p>

                  <p className="text-sm text-gray-500">
                    Create discount codes
                  </p>

                </Link>

              </div>

            </div>

            {/* Recent Orders */}

            <div className="bg-white border border-beige-200 shadow-sm">

              <div className="flex items-center justify-between p-5 border-b border-beige-200">

                <h2 className="font-display font-semibold text-[#1a1a1a]">
                  Recent Orders
                </h2>

                <Link
                  to="/admin/orders"
                  className="text-xs font-mono text-forest-600 hover:text-forest-800 flex items-center gap-1"
                >
                  View all
                  <ArrowRight size={12} />
                </Link>

              </div>

              {!orders?.length ? (

                <p className="p-8 text-center text-gray-500">
                  No orders yet.
                </p>

              ) : (

                <div className="divide-y divide-beige-100">

                  {orders.slice(0, 5).map((order) => (

                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4"
                    >

                      <div>

                        <p className="font-mono font-medium">
                          #{String(order.id).padStart(6, "0")}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          {order.fullName}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-mono">
                          ₹{Number(order.totalAmount).toFixed(2)}
                        </p>

                        <span className="text-xs uppercase text-forest-700">
                          {order.orderStatus.replace(/_/g, " ")}
                        </span>

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