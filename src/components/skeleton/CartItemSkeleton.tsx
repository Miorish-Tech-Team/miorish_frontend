export default function CartItemSkeleton() {
  return (
    <div className="border-b border-gray-200 pb-4 animate-pulse">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0"></div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          </div>
          
          <div className="flex items-center justify-between">
            {/* Quantity */}
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            
            {/* Price */}
            <div className="h-6 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
        
        {/* Delete */}
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
