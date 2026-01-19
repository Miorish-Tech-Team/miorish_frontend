'use client'

import { useState } from 'react'
import { X, Star, Upload, Loader2 } from 'lucide-react'
import { reviewAPI } from '@/services/reviewService'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

interface ReviewFormModalProps {
  isOpen: boolean
  onClose: () => void
  productId: number
  productName: string
  onReviewSubmitted: () => void
  existingReview?: {
    id: number
    rating: number
    reviewText: string
    reviewPhoto?: string
  } | null
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmitted,
  existingReview
}: ReviewFormModalProps) {
  const isEditMode = !!existingReview
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '')
  const [reviewPhoto, setReviewPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(existingReview?.reviewPhoto || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setReviewPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setReviewPhoto(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    if (!reviewText.trim()) {
      toast.error('Please write a review')
      return
    }

    setIsSubmitting(true)

    try {
      if (isEditMode && existingReview) {
        // Update existing review
        await reviewAPI.updateReview(existingReview.id, {
          rating,
          reviewText: reviewText.trim(),
          reviewPhoto: reviewPhoto || undefined
        })
        toast.success('Review updated successfully!')
      } else {
        // Add new review
        await reviewAPI.addReview({
          productId,
          rating,
          reviewText: reviewText.trim(),
          reviewPhoto: reviewPhoto || undefined
        })
        toast.success('Review submitted successfully!')
      }

      onReviewSubmitted()
      handleClose()
    } catch (err) {
      const error = err as { response?: { data?: { message?: string; existingReview?: any } } }
      const errorMessage = error.response?.data?.message
      
      // If user already has a review, show specific message
      if (errorMessage?.includes('already reviewed')) {
        toast.error('You have already reviewed this product. Please edit your existing review from your orders page.')
      } else {
        toast.error(errorMessage || (isEditMode ? 'Failed to update review' : 'Failed to submit review'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoverRating(0)
    setReviewText('')
    setReviewPhoto(null)
    setPhotoPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-dark">{isEditMode ? 'Edit Review' : 'Write a Review'}</h2>
            <p className="text-sm text-gray-600 mt-1">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isSubmitting}
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoverRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <label htmlFor="reviewText" className="block text-sm font-medium text-dark mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm resize-none"
              placeholder="Share your experience with this product..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length} characters
            </p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">
              Add Photo (Optional)
            </label>
            {!photoPreview ? (
              <div className="relative">
                <input
                  type="file"
                  id="reviewPhoto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <label
                  htmlFor="reviewPhoto"
                  className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-600">Click to upload image</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB
                </p>
              </div>
            ) : (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={photoPreview}
                  alt="Review preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-dark font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 size={20} className="animate-spin" />}
              {isSubmitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Review' : 'Submit Review')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
