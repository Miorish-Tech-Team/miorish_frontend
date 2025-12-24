export default function AddressCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex md:flex-col gap-2">
          <div className="h-7 w-16 bg-gray-200 rounded"></div>
          <div className="h-7 w-20 bg-gray-200 rounded"></div>
          <div className="h-7 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
