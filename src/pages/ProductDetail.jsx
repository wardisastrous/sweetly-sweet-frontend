import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";
import { setCart } from "../features/cart/cartSlice";
import StarRating from "../components/ui/StarRating";
import ProductDetailSkeleton from "../components/ui/ProductDetailSkeleton";
import PageTransition from "../components/layout/PageTransition";
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isAuthenticated } = useSelector((s) => s.auth);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      axiosInstance
        .get(`/api/products/${id}`)
        .then((r) => r.data),
  });

  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () =>
      axiosInstance
        .get(`/api/products/${id}/reviews`)
        .then((r) => r.data),
  });

  const reviewMutation = useMutation({
    mutationFn: () =>
      axiosInstance.post("/api/products/reviews", {
        productId: Number(id),
        rating,
        comment,
      }),

    onSuccess: () => {
      toast.success("Review submitted");
      setRating(5);
      setComment("");

      queryClient.invalidateQueries({
        queryKey: ["reviews", id],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", id],
      });
    },

    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          "Unable to submit review"
      );
    },
  });
  useEffect(() => {
    function handleKeyDown(e) {
      if (!lightboxOpen) return;

      const imageCount = product?.imageUrls?.length || 1;

      if (e.key === "Escape") {
        setLightboxOpen(false);
      }

      if (e.key === "ArrowLeft") {
        setActiveImg((prev) =>
          prev === 0 ? imageCount - 1 : prev - 1
        );
      }

      if (e.key === "ArrowRight") {
        setActiveImg((prev) =>
          prev === imageCount - 1 ? 0 : prev + 1
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, product]);

  async function addToCart() {
    if (!isAuthenticated) {
      toast.error("Please login first");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/api/cart", {
        productId: product.id,
        quantity: qty,
      });

      dispatch(setCart(data));
      toast.success("Added to cart");
    } catch {
      toast.error("Could not add to cart");
    }
  }
    if (isLoading) {
      return <ProductDetailSkeleton />;
    }
  if (!product)
    return (
      <div className="text-center py-32 bg-beige-100 min-h-screen">
        <p className="text-[#8a8a8a] font-mono tracking-widest">
          Product not found.
        </p>
      </div>
    );

  const displayPrice = product.salePrice ?? product.price;
  const onSale =
    product.salePrice && product.salePrice < product.price;
  const discount = onSale
    ? Math.round(
        ((product.price - product.salePrice) / product.price) * 100
      )
    : 0;

  const images =
    product.imageUrls?.length
      ? product.imageUrls
      : ["https://placehold.co/600x600/EDE5D5/2d6e30?text=SS"];

  
  return (
    <PageTransition>
    <div className="bg-beige-100 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[#8a8a8a] hover:text-forest-600 transition-colors text-xs font-mono tracking-widest uppercase mb-10"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div>
            <div className="relative border border-beige-200 bg-white aspect-square overflow-hidden shadow-sm">
              <img
                src={images[activeImg]}
                alt={product.name}
                onClick={() => setLightboxOpen(true)}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-105"
              />

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-beige-200 rounded-full p-2 shadow pointer-events-none">
                <ZoomIn size={18} />
              </div>

              {onSale && (
                <div className="absolute top-4 left-4 bg-forest-600 text-white text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 uppercase">
                  {discount}% Off
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 border-2 overflow-hidden ${
                      i === activeImg
                        ? "border-forest-500"
                        : "border-beige-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>

            <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-forest-600 mb-2">
              {product.category}
            </p>

            <h1 className="font-display text-3xl font-semibold mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={product.avgRating || 0} size={14} />
              <span className="text-xs font-mono text-[#8a8a8a]">
                ({reviews?.length || 0} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-beige-200">
              <span className="font-mono text-3xl font-bold">
                ₹{Number(displayPrice).toFixed(2)}
              </span>

              {onSale && (
                <span className="font-mono text-xl line-through text-gray-400">
                  ₹{Number(product.price).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-[#5a5a5a] leading-relaxed mb-8">
              {product.description}
            </p>

            {product.stockQty > 0 ? (
              <div className="flex items-center gap-4">

                <div className="flex items-center border border-beige-300 bg-white">

                  <button
                    onClick={() =>
                      setQty((q) => Math.max(1, q - 1))
                    }
                    className="p-3"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="px-5 border-x border-beige-300">
                    {qty}
                  </span>

                  <button
                    onClick={() =>
                      setQty((q) =>
                        Math.min(product.stockQty, q + 1)
                      )
                    }
                    className="p-3"
                  >
                    <Plus size={15} />
                  </button>

                </div>

                <button
                  onClick={addToCart}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>

              </div>
            ) : (
              <div className="py-3 border text-center">
                Out of Stock
              </div>
            )}

          </div>
        </div>

        <section className="mt-16 border-t border-beige-200 pt-12">

          <h2 className="section-heading mb-8">
            Customer Reviews
          </h2>

          {isAuthenticated ? (
            <div className="bg-white border border-beige-200 p-6 mb-8">

              <p className="font-semibold mb-4">
                Write a Review
              </p>

              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map((n)=>(
                  <button
                    key={n}
                    onClick={()=>setRating(n)}
                    className={`px-3 py-2 border ${
                      rating===n
                        ? "bg-forest-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {n}★
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                value={comment}
                onChange={(e)=>setComment(e.target.value)}
                className="w-full border border-beige-300 p-3"
                placeholder="Share your experience..."
              />

              <button
                onClick={() => reviewMutation.mutate()}
                disabled={
                  reviewMutation.isPending ||
                  comment.trim()===""
                }
                className="btn-primary mt-4"
              >
                {reviewMutation.isPending
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </div>
          ) : (
            <div className="bg-white border border-beige-200 p-6 mb-8 text-center">
              Login to write a review.
            </div>
          )}

          <div className="grid gap-4">

            {reviews?.map((r)=>(
              <div
                key={r.id}
                className="bg-white border border-beige-200 p-5"
              >
                <div className="flex justify-between mb-2">
                  <strong>{r.userName}</strong>
                  <StarRating rating={r.rating} size={14}/>
                </div>

                <p>{r.comment}</p>
              </div>
            ))}

            {!reviews?.length && (
              <div className="text-center py-10 text-gray-500">
                No reviews yet.
              </div>
            )}

          </div>

        </section>
        {/* IMAGE LIGHTBOX */}

        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >

            {/* Close */}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(false);
              }}
              className="absolute top-6 right-6 text-white hover:scale-110 transition"
            >
              <X size={32} />
            </button>

            {/* Previous */}

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  );
                }}
                className="absolute left-6 text-white hover:scale-110 transition"
              >
                <ChevronLeft size={44} />
              </button>
            )}

            {/* Image */}

            <img
              src={images[activeImg]}
              alt={product.name}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded shadow-2xl"
            />

            {/* Next */}

            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImg((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-6 text-white hover:scale-110 transition"
              >
                <ChevronRight size={44} />
              </button>
            )}

            {/* Thumbnails */}

            {images.length > 1 && (
              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 bg-black/40 px-4 py-3 rounded-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImg(index)}
                    className={`w-16 h-16 overflow-hidden rounded border-2 transition ${
                      activeImg === index
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
}