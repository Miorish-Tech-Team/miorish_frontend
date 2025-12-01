'use client'

import Image from 'next/image'
import { ArrowUp} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 pt-12 pb-6">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center">
          {/* Logo and Description */}
          <div className='h-full my-auto flex items-center justify-center'>
            <Image 
              src="/images/MiorishLogo.png" 
              alt="Miorish Logo" 
              width={160} 
              height={160}
              className="object-contain mb-4"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-accent">
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-accent">
              <li><a href="#" className="hover:text-accent transition-colors">My Account</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Login / Register</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Cart</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Wishlist</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shop</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-accent text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-accent">
              <li><a href="#" className="hover:text-accent transition-colors">Helpline: +91-XXXXXXXXXX</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Email: support@miorish.com</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Customer Support</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Chat with Us</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className=" mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="w-full text-sm text-accent/50 text-center">
            Copyrights Miorish &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          
          {/* Social Icons */}
          {/* <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="bg-accent rounded-full p-2 hover:bg-opacity-80 transition-all">
              <Facebook size={18} />
            </a>
            <a href="#" className="bg-accent rounded-full p-2 hover:bg-opacity-80 transition-all">
              <Instagram size={18} />
            </a>
            <a href="#" className="bg-accent rounded-full p-2 hover:bg-opacity-80 transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="bg-accent rounded-full p-2 hover:bg-opacity-80 transition-all">
              <Youtube size={18} />
            </a>
          </div> */}
        </div>

        <div className='fixed bottom-4 right-4 w-10 h-10 bg-accent rounded-full flex justify-center items-center cursor-pointer' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ArrowUp size={20} className="text-white absolute top-2 left-2 cursor-pointer"/>
        </div>
      </div>
    </footer>
  )
}
