import React from "react";

const BlogDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header Navigation Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4">
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>

      {/* Blog Content Skeleton */}
      <article className="w-full max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 md:py-12">
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          
          {/* Featured Image Skeleton */}
          <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full bg-gray-200" />

          {/* Article Content Skeleton */}
          <div className="p-6 md:p-10">
            {/* Title Skeleton */}
            <div className="h-10 md:h-12 bg-gray-200 rounded w-full mb-4" />
            <div className="h-10 md:h-12 bg-gray-200 rounded w-2/3 mb-8" />

            {/* Meta Info Skeleton */}
            <div className="flex flex-wrap items-center gap-6 pb-6 mb-6 border-b border-gray-200">
              <div className="h-4 bg-gray-100 rounded w-24" />
              <div className="h-4 bg-gray-100 rounded w-32" />
              <div className="h-4 bg-gray-100 rounded w-20" />
            </div>

            {/* Description Body Skeleton */}
            <div className="space-y-4 mb-10">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-4/5" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>

            {/* Published/Updated Info Skeleton */}
            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-3 bg-gray-50 rounded w-48" />
                <div className="h-3 bg-gray-50 rounded w-48" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailSkeleton;