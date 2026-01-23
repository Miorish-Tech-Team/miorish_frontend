'use client'

import { useState, useEffect } from 'react'
import { X, Send, Calendar, FileImage, User, Headphones, HelpCircle, Loader2 } from 'lucide-react'
import { replyToTicket, type Ticket, type TicketMessage } from '@/services/ticketService'
import { toast } from 'react-hot-toast'

interface TicketDetailModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
  onTicketUpdated?: () => void
}

export default function TicketDetailModal({ isOpen, onClose, ticket: initialTicket, onTicketUpdated }: TicketDetailModalProps) {
  const [ticket, setTicket] = useState<Ticket | null>(initialTicket)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isOpen && initialTicket) {
      setTicket(initialTicket)
    }
  }, [isOpen, initialTicket])

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!replyText.trim()) {
      toast.error('Please enter a reply')
      return
    }

    if (!ticket || ticket.status === 'closed') {
      toast.error('Cannot reply to a closed ticket')
      return
    }

    try {
      setSending(true)
      const response = await replyToTicket(ticket.id.toString(), replyText)
      
      toast.success('Reply sent successfully!')
      setReplyText('')
      
      // Update local ticket with the response if available
      if (response.ticket) {
        setTicket(response.ticket)
      }
      
      // Notify parent to refresh the ticket list
      if (onTicketUpdated) onTicketUpdated()
    } catch (error: any) {
      console.error('Error sending reply:', error)
      toast.error(error.response?.data?.error || 'Failed to send reply')
    } finally {
      setSending(false)
    }
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

  const handleClose = () => {
    setReplyText('')
    setTicket(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-dark truncate">
              {ticket ? `Ticket #${ticket.ticketNumber}` : 'Ticket Details'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition ml-4"
            disabled={sending}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        {ticket ? (
          <div className="p-6 space-y-6">
            {/* Ticket Header Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-dark flex-1">{ticket.subject}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                  {getStatusLabel(ticket.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Created</p>
                  <div className="flex items-center gap-2 text-dark">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm">
                      {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                {ticket.updatedAt && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Last Updated</p>
                    <span className="text-dark text-sm">
                      {new Date(ticket.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Description</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
              {ticket.image && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <FileImage size={16} />
                    <span>Attachment</span>
                  </div>
                  <a
                    href={ticket.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img
                      src={ticket.image}
                      alt="Attachment"
                      className="max-w-xs rounded-lg border border-gray-200 hover:shadow-md transition"
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Conversation */}
            <div>
              <h4 className="text-sm font-bold text-dark mb-4">Conversation</h4>

              {(!ticket.messages || ticket.messages.length === 0) && !ticket.adminReply ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Headphones size={40} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 text-sm">No messages yet</p>
                  <p className="text-gray-500 text-xs mt-1">Our support team will respond soon</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {/* Backward compatibility: Show adminReply if no messages */}
                  {ticket.adminReply && (!ticket.messages || ticket.messages.length === 0) && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Headphones size={16} className="text-blue-600" />
                        <span className="font-semibold text-blue-900 text-sm">Support Team</span>
                      </div>
                      <p className="text-blue-900 leading-relaxed whitespace-pre-wrap text-sm">{ticket.adminReply}</p>
                    </div>
                  )}

                  {/* Message thread */}
                  {ticket.messages && ticket.messages.map((msg: TicketMessage, idx: number) => {
                    const isAdmin = msg.sender === 'admin'
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border-l-4 ${
                          isAdmin
                            ? 'bg-blue-50 border-blue-500'
                            : 'bg-gray-50 border-gray-400 ml-6'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          {isAdmin ? (
                            <Headphones size={14} className="text-blue-600" />
                          ) : (
                            <User size={14} className="text-gray-600" />
                          )}
                          <span className={`font-semibold text-xs ${isAdmin ? 'text-blue-900' : 'text-gray-900'}`}>
                            {isAdmin ? 'Support Team' : 'You'}
                          </span>
                          {msg.isCrossQuestion && (
                            <span className="ml-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <HelpCircle size={10} />
                              Question
                            </span>
                          )}
                          <span className="text-xs text-gray-500 ml-auto">
                            {new Date(msg.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap text-gray-800 text-sm">{msg.message}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Reply Form */}
              {ticket.status !== 'closed' ? (
                <div className="pt-4 border-t border-gray-200">
                  <form onSubmit={handleReplySubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Your Reply</label>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none text-sm"
                        maxLength={1000}
                        disabled={sending}
                      />
                      <p className="text-xs text-gray-500 mt-1">{replyText.length}/1000 characters</p>
                    </div>

                    <button
                      type="submit"
                      disabled={sending || !replyText.trim()}
                      className="flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg hover:bg-accent/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-700 font-medium text-sm">This ticket is closed</p>
                  <p className="text-xs text-gray-600 mt-1">
                    You cannot reply anymore. Please create a new ticket if you need further assistance.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Ticket not found</p>
          </div>
        )}
      </div>
    </div>
  )
}
