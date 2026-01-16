'use client'

/**
 * Individual Cart Item Skeleton
 * Matches the layout of a single product row in the cart.
 */
export function CartItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-lg animate-pulse">
      <div className="flex gap-4 flex-1 min-w-0">
        {/* Product Image Placeholder */}
        <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-lg"></div>

        {/* Product Info Placeholder */}
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="flex items-center gap-4 pt-1">
             <div className="h-9 w-28 bg-gray-200 rounded"></div>
             <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
      {/* Desktop Price Total Placeholder */}
      <div className="hidden sm:block shrink-0">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}

/**
 * Order Summary Skeleton
 * Matches the sidebar summary box on the right.
 */
export function OrderSummarySkeleton() {
  return (
    <div className="bg-white rounded-lg p-6 sticky top-6 shadow-sm animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
          <div className="h-6 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 w-32 bg-gray-100 rounded mx-auto"></div>
    </div>
  )
}

/**
 * Default Export: Full Page Skeleton
 * Combines everything to prevent layout shift on the Cart Page.
 */
export default function FullCartSkeleton() {
  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 md:py-6">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6 animate-pulse">
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
          <div className="h-4 w-4 bg-gray-100 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Account Sidebar Placeholder (Assuming it's a static component) */}
          <div className="lg:col-span-1">
             <div className="h-64 bg-white rounded-lg animate-pulse hidden lg:block"></div>
          </div>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Items List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <CartItemSkeleton key={i} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-1">
                <OrderSummarySkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}