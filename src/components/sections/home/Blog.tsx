import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getLatestBlogs, type Blog } from "@/services/blogService";

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default async function BlogSection() {
  let blogs: Blog[] = [];

  try {
    const response = await getLatestBlogs(3);
    blogs = response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }

  if (blogs.length === 0) {
    return (
      <section className="py-8 md:py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark mb-3">
              Blogs
            </h2>
            <p className="text-sm md:text-base text-gray-600 px-4">
              Discover exciting news and valuable collections of the MIORISH
            </p>
          </div>
          <p className="text-center text-gray-500">No blogs available yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 lg:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif text-dark mb-3">
            Blogs
          </h2>
          <p className="text-sm md:text-base text-gray-600 px-4">
            Discover exciting news and valuable collections of the MIORISH
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="group cursor-pointer flex-shrink-0 w-[85%] snap-start"
            >
              <div className="relative h-[250px] rounded-lg overflow-hidden mb-4">
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <button className="absolute bottom-4 left-4 px-4 md:px-6 py-2 bg-accent text-white text-xs md:text-sm rounded hover:bg-opacity-90 transition-colors">
                  Read More
                </button>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-dark mb-2">
                {blog.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {truncateText(blog.description, 100)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>{blog.views} views</span>
                <span>•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              className="group cursor-pointer"
            >
              <div className="relative h-[250px] md:h-[300px] rounded-lg overflow-hidden mb-4">
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <button className="absolute bottom-4 left-4 px-4 md:px-6 py-2 bg-accent text-white text-xs md:text-sm rounded hover:bg-opacity-90 transition-colors">
                  Read More
                </button>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-dark mb-2">
                {blog.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {truncateText(blog.description, 100)}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>{blog.views} views</span>
                <span>•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/blogs"
            className="inline-block px-8 py-3 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            View More Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}