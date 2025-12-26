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
      <div className='w-full h-4 md:h-6 bg-accent'></div>
      <div className="container mx-auto px-4 py-2 md:py-1">
        <div className="flex items-center justify-between lg:justify-center gap-4 lg:gap-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/MiorishLogo.png"
                alt="Miorish Logo"
                width={80}
                loading='eager'
                height={80}
                className="object-contain md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]"
              />
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8 relative" ref={suggestionsRef}>
            <div className="flex w-full bg-white rounded-lg overflow-hidden">
              <div className="relative" ref={categoryDropdownRef}>
                <button 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-dark text-sm border-r border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span className="max-w-[100px] truncate">{searchCategory}</span>
                  <ChevronDown size={16} />
                </button>
                
                {/* Category Dropdown */}
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
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
              
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="flex-1 px-4 py-2.5 text-dark text-sm focus:outline-none"
              />
              
              <button 
                className="bg-accent text-white px-6 py-2.5 text-sm hover:bg-opacity-90 transition-colors"
                onClick={() => handleSearch(searchQuery)}
              >
                Search
              </button>
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && (searchQuery.trim().length >= 2) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isLoadingSuggestions ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Loading suggestions...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Search size={14} className="text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No suggestions found</div>
                )}
              </div>
            )}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            <button className="hidden md:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
              <BellIcon size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
              <span className='text-[10px] lg:text-xs'>Notification</span>
            </button>
            {user ? (
              <Link href="/account/profile">
                <button className="hidden sm:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
                  <User size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  <span className='text-[10px] lg:text-xs'>Profile</span>
                </button>
              </Link>) : (
              <Link href="/auth/login">
                <button className="hidden sm:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
                  <User size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  <span className='text-[10px] lg:text-xs'>Login</span>
                </button>
              </Link>)}
            <Link href="/account/wishlist">
              <button className="hidden sm:flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer">
                <Heart size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <span className='text-[10px] lg:text-xs'>Wishlist</span>
              </button>
            </Link>
            <Link href="/cart">
              <button className="flex flex-col items-center justify-center gap-1 hover:text-accent transition-colors cursor-pointer relative">
                <ShoppingCart size={20} className="md:w-5 md:h-5 lg:w-6 lg:h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
                <span className='text-[10px] lg:text-xs'>Cart</span>
              </button>
            </Link>
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
      <div className="lg:hidden px-4 pb-3 relative" ref={mobileSuggestionsRef}>
        <div className="flex w-full bg-secondary rounded-xl overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            value={mobileSearchQuery}
            onChange={(e) => setMobileSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMobileSearch(mobileSearchQuery)}
            className="w-full px-4 py-2 text-dark text-sm focus:outline-none"
          />
          <button 
            className="bg-accent text-white px-4 py-2 text-sm"
            onClick={() => handleMobileSearch(mobileSearchQuery)}
          >
            <Search size={16} />
          </button>
        </div>
        
        {/* Mobile Search Suggestions Dropdown */}
        {showMobileSuggestions && (mobileSearchQuery.trim().length >= 2) && (
          <div className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {mobileSuggestions.length > 0 ? (
              mobileSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-2"
                  onClick={() => handleMobileSuggestionClick(suggestion)}
                >
                  <Search size={14} className="text-gray-400" />
                  <span>{suggestion}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">No suggestions found</div>
            )}
          </div>
        )}
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