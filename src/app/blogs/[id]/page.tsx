"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getBlogById, type Blog } from "@/services/blogService";
import { FaEye, FaCalendar, FaUser, FaArrowLeft, FaClock } from "react-icons/fa";
import BlogDetailSkeleton from "@/components/skeleton/BlogDetailSkeleton.tsx";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogById(Number(blogId));
      setBlog(response.data);
    } catch (error: any) {
      console.error("Error fetching blog:", error);
      setError(error.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <BlogDetailSkeleton />
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Blog not found"}
          </h2>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <FaArrowLeft />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-accent hover:underline"
          >
            <FaArrowLeft />
            Back to all blogs
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <article className="w-full max-w-8xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-8 md:py-12">
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {blog.image && (
            <div className="relative h-[300px] md:h-[400px] lg:h-[700px] w-full">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-4 sm:p-6 md:p-10">
            {/* Title */}
            <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-6">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6 pb-6 mb-6 border-b border-gray-200 text-sm md:text-base">
              {/* Date */}
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendar className="text-accent text-sm md:text-base" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>

              {/* Views */}
              <div className="flex items-center gap-2 text-gray-600">
                <FaEye className="text-accent text-sm md:text-base" />
                <span>{blog.views} views</span>
              </div>
            </div>

            {/* Description/Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap ">
                {blog.description}
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaClock className="text-accent" />
                  <span>Published: {formatDateTime(blog.createdAt)}</span>
                </div>
                
              </div>
            </div>

            {/* Share/Actions Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/blogs"
                  className="w-full text-sm md:text-lg sm:w-auto text-center px-6 py-3 border-2 border-primary font-bold text-primary rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View More Blogs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
      
    </div>
  );
}
