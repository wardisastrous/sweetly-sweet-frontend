import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, User, LogOut, Search, Menu, X } from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { clearCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import logo from "../../assets/logo1.png";

const NAV_LINKS = [
  { label: "All",     to: "/products" },
  { label: "Dark",    to: "/products?category=dark" },
  { label: "Milk",    to: "/products?category=milk" },
  { label: "White",   to: "/products?category=white" },
  { label: "Gifting", to: "/products?category=gifting" },
  { label: "Sale",    to: "/products?sale=true", accent: true },
];

export default function Navbar() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const cartItems  = useSelector((s) => s.cart.items);
  const cartCount  = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  function handleLogout() {
    localStorage.removeItem("token");
    dispatch(logout());
    dispatch(clearCart());

    toast.success("Logged out successfully!");

    navigate("/");
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-forest-700 text-white overflow-hidden h-8 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4).fill("🍫 FREE DELIVERY ON ORDERS ABOVE ₹499  •  HANDCRAFTED WITH PURE COCOA  •  GIFT WRAPPING AVAILABLE  •  NEW SEASONAL COLLECTION NOW LIVE  •  ").map((t, i) => (
            <span key={i} className="text-xs font-mono font-medium tracking-widest mx-8">{t}</span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-beige-50/95 backdrop-blur-md border-b border-beige-300 shadow-sm"
          : "bg-beige-100 border-b border-beige-300"
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-4 shrink-0">
              <img
                src={logo}
                alt="Sweetly Sweet"
                className="h-16 w-auto"
              />
              <div>
                <p className="font-display text-[#1a1a1a] text-3xl leading-none font-semibold tracking-wide">
                  Sweetly Sweet
                </p>
                <p className="text-forest-600 text-xs font-mono tracking-[0.35em] uppercase leading-none mt-1">
                  Premium Chocolates
                </p>
              </div>
            </Link>

            {/* Center nav — desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to}
                  className={`px-4 py-2 text-xs font-mono tracking-[0.15em] uppercase transition-colors duration-200 ${
                    link.accent
                      ? "text-forest-600 hover:text-forest-800 font-semibold"
                      : "text-[#5a5a5a] hover:text-[#1a1a1a]"
                  }`}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-[#5a5a5a] hover:text-forest-600 transition-colors">
                <Search size={18} />
              </button>

              {isAuthenticated ? (
                <>
                  {/* ← ONLY ADDITION: Admin button, visible only to ADMIN role */}
                  {user?.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="hidden sm:block px-3 py-1.5 text-xs font-mono uppercase tracking-widest border border-forest-600 text-forest-700 hover:bg-forest-600 hover:text-white transition-colors mx-1"
                    >
                      Admin
                    </Link>
                  )}
                  <Link to="/orders" className="hidden sm:block p-2.5 text-[#5a5a5a] hover:text-forest-600 transition-colors">
                    <User size={18} />
                  </Link>
                  <button onClick={handleLogout} className="hidden sm:block p-2.5 text-[#5a5a5a] hover:text-red-500 transition-colors">
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <Link to="/login"
                  className="hidden sm:block px-4 py-1.5 border border-forest-600 text-forest-700 text-xs font-mono tracking-widest uppercase hover:bg-forest-600 hover:text-white transition-colors mx-1">
                  Login
                </Link>
              )}

              <Link to="/cart" className="relative p-2.5 text-[#5a5a5a] hover:text-forest-600 transition-colors">
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-forest-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-[#5a5a5a] hover:text-forest-600 transition-colors ml-1">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-up">
              <input autoFocus type="text" placeholder="Search chocolates..."
                className="input-luxury w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/products?search=${e.target.value}`);
                    setSearchOpen(false);
                  }
                }} />
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-beige-300 bg-beige-50 animate-fade-up">
            <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.to}
                  className={`px-4 py-3 text-xs font-mono tracking-[0.15em] uppercase border-b border-beige-200 ${
                    link.accent ? "text-forest-600 font-semibold" : "text-[#4a4a4a]"
                  }`}>
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {/* ← Admin link in mobile menu too */}
                  {user?.role === "ADMIN" && (
                    <Link to="/admin" className="px-4 py-3 text-xs font-mono tracking-widest uppercase text-forest-700 font-semibold border-b border-beige-200">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/orders" className="px-4 py-3 text-xs font-mono tracking-widest uppercase text-[#4a4a4a] border-b border-beige-200">My Orders</Link>
                  <Link to="/profile" className="px-4 py-3 text-xs font-mono tracking-widest uppercase text-[#4a4a4a] border-b border-beige-200">Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-3 text-xs font-mono tracking-widest uppercase text-red-500 text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login"  className="px-4 py-3 text-xs font-mono tracking-widest uppercase text-[#4a4a4a]">Login</Link>
                  <Link to="/register" className="px-4 py-3 text-xs font-mono tracking-widest uppercase text-forest-600 font-semibold">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}