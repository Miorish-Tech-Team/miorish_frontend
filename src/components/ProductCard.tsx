import Image from 'next/image'
import { Heart, Minus, Plus } from 'lucide-react'

interface ProductCardProps {
  image: string
  title: string
  description: string
  originalPrice: number
  discountedPrice: number
  discount: number
}

export default function ProductCard({ 
  image, 
  title, 
  description, 
  originalPrice, 
  discountedPrice, 
  discount 
}: ProductCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-square bg-secondary">
        <Image 
          src={image} 
          alt={title}
          fill
          className="object-cover"
        />
        <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors">
          <Heart size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-dark mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-dark">₹{discountedPrice}</span>
          <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
          <span className="text-sm text-green-600 font-semibold">{discount}% Off</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-300 rounded">
            <button className="p-2 hover:bg-gray-100 transition-colors">
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm">1</span>
            <button className="p-2 hover:bg-gray-100 transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <button className="flex-1 bg-accent text-white py-2 px-4 rounded text-sm font-medium hover:bg-opacity-90 transition-colors">
            ADD
          </button>
          <button className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
