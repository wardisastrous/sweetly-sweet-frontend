import { Link } from "react-router-dom";
import logo from "../../assets/logo2.png";

export default function Footer() {
  return (
    <footer className="bg-beige-200 border-t border-beige-300 mt-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-beige-300">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Sweetly Sweet" className="w-10 h-10 object-contain" />
              <span className="font-display text-[#1a1a1a] text-lg font-semibold">Sweetly Sweet</span>
            </div>
            <p className="text-[#6a6a6a] text-sm leading-relaxed mb-6">
              Premium handcrafted chocolates. Made with pure cocoa, delivered with love.
            </p>
            <div className="flex gap-3">
              {["IG", "TW", "FB"].map((s) => (
                <div key={s} className="w-8 h-8 border border-beige-400 bg-white flex items-center justify-center text-[#6a6a6a] hover:border-forest-500 hover:text-forest-600 transition-colors cursor-pointer">
                  <span className="text-[10px] font-mono">{s}</span>
                </div>
              ))}
            </div>
          </div>

          {[
            { title: "Shop",    links: [["All Chocolates", "/products"], ["Dark", "/products?category=dark"], ["Milk", "/products?category=milk"], ["Gift Boxes", "/products?category=gifting"], ["Sale", "/products?sale=true"]] },
            { title: "Account", links: [["Login", "/login"], ["Register", "/register"], ["My Orders", "/orders"], ["Profile", "/profile"], ["Cart", "/cart"]] },
            { title: "Info",    links: [["About Us", "/"], ["Shipping Policy", "/"], ["Return Policy", "/"], ["Contact", "/"], ["FAQs", "/"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8a8a8a] mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-[#5a5a5a] hover:text-forest-600 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-mono text-[#8a8a8a] tracking-widest">© {new Date().getFullYear()} SWEETLY SWEET. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-3">
            {["Visa", "Mastercard", "UPI", "Razorpay"].map((p) => (
              <span key={p} className="text-[10px] font-mono text-[#8a8a8a] border border-beige-300 bg-white px-2 py-1">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}