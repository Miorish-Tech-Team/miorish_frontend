import Image from 'next/image'
import Link from 'next/link'
import { Heart, Minus, Plus } from 'lucide-react'

interface ProductCardProps {
  image: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discount: number
  productId?: number | string
}

export default function ProductCard({ 
  image, 
  title, 
  description, 
  originalPrice, 
  discountedPrice, 
  discount,
  productId = 1
}: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image - Clickable */}
      <Link href={`/product/${productId}`}>
        <div className="relative aspect-square bg-secondary cursor-pointer">
          <Image 
            src={image} 
            alt={title}
            fill
            className="object-cover"
          />
          <button 
            className="absolute top-2 right-2 md:top-3 md:right-3 bg-white rounded-full p-1.5 md:p-2 hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.preventDefault()
              // Handle wishlist
            }}
          >
            <Heart size={16} className="text-gray-600 md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 md:p-4">
        <Link href={`/product/${productId}`}>
          <h3 className="font-semibold text-sm md:text-base text-dark mb-1 hover:text-accent cursor-pointer transition-colors">{title}</h3>
        </Link>
        <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">{description}</p>
        
        {/* Price */}
        <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-3 flex-wrap">
          <span className="text-base md:text-lg font-bold text-dark">₹{discountedPrice}</span>
          <span className="text-xs md:text-sm text-gray-400 line-through">₹{originalPrice}</span>
          <span className="text-xs md:text-sm text-green-600 font-semibold">{discount}% Off</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-accent rounded">
            <button className="p-1.5 md:p-2 hover:bg-accent/10 transition-colors text-accent cursor-pointer">
              <Minus size={12} className="md:w-3.5 md:h-3.5" />
            </button>
            <span className="px-2 md:px-3 text-xs md:text-sm text-accent ">1</span>
            <button className="p-1.5 md:p-2 hover:bg-accent/10 transition-colors text-accent cursor-pointer">
              <Plus size={12} className="md:w-3.5 md:h-3.5" />
            </button>
          </div>
          <button className="flex-1 bg-accent text-white py-1.5 md:py-2 px-3 md:px-4 rounded text-xs md:text-sm font-medium hover:bg-opacity-90 transition-colors cursor-pointer">
            ADD
          </button>
          <button className="p-1.5 md:p-2 border border-accent rounded hover:bg-accent/10 transition-colors text-accent cursor-pointer">
            <Heart size={16} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  )
}
