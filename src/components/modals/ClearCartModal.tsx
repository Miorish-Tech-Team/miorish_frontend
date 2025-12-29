'use client'

import { X, AlertTriangle } from 'lucide-react'

interface ClearCartModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemCount: number
}

export default function ClearCartModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemCount 
}: ClearCartModalProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Clear Cart</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Are you sure you want to clear your cart?
          </p>
          <p className="text-gray-600 text-sm">
            This will remove <span className="font-semibold text-red-600">{itemCount}</span> {itemCount === 1 ? 'item' : 'items'} from your cart. This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-lg flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  )
}
