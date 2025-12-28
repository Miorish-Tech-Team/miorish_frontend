'use client'

import Image from 'next/image'
import { Search, User, Heart, ShoppingCart, BellIcon, Menu, X, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { getAllCategories, Category } from '@/services/categoryService'
import { getSearchSuggestions } from '@/services/productService'
import { useRouter } from 'next/navigation'
import AnnouncementBar from './AnnouncementBar'
import { MdOutlineShoppingBag } from "react-icons/md";
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('All')
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [mobileSuggestions, setMobileSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  
  const { user } = useAuth()
  const { cartItemCount } = useCart()
  const router = useRouter()
  
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const mobileSuggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories()
        if (response.categories) {
          setCategories(response.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false)
      }
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
      if (mobileSuggestionsRef.current && !mobileSuggestionsRef.current.contains(event.target as Node)) {
        setShowMobileSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search suggestions for desktop
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoadingSuggestions(true)
        try {
          const response = await getSearchSuggestions(searchQuery.trim())
          if (response.success && response.suggestions) {
            setSuggestions(response.suggestions)
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error)
          setSuggestions([])
        } finally {
          setIsLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Debounced search suggestions for mobile
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (mobileSearchQuery.trim().length >= 2) {
        try {
          const response = await getSearchSuggestions(mobileSearchQuery.trim())
          if (response.success && response.suggestions) {
            setMobileSuggestions(response.suggestions)
            setShowMobileSuggestions(true)
          }
        } catch (error) {
          console.error('Error fetching mobile suggestions:', error)
          setMobileSuggestions([])
        }
      } else {
        setMobileSuggestions([])
        setShowMobileSuggestions(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [mobileSearchQuery])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('query', query.trim())
      if (searchCategory !== 'All') {
        searchParams.set('category', searchCategory)
      }
      router.push(`/products/search?${searchParams.toString()}`)
      setShowSuggestions(false)
      setSearchQuery('')
    }
  }

  const handleMobileSearch = (query: string) => {
    if (query.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('query', query.trim())
      router.push(`/products/search?${searchParams.toString()}`)
      setShowMobileSuggestions(false)
      setMobileSearchQuery('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleMobileSuggestionClick = (suggestion: string) => {
    setMobileSearchQuery(suggestion)
    handleMobileSearch(suggestion)
  }

  const handleCategorySelect = (categoryName: string) => {
    setSearchCategory(categoryName)
    setShowCategoryDropdown(false)
  }

  return (
    <nav className="bg-primary text-white">
      {/* Top Bar */}
      <AnnouncementBar />
      <div className="container mx-auto px-4 py-2 md:py-1">
        <div className="flex items-center justify-between lg:justify-center gap-2 md:gap-4 lg:gap-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/MiorishLogo.png"
                alt="Miorish Logo"
                width={100}
                height={100}
                loading='eager'
                className="object-contain w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
                unoptimized
              />
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative" ref={suggestionsRef}>
            <div className="relative w-full" ref={categoryDropdownRef}>
              <div className="flex w-full bg-white rounded-lg overflow-hidden">
                <button 
                  className="flex items-center gap-1 px-4 py-2.5 bg-white text-dark text-sm border-r border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span className="max-w-[100px] truncate">{searchCategory}</span>
                  <ChevronDown size={16} className={`cursor-pointer ${showCategoryDropdown ? "rotate-180" : ""} transition-transform duration-200`}/>
                </button>
                
                <input
                  type="text"
                  placeholder="Find your signature fragrance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="flex-1 px-4 py-2.5 text-dark text-sm focus:outline-none"
                />
                
                <button 
                  className="bg-accent text-white px-3 py-2.5 text-sm font-bold cursor-pointer  hover:bg-opacity-90 transition-colors"
                  onClick={() => handleSearch(searchQuery)}
                >
                  Search
                </button>
              </div>
              
              {/* Category Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute text-gray-900 top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <button
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                    onClick={() => handleCategorySelect('All')}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors border-t border-gray-100"
                      onClick={() => handleCategorySelect(category.categoryName)}
                    >
                      {category.categoryName}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 2) && (
              <div className="absolute top-full left-0  text-gray-900 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Loading suggestions...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span>{suggestion}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No suggestions found</div>
                )}
              </div>
            )}
          </div>

          {/* Icons - Desktop Only */}
          <div className="hidden lg:flex items-center gap-4 lg:gap-6">
            <Link href="/account/orders">
            <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <MdOutlineShoppingBag size={20} className="lg:w-6 lg:h-6" />
              <span className='text-[10px] lg:text-xs'>My Orders</span>
            </button>
            </Link>
            
            {user ? (
              <Link href="/account/profile">
                <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
                  <User size={20} className="lg:w-6 lg:h-6" />
                  <span className='text-[10px] lg:text-xs'>Profile</span>
                </button>
              </Link>) : (
              <Link href="/auth/login">
                <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
                  <User size={20} className="lg:w-6 lg:h-6" />
                  <span className='text-[10px] lg:text-xs'>Login</span>
                </button>
              </Link>)}
            <Link href="/account/wishlist">
              <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
                <Heart size={20} className="lg:w-6 lg:h-6" />
                <span className='text-[10px] lg:text-xs'>Wishlist</span>
              </button>
            </Link>
            <Link href="/account/cart">
              <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer relative">
                <ShoppingCart size={20} className="lg:w-6 lg:h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
                <span className='text-[10px] lg:text-xs'>Cart</span>
              </button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:text-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 backdrop-blur-sm bg-black/50 z-40 animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sliding Sidebar Panel */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-[90%] bg-white z-50 shadow-2xl animate-slideInRight overflow-y-auto text-dark">
            {/* Header */}
            <div className="sticky top-0 bg-primary text-white px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Section */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleMobileSearch(mobileSearchQuery)
                      setMobileMenuOpen(false)
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-transparent text-dark text-sm placeholder:text-gray-400 focus:outline-none min-w-0"
                />
                <button 
                  className="bg-[#B8994B] text-white w-12 py-3 hover:opacity-90 transition-all flex items-center justify-center shrink-0"
                  onClick={() => {
                    handleMobileSearch(mobileSearchQuery)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Search size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* User Section */}
            <div className="px-6 py-4 border-b border-gray-200 bg-secondary/30">
              {user ? (
                <Link href="/account/profile" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark">{user.fullName || 'User'}</p>
                      <p className="text-xs text-gray-600">View Profile</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark">Login / Sign Up</p>
                      <p className="text-xs text-gray-600">Access your account</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* Quick Links */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 py-2 hover:text-accent transition-colors">
                    <MdOutlineShoppingBag size={20} />
                    <span className="text-sm font-medium">My Orders</span>
                  </div>
                </Link>
                <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 py-2 hover:text-accent transition-colors">
                    <Heart size={20} />
                    <span className="text-sm font-medium">Wishlist</span>
                  </div>
                </Link>
                <Link href="/account/cart" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 py-2 hover:text-accent transition-colors relative">
                    <ShoppingCart size={20} />
                    <span className="text-sm font-medium">Cart</span>
                    {cartItemCount > 0 && (
                      <span className="ml-auto bg-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {cartItemCount > 9 ? '9+' : cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="px-6 py-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href="/categories" 
                    className="block py-2 text-sm font-medium hover:text-accent transition-colors" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    All Categories
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories?category=${encodeURIComponent(category.categoryName)}`}
                      className="block py-2 text-sm hover:text-accent transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.categoryName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </nav>
  )
}