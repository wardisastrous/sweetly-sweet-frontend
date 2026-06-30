import { Star } from "lucide-react";

export default function StarRating({ rating, max = 5, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} size={size}
          className={i < Math.round(rating) ? "fill-mint-500 text-mint-500" : "text-beige-300"} />
      ))}
    </div>
  );
}