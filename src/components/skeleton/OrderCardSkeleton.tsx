export default function OrderCardSkeleton() {
  return (
    <tr className="border-b border-gray-200 animate-pulse">
      {/* Order Details */}
      <td className="px-6 py-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </td>

      {/* Total */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </td>

      {/* Items */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 mt-1.5"></div>
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </td>
    </tr>
  )
}
