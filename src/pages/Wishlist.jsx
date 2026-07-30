import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import ProductCard from "../components/ui/ProductCard";
import ProductCardSkeleton from "../components/ui/ProductCardSkeleton";
import { Heart } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import catalogueBanner from "../assets/catalogueBanner.png";

export default function Wishlist() {
  const { data, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () =>
      axiosInstance.get("/api/wishlist").then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="bg-beige-100 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="bg-beige-100 min-h-screen">

        <div
        className="relative border-b border-beige-200 py-12 bg-cover bg-center"
        style={{
            backgroundImage: `url(${catalogueBanner})`,
            backgroundPosition: "center right",
        }}
        >
        <div className="absolute inset-0 bg-white/50"></div>

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <p className="section-eyebrow">Saved</p>

            <h1 className="section-heading flex items-center gap-3">
            <Heart className="fill-red-500 text-red-500" size={34} />
            My Wishlist
            </h1>
        </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-10">

          {!data?.length ? (
            <div className="text-center py-24">

              <Heart
                size={60}
                className="mx-auto text-beige-400 mb-5"
              />

              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3">
                Your wishlist is empty
              </h2>

              <p className="text-[#8a8a8a] mb-6">
                Save your favourite chocolates here.
              </p>

              <Link
                to="/products"
                className="btn-primary"
              >
                Explore Chocolates
              </Link>

            </div>
          ) : (
            <>
              <p className="text-sm font-mono text-[#8a8a8a] mb-6">
                {data.length} saved item{data.length !== 1 ? "s" : ""}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </PageTransition>
  );
}