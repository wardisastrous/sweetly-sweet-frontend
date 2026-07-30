export default function ProductDetailSkeleton() {
  return (
    <div className="bg-beige-100 min-h-screen animate-pulse">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="h-4 w-24 bg-beige-300 mb-10 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Image */}
          <div>
            <div className="aspect-square bg-beige-300 rounded" />

            <div className="flex gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-beige-300 rounded"
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="h-3 w-24 bg-beige-300 rounded mb-3" />

            <div className="h-10 w-72 bg-beige-300 rounded mb-6" />

            <div className="h-5 w-36 bg-beige-300 rounded mb-6" />

            <div className="h-10 w-32 bg-beige-300 rounded mb-8" />

            <div className="space-y-3 mb-10">
              <div className="h-4 bg-beige-300 rounded" />
              <div className="h-4 bg-beige-300 rounded" />
              <div className="h-4 w-4/5 bg-beige-300 rounded" />
            </div>

            <div className="h-12 w-full bg-beige-300 rounded" />
          </div>

        </div>
      </div>
    </div>
  );
}