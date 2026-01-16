'use client';

import Link from "next/link";
import { Home, Package, Flame } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-accent/10 mb-8">
            <Flame className="w-12 h-12 md:w-16 md:h-16 text-accent" />
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-dark mb-4">
            404
          </h1>
          
          <div className="w-32 h-1 bg-accent mx-auto mb-8"></div>

          {/* Message */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-dark mb-6">
            Page Not Found
          </h2>
          
          <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
            The page you&apos;re looking for seems to have drifted away like a gentle flame. 
            Let us guide you back to where the warmth is.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 md:px-10 md:py-4 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg"
            >
              <Package className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

