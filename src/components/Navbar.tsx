'use client'

import Image from 'next/image'
import { Search, User, Heart, ShoppingCart, BellIcon, Menu, X, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchCategory, setSearchCategory] = useState('All')
  
  return (
    <nav className="bg-primary text-white">
      {/* Top Bar */}
      <div className='w-full h-4 md:h-6 bg-accent'></div>
      <div className="container mx-auto px-4 py-2 md:py-1">
        <div className="flex items-center justify-between lg:justify-center gap-4 lg:gap-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="/images/MiorishLogo.png" 
              alt="Miorish Logo" 
              width={80} 
              height={80}
              className="object-contain md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]"
            />
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 bg-white rounded-lg overflow-hidden">
            <div className="flex w-full">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-dark text-sm border-r border-gray-200 hover:bg-gray-50 transition-colors">
                  <span>{searchCategory}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Search"
                className="flex-1 px-4 py-2.5 text-dark text-sm focus:outline-none"
              />
              <button className="bg-accent text-white px-6 py-2.5 text-sm hover:bg-opacity-90 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            <button className="hidden md:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <BellIcon size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <span className='text-[10px] lg:text-xs'>Notification</span>
            </button>
            <button className="hidden sm:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <User size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <span className='text-[10px] lg:text-xs'>Profile</span>
            </button>
            <button className="hidden sm:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <Heart size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <span className='text-[10px] lg:text-xs'>Wishlist</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <ShoppingCart size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <span className='text-[10px] lg:text-xs'>Cart</span>
            </button>
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <div className="flex w-full bg-secondary rounded-xl overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 text-dark text-sm focus:outline-none"
          />
          <button className="bg-accent text-white px-4 py-2 text-sm">
            <Search size={16} />
          </button>
        </div>
      </div>

      

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-dark border-t border-gray-200">
          <div className="container mx-auto px-4">
            <ul className="flex flex-col py-4 text-sm space-y-3">
              <li className="py-2 border-b border-gray-100">
                <a href="#" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>All Categories</a>
              </li>
              <li className="py-2 border-b border-gray-100">
                <a href="#" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Puja & Rituals</a>
              </li>
              <li className="py-2 border-b border-gray-100">
                <a href="#" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Gifts & Items</a>
              </li>
              <li className="py-2 border-b border-gray-100">
                <a href="#" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Luxury Collection</a>
              </li>
              <li className="py-2">
                <a href="#" className="hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>New Arrivals</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  )
}