import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ui/ProductCard";
import Spinner from "../components/ui/Spinner";
import { Search, SlidersHorizontal } from "lucide-react";
import catalogueBanner from "../assets/catalogueBanner.png";

const CATEGORIES = ["all", "dark", "milk", "white", "gifting", "seasonal"];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const category = searchParams.get("category") || "all";

  const { data, isLoading } = useQuery({
    queryKey: ["products", category, sort],
    queryFn: () =>
      axiosInstance
        .get("/api/products", {
          params: {
            category: category === "all" ? undefined : category,
            sort,
            limit: 40,
          },
        })
        .then((r) => r.data),
  });

  const products = data?.content || [];

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-beige-100 min-h-screen">

      {/* Catalogue Banner */}
      <div
        className="relative h-[200px] bg-cover bg-center border-b border-beige-200"
        style={{
          backgroundImage: `url(${catalogueBanner})`,
          backgroundPosition: "center right",
        }}
      >
        <div className="absolute inset-0 bg-white/10"></div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
          <p className="text-forest-600 text-lg md:text-xl font-mono tracking-[0.28em] uppercase mb-4 font-semibold"> Catalogue </p>
        <h1 className="font-display text-5xl md:text-6xl font-semibold text-[#1a1a1a]">
          Our Chocolates
        </h1>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury pl-9 w-full bg-white"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-luxury bg-white text-[#1a1a1a] w-full sm:w-48"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSearchParams(
                  cat === "all" ? {} : { category: cat }
                )
              }
              className={`px-4 py-2 text-xs font-mono tracking-widest uppercase border transition-colors duration-200 capitalize ${
                category === cat
                  ? "bg-forest-600 text-white border-forest-600"
                  : "border-beige-300 bg-white text-[#5a5a5a] hover:border-forest-400 hover:text-forest-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {isLoading ? (
          <div className="flex justify-center py-32">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <SlidersHorizontal
              size={40}
              className="mx-auto mb-4 text-beige-400"
            />
            <p className="text-[#8a8a8a] font-mono text-sm tracking-widest uppercase">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}