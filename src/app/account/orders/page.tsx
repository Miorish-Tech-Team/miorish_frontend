'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import AccountSidebar from '@/components/AccountSidebar'

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All orders')

  const orders = [
    {
      id: 1,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78,
      quantity: 2,
      status: 'delivered',
      deliveryDate: '15th oct',
      hasReview: true
    },
    {
      id: 2,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78,
      quantity: 2,
      status: 'cancelled',
      deliveryDate: '10th oct'
    },
    {
      id: 3,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78,
      quantity: 2,
      status: 'arriving',
      deliveryDate: 'today 11pm'
    },
    {
      id: 4,
      image: '/images/CardImage.jpg',
      title: 'Mithril Candles',
      description: 'Malt Peda Soy Wax Candle By Miorish',
      price: 234.78,
      quantity: 2,
      status: 'delivered',
      deliveryDate: '15th oct',
      hasReview: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600'
      case 'cancelled':
        return 'text-red-600'
      case 'arriving':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusText = (order: {status: string, deliveryDate: string}) => {
    switch (order.status) {
      case 'delivered':
        return `Delivered on ${order.deliveryDate}`
      case 'cancelled':
        return `Canceled on ${order.deliveryDate}`
      case 'arriving':
        return `Arriving by ${order.deliveryDate}`
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-8 md:px-25 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Orders</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="orders" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-serif text-dark">Order History</h1>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option>All orders</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                    <option>Arriving</option>
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search your order here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-24 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button className="absolute right-0 top-0 bottom-0 px-6 bg-accent text-white rounded-r text-sm font-medium hover:bg-opacity-90 transition-colors">
                    Search Order
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Product</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Quantity</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 bg-secondary rounded-lg overflow-hidden shrink-0">
                              <Image 
                                src={order.image} 
                                alt={order.title}
                                loading='eager'
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-dark text-sm mb-1">
                                {order.title} <span className="text-gray-500">- {order.description}</span>
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-dark font-medium">Rs {order.price}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-dark">{order.quantity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                              order.status === 'delivered' ? 'bg-green-600' : 
                              order.status === 'cancelled' ? 'bg-red-600' : 
                              'bg-blue-600'
                            }`}></div>
                            <div>
                              <p className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order)}
                              </p>
                              {order.hasReview && (
                                <Link href="#" className="text-xs text-accent hover:underline">
                                  Rate & Review →
                                </Link>
                              )}
                            </div>
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
