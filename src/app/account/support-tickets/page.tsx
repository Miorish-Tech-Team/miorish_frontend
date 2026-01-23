'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AccountSidebar from '@/components/layout/AccountSidebar'
import { getMyTickets, getTicketsByStatus, type Ticket } from '@/services/ticketService'
import { toast } from 'react-hot-toast'
import { Plus, MessageSquare } from 'lucide-react'
import CreateTicketModal from '@/components/modals/CreateTicketModal'
import TicketDetailModal from '@/components/modals/TicketDetailModal'

export default function SupportTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)

  useEffect(() => {
    fetchTickets()
  }, [filterStatus])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      let response
      if (filterStatus === 'all') {
        response = await getMyTickets()
      } else {
        response = await getTicketsByStatus(filterStatus)
      }
      setTickets(response.tickets || [])
    } catch (error) {
      console.error('Error fetching tickets:', error)
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowDetailModal(true)
  }

  const handleTicketCreated = () => {
    fetchTickets()
  }

  const handleTicketUpdated = () => {
    fetchTickets()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase()
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-25 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Support Tickets</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="support" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-dark">Support Tickets</h1>
                  <p className="text-gray-600 text-sm mt-1">
                    {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} found
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition"
                >
                  <Plus size={18} />
                  Create Ticket
                </button>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filterStatus === status
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All Tickets' : getStatusLabel(status)}
                  </button>
                ))}
              </div>

              {/* Tickets List */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent"></div>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg font-medium">No tickets found</p>
                  <p className="text-gray-500 text-sm mt-1">Create a new support ticket to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket)}
                      className="w-full text-left block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-accent transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            #{ticket.ticketNumber}
                          </span>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                            {getStatusLabel(ticket.status)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-dark mb-2 text-lg">{ticket.subject}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                      {ticket.messages && ticket.messages.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <MessageSquare size={14} />
                          <span>{ticket.messages.length} {ticket.messages.length === 1 ? 'message' : 'messages'}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTicketCreated={handleTicketCreated}
      />

      <TicketDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        ticket={selectedTicket}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  )
}
