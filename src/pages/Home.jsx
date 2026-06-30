import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ui/ProductCard";
import Spinner from "../components/ui/Spinner";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import heroImage from "../assets/hero.png";
import giftBanner from "../assets/gift-banner.png";
import darkImage from "../assets/dark.png";
import milkImage from "../assets/milk.png";
import whiteImage from "../assets/white.png";
import giftImage from "../assets/gift.png";

const CATEGORIES = [
  { name: "Dark Chocolate", slug: "dark",    desc: "Healthy",   image: darkImage,   overlay: "BOLD & INTENSE",      },
  { name: "Milk Chocolate", slug: "milk",    desc: "Rich",      image: milkImage,   overlay: "SMOOTH & CREAMY",     },
  { name: "White Chocolate",slug: "white",   desc: "Silky",     image: whiteImage,  overlay: "SWEET & DELICATE",    },
  { name: "Gift Boxes",     slug: "gifting", desc: "Custom",    image: giftImage,   overlay: "CURATED COLLECTIONS", },
];

const TRUST = [
  { stat: "100%", label: "Pure Cocoa",       sub: "No artificial additives" },
  { stat: "48hr", label: "Fresh Crafted",    sub: "Made to order" },
  { stat: "500+", label: "Happy Customers",  sub: "Across India" },
  { stat: "4+",  label: "Varieties",        sub: "Seasonal drops" },
];

export default function Home() {
  const { data: featured, isLoading } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () => axiosInstance.get("/api/products?limit=8").then((r) => r.data),
  });

  return (
    <div className="bg-beige-100">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-beige-300">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(#2d6e30 1px,transparent 1px),linear-gradient(90deg,#2d6e30 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-eyebrow">New Collection — 2025</p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#1a1a1a] leading-[1.05] tracking-tight mb-6">
                Chocolate<br />
                <span className="italic text-forest-600">Crafted for</span><br />
                Moments
              </h1>
              <p className="text-[#5a5a5a] text-lg leading-relaxed max-w-md mb-10">
                Each piece tells a story. Pure cocoa, handcrafted in small batches — for people who know the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products" className="btn-primary flex items-center justify-center gap-2">
                  Shop Collection <ArrowRight size={16} />
                </Link>
                <Link to="/products?category=gifting" className="btn-outline flex items-center justify-center gap-2">
                  Gift Boxes
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] bg-beige-200 border border-beige-300 overflow-hidden relative">
                <img src={heroImage} alt="Premium chocolates" className="w-full h-full object-contain" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm border border-beige-200 p-4 shadow-lg">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-forest-600 mb-1">New Arrival</p>
                  <p className="font-display text-[#1a1a1a] font-semibold">Peanut Butter Chocolate Collection</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono text-[#1a1a1a] font-semibold">₹399</span>
                    <Link to="/products" className="text-forest-600 text-xs font-mono tracking-widest uppercase flex items-center gap-1 hover:text-forest-800 transition-colors">
                      Explore <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
              {/*<div className="absolute -top-4 -right-4 w-24 h-24 border border-mint-300 -z-0" />*/}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STATS */}
      <section className="bg-white border-b border-beige-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-beige-200">
            {TRUST.map((item) => (
              <div key={item.stat} className="py-8 px-8 text-center">
                <p className="font-display text-3xl font-semibold text-forest-600 mb-1">{item.stat}</p>
                <p className="text-[#1a1a1a] text-sm font-medium mb-0.5">{item.label}</p>
                <p className="text-[#8a8a8a] text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 border-b border-beige-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-eyebrow">Browse</p>
              <h2 className="section-heading">Shop by Category</h2>
            </div>
            <Link to="/products" className="btn-ghost hidden sm:flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} to={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden border border-beige-300 hover:border-forest-400 transition-colors duration-300 hover:shadow-md">
                <div className="aspect-[3/4] overflow-hidden bg-beige-200">
                  <img src={cat.image} alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                </div>
                {/* Large text */}
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">

                  <h3
                    className={`font-display text-5xl lg:text-6xl font-light leading-none ${
                      cat.slug === "white"
                        ? "text-white"
                        : "text-white"
                    }`}
                  >
                    {cat.slug === "dark" && "Dark"}
                    {cat.slug === "milk" && "Milk"}
                    {cat.slug === "white" && "White"}
                    {cat.slug === "gifting" && "Gift"}
                  </h3>

                  <p
                    className={`mt-3 text-xs tracking-[0.3em] uppercase font-mono ${
                      cat.slug === "white"
                        ? "text-white/90"
                        : "text-white/90"
                    }`}
                  >
                    {cat.overlay}
                  </p>

                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/80 to-transparent">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-forest-600 mb-1">{cat.desc}</p>
                  <p className="font-display text-[#1a1a1a] font-semibold text-sm">{cat.name}</p>
                </div>
                <div className="absolute top-3 right-3 w-7 h-7 border border-beige-300 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  <ArrowUpRight size={13} className="text-forest-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 border-b border-beige-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-eyebrow">Trending</p>
              <h2 className="section-heading">Featured Chocolates</h2>
            </div>
            <Link to="/products" className="btn-ghost hidden sm:flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-24"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {featured?.content?.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* BANNER */}
     <section className="py-20">
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
    <div
      className="p-12 md:p-20 relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${giftBanner})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Dots */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-xl text-left ml-8 md:ml-16 lg:ml-20">

        <p className="text-mint-300 text-xs font-mono tracking-[0.2em] uppercase mb-3">
          Limited Edition
        </p>

        <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
          Gift the <span className="italic text-mint-300">Finest</span> This Season
        </h2>

        <p className="text-beige-100 text-lg mb-8 opacity-90">
          Curated chocolate gift boxes for every occasion —
          birthdays, weddings, and beyond.
        </p>

        <Link
          to="/products?category=gifting"
          className="inline-flex items-center gap-2 bg-white text-forest-700 font-semibold px-8 py-3 text-sm uppercase tracking-wide hover:bg-beige-100 transition-colors"
        >
          Explore Gift Boxes <ArrowRight size={16} />
        </Link>

      </div>
    </div>
  </div>
</section>
    </div>
  );
}