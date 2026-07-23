import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";
import Spinner from "../../components/ui/Spinner";
import UserDetailsModal from "../../components/admin/UserDetailsModal";
import { Search, Users } from "lucide-react";

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () =>
      axiosInstance.get("/api/admin/users").then((r) => r.data),
  });

  const filteredUsers =
    users?.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <>
      <div>
        {/* Header */}
        <div className="bg-white border-b border-beige-200 py-12">
          <div className="px-8">
            <p className="section-eyebrow">Administration</p>
            <h1 className="section-heading">Users</h1>
          </div>
        </div>

        <div className="p-8">
          {/* Search */}

          <div className="relative max-w-md mb-6">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury pl-10"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Spinner size="lg" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-24">
              <Users
                size={36}
                className="mx-auto text-beige-400 mb-4"
              />

              <p className="text-[#8a8a8a] font-mono uppercase tracking-widest text-sm">
                No users found
              </p>
            </div>
          ) : (
            <div className="bg-white border border-beige-200 shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-beige-200 bg-beige-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Name
                    </th>

                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Email
                    </th>

                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Phone
                    </th>

                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Role
                    </th>

                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Orders
                    </th>

                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Spent
                    </th>

                    <th className="px-6 py-4 font-mono text-xs uppercase tracking-widest">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className="border-b border-beige-100 hover:bg-beige-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5 font-medium">
                        {user.name}
                      </td>

                      <td className="px-6 py-5 text-[#5a5a5a]">
                        {user.email}
                      </td>

                      <td className="px-6 py-5">
                        {user.phone || "-"}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`px-3 py-1 text-xs font-mono uppercase border rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-purple-50 border-purple-200 text-purple-700"
                              : "bg-mint-50 border-mint-200 text-forest-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        {user.totalOrders}
                      </td>

                      <td className="px-6 py-5 font-medium">
                        ₹{Number(user.totalSpent).toFixed(2)}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#8a8a8a]">
                        {new Date(user.createdAt).toLocaleDateString(
                          "en-IN"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal
        open={selectedUser !== null}
        userId={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </>
  );
}