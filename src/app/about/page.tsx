"use client";
import CustomerSupportModal from "@/components/modals/CustomerSupportModal";
import { 
  Sparkles, 
  Leaf, 
  Heart, 
  Shield, 
  Users, 
  Briefcase, 
  Package, 
  Award,
  CheckCircle2,
  Flame,
  Home,
  Building2,
  Gift,
  Palette,
  Wind,
  Calendar
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [isOpenCustomerModal, setIsOpenCustomerModal] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-secondary py-8 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent/10 mb-6">
              <Flame className="w-10 h-10 md:w-12 md:h-12 text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-dark mb-6">
              About Us
            </h1>
            <div className="w-32 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed">
              At <span className="font-semibold text-accent">Miorish</span>, luxury is an experience — 
              felt in quiet moments, comforting spaces, and scents that stay with you beyond the flame.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-5xl mx-auto space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
            <p>
              We believe life is best savored in moments of deep, rich, and beautifully unforgettable. 
              Born from the idea of creating something irresistibly comforting, <span className="font-semibold text-accent">Miorish</span> is 
              a gentle invitation to experience more — more warmth, more emotion, more presence — as you light a flame 
              and let your senses wander.
            </p>
            <p>
              The name <span className="font-semibold text-accent">Miorish</span> draws inspiration from that feeling we all crave: 
              the desire for more — more calm, more connection, more meaning. Just like a captivating scent that makes you 
              pause and breathe deeper, Miorish represents experiences that stay with you, emotionally and sensorially.
            </p>
            <p>
              Our candles are crafted to be more than aromatic accents. They are sensory companions designed to elevate 
              your surroundings, enrich everyday living, and transform ordinary spaces into meaningful sanctuaries. Each 
              candle is an invitation to pause, to breathe, and to immerse yourself fully in the moments that matter.
            </p>
            <p className="text-center text-xl md:text-2xl font-serif text-dark pt-4">
              At Miorish, every flame tells a story — of balance, beauty, and intention.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4">
                <Heart className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
                Our Philosophy
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto"></div>
            </div>

            <div className="text-center space-y-6 mb-10">
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                We believe true luxury lies at the intersection of purity, craftsmanship, and consciousness.
              </p>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                At Miorish, every detail matters from the wax we choose to the way a candle burns. We carefully 
                blend beeswax, soy wax, and coconut wax to create candles that burn cleaner, last longer, and feel 
                indulgent without compromise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Leaf className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-dark mb-3">
                  Thoughtful Ingredients
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Over shortcuts
                </p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-dark mb-3">
                  Subtle Elegance
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Over excess
                </p>
              </div>
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Shield className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg md:text-xl font-semibold text-dark mb-3">
                  Sustainable Choices
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  Over temporary trends
                </p>
              </div>
            </div>

            <p className="text-center text-base md:text-lg text-gray-700 leading-relaxed mt-10">
              Because what you bring into your home should feel as good as it looks.
            </p>
          </div>
        </div>
      </section>

      {/* What We Signify Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4">
                <Award className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
                What We Signify
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-gray-700 max-w-4xl mx-auto">
                Miorish signifies a refined way of living where fragrance is intentional, spaces are elevated, 
                and every candle serves a purpose beyond illumination.
              </p>
            </div>

            {/* Collections Grid */}
            <div className="space-y-8 md:space-y-10">
              {/* Signature Collection */}
              <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark mb-3">
                      Timeless Craftsmanship & Signature Luxury
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Through our Signature Collection, we signify our commitment to handcrafted excellence, 
                      understated elegance, and lasting impressions. Each candle reflects refined aesthetics, 
                      premium wax blends, and a dedication to quality that defines the Miorish identity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hospitality Collection */}
              <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark mb-3">
                      Elevated Experiences in Hospitality
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      With our Hospitality Collection, Miorish signifies ambience that enhances experience without 
                      overwhelming it. Designed for hotels, restaurants, banquets, and event spaces, our candles 
                      support environments where warmth, consistency, and subtle luxury matter most.
                    </p>
                  </div>
                </div>
              </div>

              {/* Corporate Gifting */}
              <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Gift className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark mb-3">
                      Meaningful Gifting & Brand Expression
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Our Corporate Gifting Collection signifies thoughtful relationships and shared values. These 
                      candles go beyond gifting, they represent appreciation, professionalism, and attention to detail, 
                      with customization options that align seamlessly with brand identity.
                    </p>
                  </div>
                </div>
              </div>

              {/* Home Décor */}
              <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Home className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark mb-3">
                      Luxury That Belongs in Your Space
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Through our Home Décor Collection, Miorish signifies candles as design elements and not just 
                      fragrances. Minimal, elegant, and versatile, these pieces are created to complement modern 
                      interiors and become a natural part of everyday spaces.
                    </p>
                  </div>
                </div>
              </div>

              {/* Aromatherapy & Wellness */}
              <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Wind className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark mb-3">
                      Mindful Living & Emotional Well-Being
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      With Aromatherapy & Wellness, we signify balance, calm, and conscious self-care. Crafted with 
                      carefully selected essential oil blends, these candles support relaxation, focus, and emotional 
                      well-being transforming scent into ritual.
                    </p>
                  </div>
                </div>
              </div>

              {/* Festive Collection */}
              <div className="bg-secondary p-6 md:p-8 lg:p-10 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 md:w-7 md:h-7 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-dark mb-3">
                      Celebration, Tradition & Limited Elegance
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                      Our Festive Collection signifies joy, togetherness, and moments worth remembering. Produced in 
                      limited editions, these candles are designed for festivals, weddings, and special occasions where 
                      gifting and décor carry emotional value.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Miorish Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4">
                <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
                Why Choose Miorish
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-gray-700">
                Miorish candles are created for those who value quality, wellness, and sustainability in every detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                <p className="text-sm md:text-base text-gray-700">
                  Crafted with a natural blend of beeswax, soy wax, and coconut wax
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                <p className="text-sm md:text-base text-gray-700">
                  Cleaner burn with significantly lower soot
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                <p className="text-sm md:text-base text-gray-700">
                  Stable cotton wicks paired with balanced fragrance oils
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                <p className="text-sm md:text-base text-gray-700">
                  Free from paraffin and harsh chemicals
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm flex items-start gap-4 md:col-span-2">
                <CheckCircle2 className="w-6 h-6 text-accent shrink-0 mt-1" />
                <p className="text-sm md:text-base text-gray-700">
                  Eco-friendly, long-lasting, and safe for regular use
                </p>
              </div>
            </div>

            <p className="text-center text-base md:text-lg text-gray-700 leading-relaxed">
              A truly high-quality candle begins with refined materials. Our carefully formulated wax blends and 
              precise wick selection ensure a smooth, even burn keeping your space cleaner and the air clearer, 
              especially with frequent use.
            </p>
          </div>
        </div>
      </section>

      {/* B2B Offerings Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
                Our B2B Offerings
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
                Miorish partners with businesses to deliver premium candle solutions tailored to their brand, 
                space, and experience requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-secondary p-6 md:p-8 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Palette className="w-6 h-6 text-accent" />
                  <h3 className="text-lg md:text-xl font-semibold text-dark">
                    Custom Fragrance Development
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Create unique scent profiles that represent your brand identity
                </p>
              </div>

              <div className="bg-secondary p-6 md:p-8 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Package className="w-6 h-6 text-accent" />
                  <h3 className="text-lg md:text-xl font-semibold text-dark">
                    Bulk Order Manufacturing
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Reliable production capacity for large-scale requirements
                </p>
              </div>

              <div className="bg-secondary p-6 md:p-8 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="w-6 h-6 text-accent" />
                  <h3 className="text-lg md:text-xl font-semibold text-dark">
                    Corporate & Festive Gifting
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Thoughtful gifting solutions for clients and employees
                </p>
              </div>

              <div className="bg-secondary p-6 md:p-8 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-6 h-6 text-accent" />
                  <h3 className="text-lg md:text-xl font-semibold text-dark">
                    Hotel & Hospitality Supply
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Consistent quality for hospitality environments
                </p>
              </div>

              <div className="bg-secondary p-6 md:p-8 rounded-lg md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-accent" />
                  <h3 className="text-lg md:text-xl font-semibold text-dark">
                    Private Label & Branding Options
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Complete white-label solutions with custom packaging and branding
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 mb-4">
                <Users className="w-8 h-8 md:w-10 md:h-10 text-accent" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-dark mb-4">
                Why Partner with Miorish
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
              <p className="text-base md:text-lg text-gray-700">
                Choosing Miorish means partnering with a brand that values consistency, craftsmanship, 
                and long-term relationships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Award className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                  Premium Handcrafted Quality
                </h3>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                  Elegant, Minimal Luxury Designs
                </h3>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Palette className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                  Flexible Customization Options
                </h3>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Package className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                  Reliable Bulk Supply Support
                </h3>
              </div>
              
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Heart className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                  Founder-Led Brand Commitment
                </h3>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
                <Shield className="w-10 h-10 md:w-12 md:h-12 text-accent mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-dark mb-2">
                  Sustainable & Ethical Practices
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-dark mb-6">
              Ready to Experience Miorish?
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-8">
              Discover our collections and find the perfect candle for your space or business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="inline-block px-8 py-3 md:px-10 md:py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg"
              >
                Shop Collections
              </Link>
              <Link
                href=""
                onClick={() => setIsOpenCustomerModal(true)}
                className="inline-block px-8 py-3 md:px-10 md:py-4 bg-white border-2 border-accent text-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
      {isOpenCustomerModal && (
        <CustomerSupportModal  isOpen={isOpenCustomerModal} onClose={():void => setIsOpenCustomerModal(false)}></CustomerSupportModal>
      )}
    </div>
  );
}
