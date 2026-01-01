import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function OurStory() {
  return (
    <section className="py-4 md:py-6 lg:py-10 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Header with Icon */}
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4">
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
              Our Story
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto"></div>
          </div>

          {/* Content */}
          <div className="text-center space-y-6 md:space-y-8">
            <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              At <span className="font-semibold text-accent">Miorish</span>, luxury is an experience — felt in quiet moments, 
              comforting spaces, and scents that stay with you beyond the flame.
            </p>
            
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We believe life is best savored in moments of deep, rich, and beautifully unforgettable. 
              Born from the idea of creating something irresistibly comforting, Miorish is a gentle invitation 
              to experience more — more warmth, more emotion, more presence — as you light a flame and let your senses wander.
            </p>

            {/* <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Our candles are crafted to be more than aromatic accents. They are sensory companions designed to 
              elevate your surroundings, enrich everyday living, and transform ordinary spaces into meaningful sanctuaries.
            </p> */}

            {/* Feature Highlights */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-dark mb-2 text-base md:text-lg">Natural Blends</h3>
                <p className="text-sm text-gray-600">Beeswax, soy, and coconut wax for a cleaner burn</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-dark mb-2 text-base md:text-lg">Handcrafted Quality</h3>
                <p className="text-sm text-gray-600">Every detail matters in our artisanal process</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-dark mb-2 text-base md:text-lg">Sustainable Choice</h3>
                <p className="text-sm text-gray-600">Eco-friendly and free from harsh chemicals</p>
              </div>
            </div> */}

            {/* See More Button */}
            <div className="mt-8 md:mt-12">
              <Link
                href="/about"
                className="inline-block px-8 py-3 md:px-10 md:py-4 border-2 border-accent text-accent rounded-xl transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg"
              >
                See More About Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
