import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse border border-gray-100">
      {/* Image Skeleton */}
      <div className="relative h-[200px] md:h-[250px] bg-gray-200" />

      {/* Content Skeleton */}
      <div className="p-5">
        {/* Title Lines */}
        <div className="h-6 bg-gray-200 rounded w-full mb-2" />
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />

        {/* Description Lines */}
        <div className="space-y-2 mb-6">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-4/5" />
        </div>

        {/* Meta Info Skeleton */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-100 rounded w-12" />
            <div className="h-3 bg-gray-100 rounded w-20" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;