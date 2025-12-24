export default function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200"></div>

      {/* Content skeleton */}
      <div className="p-3 md:p-4">
        {/* Title */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        
        {/* Description */}
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-14"></div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
