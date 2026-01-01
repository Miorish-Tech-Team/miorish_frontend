import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function OurStory() {
  return (
    <section className="py-4 md:py-6 lg:py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Story Images */}
          <div className="grid grid-rows-2 gap-4 md:gap-0">
            <div className="grid grid-cols-2 gap-4 md:gap-2">
              <div className="relative h-36 sm:h-48 md:h-56 lg:h-60 rounded-sm overflow-hidden shadow-md">
                <Image
                  src="/images/story1.jpg"
                  alt="Miorish candle collection"
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="relative h-36 sm:h-48 md:h-56 lg:h-60 rounded-sm overflow-hidden shadow-md">
                <Image
                  src="/images/story2.jpg"
                  alt="Miorish candles glowing in a cozy space"
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="relative h-36 sm:h-48 md:h-56 lg:h-64 rounded-sm overflow-hidden shadow-md">
              <Image
                src="/images/story3.jpg"
                alt="Miorish candle styled in a decorative jar"
                fill
                sizes="(min-width: 1024px) 540px, 90vw"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div>
            <div className="mb-6 md:mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-accent"></div>
            </div>

            <div className="space-y-4 md:space-y-4">
              <p className="text-sm md:text-md lg:text-lg text-gray-700 leading-relaxed">
                At <span className="font-semibold text-accent">Miorish</span>, luxury is an experience — felt in quiet moments,
                comforting spaces, and scents that stay with you beyond the flame.
              </p>

              <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
                We believe life is best savored in moments of deep, rich, and beautifully unforgettable.
                Born from the idea of creating something irresistibly comforting, Miorish is a gentle invitation
                to experience more — more warmth, more emotion, more presence — as you light a flame and let your senses wander.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-block px-8 py-3 md:px-10 md:py-4 border-2 border-accent text-accent rounded-xl transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg bg-white/60 hover:bg-white"
                >
                  See More About Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
