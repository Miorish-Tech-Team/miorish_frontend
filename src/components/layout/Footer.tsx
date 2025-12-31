'use client'

import Image from 'next/image'
import { ArrowUp, Facebook, Instagram, Twitter } from 'lucide-react' // Added social icons
import { useAuth } from '@/contexts/AuthContext'
import { useAuthModal } from '@/contexts/AuthModalContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function Footer() {
  const { user } = useAuth()
  const { openLoginModal } = useAuthModal()
  const router = useRouter()

  const handleProtectedLink = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (!user) {
      e.preventDefault()
      toast.error('Please login to access this page')
      openLoginModal()
    } else {
      e.preventDefault()
      router.push(path)
    }
  }

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-20 lg:px-20 xl:px-30 py-8 md:py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          
          {/* Logo and Social Media */}
          <div className="flex flex-col items-center sm:items-start">
            <Image 
              src="/images/MiorishLogo.png" 
              alt="Miorish Logo" 
              width={250} 
              height={250}
              className="object-contain w-28 h-28 md:w-32 md:h-32 lg:w-48 lg:h-48 mb-4"
            />
            
            {/* Social Icons Container */}
            <div className="flex space-x-5 mt-2 ms-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full bg-accent  transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full bg-accent  transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white p-2 rounded-full bg-accent  transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-accent text-base md:text-lg font-bold mb-4 md:mb-5">Quick Links</h3>
            <ul className="space-y-2.5 text-accent font-light text-xs md:text-sm">
              <li><a href="/policies/shipping_delivery" className=" hover:text-accent transition-colors">Shipping Policy</a></li>
              {/* Updated to "Safe Delivery" as per previous discussion if desired */}
              <li><a href="/policies/refund_policy" className=" hover:text-accent transition-colors">Return Policy</a></li>
              <li><a href="/policies/terms_conditions" className=" hover:text-accent transition-colors">Terms & Conditions</a></li>
              <li><a href="/contact" className=" hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="/faqs" className=" hover:text-accent transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Account */}
          <div className="text-center sm:text-left">
            <h3 className="text-accent text-base md:text-lg font-bold mb-4 md:mb-5">Account</h3>
            <ul className="space-y-2.5 text-accent font-light text-xs md:text-sm">
              <li>
                <a 
                  href="/account/profile" 
                  onClick={(e) => handleProtectedLink(e, '/account/profile')}
                  className=" hover:text-accent transition-colors cursor-pointer"
                >
                  My Account
                </a>
              </li>
              {!user && (
                <li>
                  <button 
                    onClick={() => openLoginModal()} 
                    className="hover:text-accent transition-colors text-left"
                  >
                    Login / Register
                  </button>
                </li>
              )}
              <li>
                <a 
                  href="/account/cart" 
                  onClick={(e) => handleProtectedLink(e, '/account/cart')}
                  className=" hover:text-accent transition-colors cursor-pointer"
                >
                  Cart
                </a>
              </li>
              <li>
                <a 
                  href="/account/wishlist" 
                  onClick={(e) => handleProtectedLink(e, '/account/wishlist')}
                  className=" hover:text-accent transition-colors cursor-pointer"
                >
                  Wishlist
                </a>
              </li>
              <li><a href="/categories" className=" hover:text-accent transition-colors">Shop</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center sm:text-left">
            <h3 className="text-accent text-base md:text-lg font-bold mb-4 md:mb-5">Support</h3>
            <ul className="space-y-2.5 text-accent font-light text-xs md:text-sm">
              <li><span className="cursor-default">Helpline: +91-XXXXXXXXXX</span></li>
              <li><span className="cursor-default">Email: support@miorish.com</span></li>
              <li><a href="/contact" className=" hover:text-accent transition-colors">Customer Support</a></li>
              <li><a href="#" className=" hover:text-accent transition-colors">Chat with Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-12 -mb-10 md:pt-8 border-t border-accent/20">
          <p className="text-sm md:text-base text-accent/70 text-center">
            Copyright Miorish © {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>

        {/* Scroll to Top Button */}
        <button 
          className="fixed bottom-6 right-6 w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-accent rounded-full flex justify-center items-center cursor-pointer hover:bg-opacity-90 transition-all shadow-lg z-50" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="text-white md:w-6 md:h-6 lg:w-7 lg:h-7"/>
        </button>
      </div>
    </footer>
  )
}