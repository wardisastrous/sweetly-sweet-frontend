export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-beige-200 overflow-hidden shadow-sm">
      <div className="aspect-square bg-beige-200" />

      <div className="p-4">
        <div className="h-3 w-20 bg-beige-200 mb-3" />

        <div className="h-5 w-40 bg-beige-200 mb-3" />

        <div className="h-4 w-24 bg-beige-200 mb-4" />

        <div className="flex gap-2">
          <div className="h-5 w-16 bg-beige-200" />
          <div className="h-5 w-12 bg-beige-200" />
        </div>
      </div>
    </div>
  );
}