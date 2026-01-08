'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { addAddress, type CreateAddressData, getStates, getDistricts, validatePincode } from '@/services/addressService'
import { toast } from 'react-hot-toast'

interface AddressFormModalProps {
  isOpen: boolean
  onClose: () => void
  onAddressAdded: () => void
}

export default function AddressFormModal({ isOpen, onClose, onAddressAdded }: AddressFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [states, setStates] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [pincodeValidation, setPincodeValidation] = useState<{
    isValidating: boolean
    isValid: boolean | null
    message: string
    verifiedState?: string
    verifiedDistrict?: string
  }>({
    isValidating: false,
    isValid: null,
    message: '',
    verifiedState: undefined,
    verifiedDistrict: undefined
  })
  
  const [formData, setFormData] = useState<CreateAddressData>({
    recipientName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phoneNumber: '',
    type: 'home',
    isDefault: false
  })

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await getStates()
        setStates(response.states)
      } catch (error) {
        console.error('Error fetching states:', error)
      }
    }
    fetchStates()
  }, [])

  // Fetch districts when state changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (formData.state) {
        try {
          const response = await getDistricts(formData.state)
          setDistricts(response.districts)
        } catch (error) {
          console.error('Error fetching districts:', error)
        }
      } else {
        setDistricts([])
      }
    }
    fetchDistricts()
  }, [formData.state])

  // Validate pincode when it reaches 6 digits
  useEffect(() => {
    if (formData.postalCode.length === 6) {
      handlePincodeValidation(formData.postalCode)
    } else {
      setPincodeValidation({
        isValidating: false,
        isValid: null,
        message: '',
        verifiedState: undefined,
        verifiedDistrict: undefined
      })
    }
  }, [formData.postalCode])

  const handlePincodeValidation = async (pincode: string) => {
    try {
      setPincodeValidation({
        isValidating: true,
        isValid: null,
        message: '',
        verifiedState: undefined,
        verifiedDistrict: undefined
      })
      
      const response = await validatePincode(pincode)
      
      let message = ''
      if (response.isValid) {
        if (response.verifiedBy === 'regex') {
          message = 'Valid pincode format ✓'
        } else if (response.state && response.district) {
          message = `Verified: ${response.district}, ${response.state}`
        } else {
          message = 'Valid pincode ✓'
        }
      } else {
        message = response.message || 'Invalid pincode'
      }
      
      setPincodeValidation({
        isValidating: false,
        isValid: response.isValid,
        message: message,
        verifiedState: response.state,
        verifiedDistrict: response.district
      })

      // Auto-fill state and district if API returns them (ALWAYS overwrite)
      if (response.isValid && response.state && response.district) {
        const stateChanged = formData.state && formData.state !== response.state
        const districtChanged = formData.city && formData.city !== response.district
        
        setFormData(prev => ({
          ...prev,
          state: response.state || prev.state,
          city: response.district || prev.city
        }))
        
        if (stateChanged || districtChanged) {
          toast(`State/District corrected based on pincode\n\nUpdated to: ${response.district}, ${response.state}`, {
            duration: 3000,
            icon: '🔄'
          })
        } else {
          toast.success('State and district auto-filled from pincode', {
            duration: 2000,
            icon: '📍'
          })
        }
      }
    } catch (error) {
      console.error('Error validating pincode:', error)
      setPincodeValidation({
        isValidating: false,
        isValid: null,
        message: '',
        verifiedState: undefined,
        verifiedDistrict: undefined
      })
    }
  }

  const handleStateChange = (newState: string) => {
    setFormData(prev => {
      const updatedData = {
        ...prev,
        state: newState,
        city: ''
      }
      
      if (prev.postalCode.length === 6 && pincodeValidation.isValid) {
        toast('State changed. Please verify pincode matches new state.', {
          icon: '⚠️',
          duration: 3000
        })
        setPincodeValidation({
          isValidating: false,
          isValid: null,
          message: '',
          verifiedState: undefined,
          verifiedDistrict: undefined
        })
      }
      
      return updatedData
    })
  }

  const handleDistrictChange = (newDistrict: string) => {
    setFormData(prev => ({
      ...prev,
      city: newDistrict
    }))
    
    if (formData.postalCode.length === 6 && pincodeValidation.isValid) {
      toast('District changed. Please verify pincode is correct.', {
        icon: '⚠️',
        duration: 3000
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate pincode
    if (pincodeValidation.isValid === false) {
      toast.error('Please enter a valid pincode')
      return
    }
    
    // Check if pincode matches state/district
    if (pincodeValidation.verifiedState && pincodeValidation.verifiedDistrict) {
      const stateMatches = pincodeValidation.verifiedState.toLowerCase() === formData.state.toLowerCase()
      const districtMatches = pincodeValidation.verifiedDistrict.toLowerCase() === formData.city.toLowerCase()
      
      if (!stateMatches || !districtMatches) {
        toast.error(
          `Pincode ${formData.postalCode} belongs to ${pincodeValidation.verifiedDistrict}, ${pincodeValidation.verifiedState}. Please correct the address.`,
          { duration: 5000 }
        )
        return
      }
    }
    
    try {
      setLoading(true)
      await addAddress(formData)
      toast.success('Address added successfully!')
      setFormData({
        recipientName: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phoneNumber: '',
        type: 'home',
        isDefault: false
      })
      setPincodeValidation({
        isValidating: false,
        isValid: null,
        message: '',
        verifiedState: undefined,
        verifiedDistrict: undefined
      })
      onAddressAdded()
      onClose()
    } catch (error: any) {
      console.error('Error adding address:', error)
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error, { duration: 5000 })
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        errors.forEach((err: string) => toast.error(err))
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Failed to add address')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Address</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-4 py-2 text-dark text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 text-dark text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 text-dark text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full appearance-none px-4 py-2 text-dark text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  disabled={!formData.state || districts.length === 0}
                  className="w-full appearance-none px-4 py-2 text-dark text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {!formData.state ? 'Select state first' : 'Select District'}
                  </option>
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d{0,6}$/.test(value)) {
                        setFormData({ ...formData, postalCode: value })
                      }
                    }}
                    className={`w-full px-4 py-2 pr-10 text-dark text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent ${
                      pincodeValidation.isValid === true
                        ? 'border-green-500'
                        : pincodeValidation.isValid === false
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder="273165"
                    maxLength={6}
                  />
                  {pincodeValidation.isValidating && (
                    <Loader2 
                      size={18} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" 
                    />
                  )}
                  {!pincodeValidation.isValidating && pincodeValidation.isValid === true && (
                    <CheckCircle2 
                      size={18} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" 
                    />
                  )}
                  {!pincodeValidation.isValidating && pincodeValidation.isValid === false && (
                    <XCircle 
                      size={18} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" 
                    />
                  )}
                </div>
                {pincodeValidation.message && (
                  <p className={`text-xs mt-1 ${
                    pincodeValidation.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {pincodeValidation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  disabled
                  className="w-full px-4 py-2 text-dark text-sm border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  placeholder="India"
                />
                <p className="text-xs text-gray-500 mt-1">Only Indian addresses are supported</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'work' | 'other' })}
                className="w-full appearance-none px-4 py-2 text-dark text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 accent-accent rounded cursor-pointer"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700 cursor-pointer">
                Set as default address
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Adding...' : 'Add Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
