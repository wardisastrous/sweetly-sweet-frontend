import { Link, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Package, ShoppingBag, Tag, LayoutDashboard, ArrowLeft } from "lucide-react";
import logo from "../../assets/logo3.png";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Orders", to: "/admin/orders", icon: ShoppingBag },
  { label: "Coupons", to: "/admin/coupons", icon: Tag },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  function isActive(item) {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  }

  return (
    <div className="bg-beige-100 min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-forest-900 text-white flex flex-col shrink-0 min-h-screen">
        <div className="p-6 border-b border-forest-700">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Sweetly Sweet" className="h-10 w-auto" />
            <div>
              <p className="font-display font-semibold text-sm leading-none">Sweetly Sweet</p>
              <p className="text-[9px] font-mono tracking-widest uppercase text-mint-300 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  active
                    ? "bg-forest-800 text-mint-300 border-r-2 border-mint-400 font-medium"
                    : "text-forest-200 hover:bg-forest-800 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-forest-700">
          <p className="text-xs font-mono text-forest-300 mb-3">{user?.name}</p>
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono text-forest-300 hover:text-mint-300 transition-colors"
          >
            <ArrowLeft size={14} /> Back to store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}