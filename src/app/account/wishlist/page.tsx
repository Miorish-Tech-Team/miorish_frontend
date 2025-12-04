'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import AccountSidebar from '@/components/AccountSidebar'

export default function WishlistPage() {
  const [filterDays, setFilterDays] = useState('Last 7 days')

  const wishlistItems = [
    {
      id: 1,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78
    },
    {
      id: 2,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78
    },
    {
      id: 3,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78
    },
    {
      id: 4,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78
    }
  ]

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Wishlist</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="wishlist" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-2xl md:text-3xl font-serif text-dark">Wishlist</h1>
                  <select 
                    value={filterDays}
                    onChange={(e) => setFilterDays(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>All time</option>
                  </select>
                </div>
              </div>

              {/* Wishlist Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Price</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-dark">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistItems.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                              <Image 
                                src={item.image} 
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-dark text-sm mb-1">
                                {item.title} <span className="text-gray-500">- {item.description}</span>
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-dark font-medium">Rs {item.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
