export default function OrderCardSkeleton() {
  return (
    <div className="border-b border-gray-200 animate-pulse">
      <div className="px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          {/* Order Details */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Total */}
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>

          {/* Items */}
          <div className="flex items-center">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>

          {/* Status */}
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
