export default function WishlistItemSkeleton() {
  return (
    <tr className="border-b border-gray-200 animate-pulse">
      <td colSpan={5} className="px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="relative w-16 h-16 bg-gray-200 rounded-lg shrink-0"></div>
          
          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-48"></div>
            <div className="h-3 bg-gray-200 rounded w-64"></div>
          </div>
          
          {/* Price */}
          <div className="w-24 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-28 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </td>
    </tr>
  )
}
