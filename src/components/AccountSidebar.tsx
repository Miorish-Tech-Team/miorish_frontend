'use client'

import Link from 'next/link'
import { User, Key, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { authAPI } from '@/services/authService'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

interface AccountSidebarProps {
  activePage: 'profile' | 'password' | 'orders' | 'wishlist' | 'address' | 'settings'
}

export default function AccountSidebar({ activePage }: AccountSidebarProps) {
  const {user} = useAuth();

  const handleLogout = async() => {
    try {
      const response = await authAPI.logout();
      console.log('Logout response:', response);
      window.location.href = '/';
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      console.error('Logout error:', error.response?.data?.message || 'Logout failed.')
    }
  }
  return (
    <aside className="lg:col-span-1">
      <div className="rounded-lg border border-accent overflow-hidden">
        {/* User Info */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="w-24 h-24 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
            <Image
              src={user?.profilePhoto || '/default-profile.png'}
              alt="Profile Photo"
              width={80}
              height={80}
              className="rounded-full"
            />
            {/* <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div> */}
          </div>
          <h3 className="text-lg font-semibold text-dark mb-1">{user?.fullName || 'John Doe'}</h3>
          <p className="text-sm text-gray-600">{user?.email || 'example@gmail.com'}</p>
        </div>

        {/* Menu Items */}
        <nav className="p-0">
          <Link 
            href="/account/profile" 
            className={`flex items-center border-t border-accent gap-3 px-6 py-3 ${
              activePage === 'profile' 
                ? 'bg-accent text-white hover:bg-opacity-90' 
                : 'text-accent hover:bg-secondary'
            } transition-colors`}
          >
            <User size={18} />
            <span className={`text-sm ${activePage === 'profile' ? 'font-medium' : ''}`}>My Profile</span>
          </Link>
          <Link 
            href="/account/change-password" 
            className={`flex items-center border-t border-accent gap-3 px-6 py-3 ${
              activePage === 'password' 
                ? 'bg-accent text-white hover:bg-opacity-90' 
                : 'text-accent hover:bg-secondary'
            } transition-colors`}
          >
            <Key size={18} />
            <span className={`text-sm ${activePage === 'password' ? 'font-medium' : ''}`}>Change Password</span>
          </Link>
          <Link 
            href="/account/orders" 
            className={`flex items-center border-t border-accent gap-3 px-6 py-3 ${
              activePage === 'orders' 
                ? 'bg-accent text-white hover:bg-opacity-90' 
                : 'text-accent hover:bg-secondary'
            } transition-colors`}
          >
            <Package size={18} />
            <span className={`text-sm ${activePage === 'orders' ? 'font-medium' : ''}`}>View Orders</span>
          </Link>
          <Link 
            href="/account/wishlist" 
            className={`flex items-center border-t border-accent gap-3 px-6 py-3 ${
              activePage === 'wishlist' 
                ? 'bg-accent text-white hover:bg-opacity-90' 
                : 'text-accent hover:bg-secondary'
            } transition-colors`}
          >
            <Heart size={18} />
            <span className={`text-sm ${activePage === 'wishlist' ? 'font-medium' : ''}`}>Wishlist</span>
          </Link>
          <Link 
            href="/account/address" 
            className={`flex items-center border-t border-accent gap-3 px-6 py-3 ${
              activePage === 'address' 
                ? 'bg-accent text-white hover:bg-opacity-90' 
                : 'text-accent hover:bg-secondary'
            } transition-colors`}
          >
            <MapPin size={18} />
            <span className={`text-sm ${activePage === 'address' ? 'font-medium' : ''}`}>Mange Address</span>
          </Link>

          <Link 
            href="/account/settings" 
            className={`flex items-center border-t border-accent gap-3 px-6 py-3 ${
              activePage === 'settings' 
                ? 'bg-accent text-white hover:bg-opacity-90' 
                : 'text-accent hover:bg-secondary'
            } transition-colors`}
          >
            <Settings size={18} />
            <span className={`text-sm ${activePage === 'settings' ? 'font-medium' : ''}`}>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-6 py-3 text-accent hover:bg-secondary transition-colors border-t border-accent"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  )
}
