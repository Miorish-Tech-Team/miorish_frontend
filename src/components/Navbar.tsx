import Image from 'next/image'
import { Search, User, Heart, ShoppingCart, BellIcon } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-primary text-white">
      {/* Top Bar */}
      <div className='w-full h-6 bg-accent'></div>
      <div className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-center gap-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="/images/MiorishLogo.png" 
              alt="Miorish Logo" 
              width={120} 
              height={120}
              className="object-contain"
            />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 bg-secondary rounded-xl">
            <div className="flex">
              <input
                type="text"
                placeholder="Search"
                className="w-full px-4 py-2 text-dark focus:outline-none"
              />
              <button className=" bg-accent text-white px-4 rounded-r-xl text-sm">
                Search
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <BellIcon size={25} />
              <span className='text-xs'>Notification</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <User size={25} />
              <span className='text-xs'>Profile</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <Heart size={25} />
              <span className='text-xs'>Wishlist</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <ShoppingCart size={25} />
              <span className='text-xs'>Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-white text-dark border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-5 text-sm">
            <li>
              <a href="#" className="hover:text-accent transition-colors">All Categories</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Puja & Rituals</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Gifts & Items</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">Luxury Collection</a>
            </li>
            <li>
              <a href="#" className="hover:text-accent transition-colors">New Arrivals</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}