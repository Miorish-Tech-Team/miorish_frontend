'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AccountSidebar from '@/components/AccountSidebar'
import { OrderCardSkeleton } from '@/components/skeleton'
import { getUserOrders, type Order } from '@/services/orderService'
import { toast } from 'react-hot-toast'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All orders')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getUserOrders()
      setOrders(response.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600'
      case 'cancelled':
        return 'text-red-600'
      case 'processing':
      case 'pending':
        return 'text-blue-600'
      case 'shipped':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusText = (order: Order) => {
    const status = order.orderStatus.toLowerCase()
    const date = new Date(order.updatedAt).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    })
    
    switch (status) {
      case 'delivered':
        return `Delivered on ${date}`
      case 'cancelled':
        return `Canceled on ${date}`
      case 'shipped':
        return `Shipped on ${date}`
      case 'processing':
      case 'pending':
        return `Processing since ${date}`
      default:
        return `Status: ${order.orderStatus}`
    }
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.uniqueOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderItems?.some(item => 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    const matchesStatus = filterStatus === 'All orders' || 
      order.orderStatus.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

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
                    <option>Processing</option>
                    <option>Shipped</option>
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by order ID or product name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-4 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Order Details</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Items</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => (
                        <OrderCardSkeleton key={i} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg font-medium mb-2">No orders found</p>
                  <p className="text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
                  <Link href="/categories" className="inline-block px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium">
                    Browse Products
                  </Link>
                </div>
              ) : (
                /* Orders Table */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Order Details</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Total</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Items</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-dark">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-dark text-sm mb-1">
                                Order #{order.uniqueOrderId}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-dark font-medium">₹{order.totalAmount.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-dark">{order.orderItems?.length || 0} item(s)</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                order.orderStatus.toLowerCase() === 'delivered' ? 'bg-green-600' : 
                                order.orderStatus.toLowerCase() === 'cancelled' ? 'bg-red-600' :
                                order.orderStatus.toLowerCase() === 'shipped' ? 'bg-yellow-600' :
                                'bg-blue-600'
                              }`}></div>
                              <div>
                                <p className={`text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                  {getStatusText(order)}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Payment: {order.paymentStatus}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link 
                              href={`/orders/${order.id}`}
                              className="text-sm text-accent hover:underline font-medium"
                            >
                              View Details →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
