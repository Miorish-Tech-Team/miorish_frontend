import axios from '@/lib/axios'

// Types
export interface TicketMessage {
  sender: 'user' | 'admin'
  message: string
  timestamp: string
  isCrossQuestion?: boolean
}

export interface Ticket {
  id: number
  ticketNumber: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'closed' | 'resolved'
  adminReply?: string
  messages: TicketMessage[]
  image?: string
  createdAt: string
  updatedAt?: string
  User?: {
    id: number
    fullName: string
    email: string
    phone?: string
  }
}

export interface CreateTicketResponse {
  success: boolean
  message: string
}

export interface GetTicketsResponse {
  tickets: Ticket[]
  count?: number
}

export interface ReplyResponse {
  success?: boolean
  message: string
  ticket?: Ticket
}

// API Functions
export const createTicket = async (formData: FormData): Promise<CreateTicketResponse> => {
  const response = await axios.post<CreateTicketResponse>('/support/user/raise-ticket', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getMyTickets = async (): Promise<GetTicketsResponse> => {
  const response = await axios.get<GetTicketsResponse>('/support/user/my-tickets')
  return response.data
}

export const getTicketsByStatus = async (status: string): Promise<GetTicketsResponse> => {
  const response = await axios.get<GetTicketsResponse>(`/support/user/my-tickets/status/${status}`)
  return response.data
}

export const replyToTicket = async (ticketId: string, reply: string): Promise<ReplyResponse> => {
  const response = await axios.post<ReplyResponse>(`/support/user/reply/${ticketId}`, { reply })
  return response.data
}
