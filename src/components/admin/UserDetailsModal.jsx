import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../ui/Spinner";
import { X, User, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";

export default function UserDetailsModal({ userId, open, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () =>
      axiosInstance.get(`/api/admin/users/${userId}`).then((r) => r.data),
    enabled: open && !!userId,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-beige-200 px-6 py-5">
          <div>
            <p className="section-eyebrow">Customer</p>
            <h2 className="section-heading text-2xl">
              User Details
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-beige-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {/* User Info */}

            <div className="grid md:grid-cols-2 gap-6 p-6">

              <div className="border border-beige-200 rounded-lg p-5">

                <h3 className="font-semibold mb-4">
                  Personal Information
                </h3>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <User size={18} />
                    <span>{data.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    <span>{data.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={18} />
                    <span>{data.phone || "-"}</span>
                  </div>

                  <div>
                    <span className="font-medium">Role:</span>{" "}
                    {data.role}
                  </div>

                  <div>
                    <span className="font-medium">Joined:</span>{" "}
                    {new Date(data.createdAt).toLocaleDateString("en-IN")}
                  </div>

                </div>

              </div>

              <div className="border border-beige-200 rounded-lg p-5">

                <h3 className="font-semibold mb-4">
                  Shipping Address
                </h3>

                <div className="flex gap-3">

                  <MapPin size={18} className="mt-1" />

                  <div className="space-y-1 text-[#555]">

                    <p>{data.street || "-"}</p>

                    <p>
                      {data.city || "-"}, {data.state || "-"}
                    </p>

                    <p>{data.pincode || "-"}</p>

                  </div>

                </div>

              </div>

            </div>

            {/* Stats */}

            <div className="grid md:grid-cols-2 gap-6 px-6">

              <div className="border border-beige-200 rounded-lg p-5">

                <p className="text-sm text-[#888] uppercase tracking-widest">
                  Total Orders
                </p>

                <p className="text-3xl font-bold mt-2">
                  {data.totalOrders}
                </p>

              </div>

              <div className="border border-beige-200 rounded-lg p-5">

                <p className="text-sm text-[#888] uppercase tracking-widest">
                  Total Spent
                </p>

                <p className="text-3xl font-bold mt-2">
                  ₹{Number(data.totalSpent).toFixed(2)}
                </p>

              </div>

            </div>

            {/* Recent Orders */}

            <div className="p-6">

              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag size={18} />
                Recent Orders
              </h3>

              {data.recentOrders.length === 0 ? (

                <p className="text-[#888]">
                  No orders yet.
                </p>

              ) : (

                <div className="overflow-x-auto border border-beige-200 rounded-lg">

                  <table className="w-full">

                    <thead className="bg-beige-50">

                      <tr>

                        <th className="px-4 py-3 text-left">
                          Order ID
                        </th>

                        <th className="px-4 py-3 text-left">
                          Date
                        </th>

                        <th className="px-4 py-3 text-left">
                          Status
                        </th>

                        <th className="px-4 py-3 text-left">
                          Total
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {data.recentOrders.map((order) => (

                        <tr
                          key={order.id}
                          className="border-t border-beige-100"
                        >

                          <td className="px-4 py-3">
                            #{order.id}
                          </td>

                          <td className="px-4 py-3">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN"
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {order.orderStatus}
                          </td>

                          <td className="px-4 py-3 font-medium">
                            ₹{Number(order.totalAmount).toFixed(2)}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </>
        )}
      </div>
    </div>
  );
}