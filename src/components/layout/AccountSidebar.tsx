'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Key, Package, Heart, MapPin, Settings, LogOut, Menu, X, ChevronRight, ShoppingCart, Star, HelpCircle, Wallet } from 'lucide-react'
import { authAPI } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface AccountSidebarProps {
  activePage: 'profile' | 'password' | 'orders' | 'wishlist' | 'address' | 'settings' | 'cart'
}

export default function AccountSidebar({ activePage }: AccountSidebarProps) {
  const {user} = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async() => {
    try {
      const response = await authAPI.logout();
      window.location.href = '/';
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      console.error('Logout error:', error.response?.data?.message || 'Logout failed.')
    }
  }

  const menuItems = [
    { href: '/account/profile', icon: User, label: 'My Profile', page: 'profile' },
    { href: '/account/orders', icon: Package, label: 'My Orders', page: 'orders' },
    { href: '/account/cart', icon: ShoppingCart, label: 'My cart', page: 'cart' },
    { href: '/account/wishlist', icon: Heart, label: 'My Wishlist', page: 'wishlist' },
    { href: '/account/address', icon: MapPin, label: 'Manage Address', page: 'address' },
    { href: '/account/change-password', icon: Key, label: 'Change Password', page: 'password' },
    { href: '/account/settings', icon: Settings, label: 'Settings', page: 'settings' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full flex items-center justify-between bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="text-left">
              <div className="font-semibold text-dark text-sm">{user?.fullName || 'User'}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">ACCOUNT SETTINGS</div>
            </div>
          </div>
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Mobile Full Screen Modal with Backdrop */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sliding Menu Panel */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-[90%] max-w-sm bg-white z-50 shadow-2xl animate-slideInRight overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-dark">Account Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className='text-gray-800' size={24} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="pb-6">
              {/* User Info */}
              <div className="p-5 bg-linear-to-br from-[#FFF9E6] to-[#FFF5DB]">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shrink-0">
                    {user?.profilePhoto ? (
                      <Image
                        src={user.profilePhoto}
                        alt="Profile Photo"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                        unoptimized
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-dark truncate">{user?.fullName || 'User'}</h3>
                    <p className="text-xs text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="py-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.page;
                  return (
                    <Link 
                      key={item.page}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between gap-3 px-5 py-4 transition-all ${
                        isActive
                          ? 'bg-[#FFF9E6] border-l-4 border-accent' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Icon 
                          size={20} 
                          className={isActive ? 'text-accent' : 'text-gray-600'} 
                          strokeWidth={2}
                        />
                        <span className={`text-sm font-medium ${
                          isActive ? 'text-accent' : 'text-gray-700'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight 
                        size={18} 
                        className={isActive ? 'text-accent' : 'text-gray-400'} 
                      />
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition-all mt-2 border-t border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <LogOut size={20} strokeWidth={2} />
                    <span className="text-sm font-medium">Logout</span>
                  </div>
                  <ChevronRight size={18} className="text-red-400" />
                </button>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:col-span-1">
        <div className="rounded-xl overflow-hidden bg-white shadow-md">
        {/* User Info */}
        <div className="p-5 bg-linear-to-br from-[#FFF9E6] to-[#FFF5DB]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shrink-0">
              {user?.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt="Profile Photo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-dark truncate">{user?.fullName || 'User'}</h3>
              <p className="text-xs text-gray-600 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;
            return (
              <Link 
                key={item.page}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between gap-3 px-5 py-4 transition-all group ${
                  isActive
                    ? 'bg-[#FFF9E6] border-l-4 border-accent' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-accent' : 'text-gray-600 group-hover:text-accent'} 
                    strokeWidth={2}
                  />
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-accent' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight 
                  size={18} 
                  className={isActive ? 'text-accent' : 'text-gray-400 group-hover:text-gray-600'} 
                />
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-red-600 hover:bg-red-50 transition-all group mt-2 border-t border-gray-100"
          >
            <div className="flex items-center gap-4">
              <LogOut size={20} strokeWidth={2} />
              <span className="text-sm font-medium">Logout</span>
            </div>
            <ChevronRight size={18} className="text-red-400 group-hover:text-red-600" />
          </button>
        </nav>
      </div>
    </aside>
    </>
  )
}
