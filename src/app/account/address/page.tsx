'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Loader2, Pencil, Trash2, Check, CheckCircle2, XCircle } from 'lucide-react'
import AccountSidebar from '@/components/layout/AccountSidebar'
import { AddressCardSkeleton } from '@/components/skeleton'
import { 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress,
  getStates,
  getDistricts,
  validatePincode,
  type Address,
  type CreateAddressData 
} from '@/services/addressService'
import { toast } from 'react-hot-toast'
import DeleteAddressModal from '@/components/modals/DeleteAddressModal'

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [addressIdToDelete, setAddressIdToDelete] = useState<number | null>(null)
  
  // Indian address validation states
  const [states, setStates] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [loadingDistricts, setLoadingDistricts] = useState(false)
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
    city: '', // This will be district
    state: '',
    postalCode: '',
    country: 'India',
    phoneNumber: '',
    type: 'home',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
    fetchStates()
  }, [])

  // Fetch districts when state changes
  useEffect(() => {
    if (formData.state) {
      fetchDistricts(formData.state)
    } else {
      setDistricts([])
      // Clear district when state is cleared
      if (formData.city) {
        setFormData(prev => ({ ...prev, city: '' }))
      }
    }
  }, [formData.state])

  // Validate pincode when it's 6 digits
  useEffect(() => {
    if (formData.postalCode.length === 6) {
      handlePincodeValidation(formData.postalCode)
    } else {
      setPincodeValidation({
        isValidating: false,
        isValid: null,
        message: ''
      })
    }
  }, [formData.postalCode])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await getUserAddresses()
      setAddresses(response.addresses)
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setLoading(false)
    }
  }

  const fetchStates = async () => {
    try {
      const response = await getStates()
      setStates(response.states)
    } catch (error) {
      console.error('Error fetching states:', error)
      toast.error('Failed to load states')
    }
  }

  const fetchDistricts = async (state: string) => {
    try {
      setLoadingDistricts(true)
      const response = await getDistricts(state)
      setDistricts(response.districts)
    } catch (error) {
      console.error('Error fetching districts:', error)
      setDistricts([])
    } finally {
      setLoadingDistricts(false)
    }
  }

  const handlePincodeValidation = async (pincode: string) => {
    try {
      setPincodeValidation({
        isValidating: true,
        isValid: null,
        message: ''
      })
      
      const response = await validatePincode(pincode)
      
      // Customize message based on verification type
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

      // Auto-fill state and district if API returns them
      if (response.isValid && response.state && response.district) {
        const stateChanged = formData.state && formData.state !== response.state
        const districtChanged = formData.city && formData.city !== response.district
        
        // Only auto-fill if fields are empty OR if state/district changed
        setFormData(prev => ({
          ...prev,
          state: response.state || prev.state, // Always set state from pincode
          city: !prev.city || districtChanged ? (response.district || prev.city) : prev.city // Auto-fill district only if empty
        }))
        
        // Show appropriate message
        if (stateChanged) {
          toast(`State set to: ${response.state} (from pincode)`, {
            duration: 3000,
            icon: '🔒'
          })
        } else if (!formData.city) {
          toast.success(`Auto-filled: ${response.district}, ${response.state}`, {
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
        message: ''
      })
    }
  }

  const handleStateChange = (newState: string) => {
    // If pincode is validated and has verified state, don't allow state change
    if (pincodeValidation.isValid && pincodeValidation.verifiedState) {
      toast.error('Cannot change state when pincode is verified. Clear pincode to change state.', {
        duration: 3000,
        icon: '🔒'
      })
      return
    }
    
    // When state changes, clear district
    setFormData(prev => ({
      ...prev,
      state: newState,
      city: '' // Clear district when state changes
    }))
  }

  const handleDistrictChange = (newDistrict: string) => {
    setFormData(prev => ({
      ...prev,
      city: newDistrict
    }))
    // Allow free editing of district (no warnings)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // For pincode, only allow digits and max 6 characters
    if (name === 'postalCode') {
      if (!/^\d{0,6}$/.test(value)) return
    }
    
    // Handle state change separately for validation
    if (name === 'state') {
      handleStateChange(value)
      return
    }
    
    // Handle district change separately for validation
    if (name === 'city') {
      handleDistrictChange(value)
      return
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    })
  }

  const resetForm = () => {
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
    setEditingId(null)
    setShowAddForm(false)
    setDistricts([])
    setPincodeValidation({
      isValidating: false,
      isValid: null,
      message: ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Additional frontend validation
    if (pincodeValidation.isValid === false) {
      toast.error('Please enter a valid pincode')
      return
    }
    
    // Only check if state matches pincode (district can be edited freely)
    if (pincodeValidation.verifiedState) {
      const stateMatches = pincodeValidation.verifiedState.toLowerCase() === formData.state.toLowerCase()
      
      if (!stateMatches) {
        toast.error(
          `Pincode ${formData.postalCode} belongs to ${pincodeValidation.verifiedState}. State cannot be changed.`,
          { duration: 5000 }
        )
        return
      }
    }
    
    try {
      setSubmitting(true)
      
      if (editingId) {
        await updateAddress(editingId, formData)
        toast.success('Address updated successfully!')
      } else {
        await addAddress(formData)
        toast.success('Address added successfully!')
      }
      
      await fetchAddresses()
      resetForm()
    } catch (error: any) {
      console.error('Error saving address:', error)
      
      // Display backend validation errors if available
      if (error.response?.data?.error) {
        toast.error(error.response.data.error, { duration: 5000 })
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        errors.forEach((err: string) => toast.error(err))
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error(editingId ? 'Failed to update address' : 'Failed to add address')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (address: Address) => {
    setFormData({
      recipientName: address.recipientName,
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phoneNumber: address.phoneNumber,
      type: address.type || 'home',
      isDefault: address.isDefault
    })
    setEditingId(address.id)
    setShowAddForm(true)
  }

  const handleDeleteClick = (id: number) => {
    setAddressIdToDelete(id)
  }

  const handleConfirmDelete = async () => {
    if (!addressIdToDelete) return

    try {
      setDeletingId(addressIdToDelete)
      await deleteAddress(addressIdToDelete)
      toast.success('Address deleted successfully!')
      await fetchAddresses()
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Failed to delete address')
    } finally {
      setDeletingId(null)
      setAddressIdToDelete(null)
    }
  }

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultAddress(id)
      toast.success('Default address updated!')
      await fetchAddresses()
    } catch (error) {
      console.error('Error setting default address:', error)
      toast.error('Failed to set default address')
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
          <span className="text-dark">Manage Address</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="address" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-serif text-dark">Shipping Address</h1>
                <button 
                  onClick={() => {
                    resetForm()
                    setShowAddForm(!showAddForm)
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-accent border border-accent cursor-pointer rounded hover:bg-opacity-90 transition-colors text-sm"
                >
                  <Plus size={18} />
                  {showAddForm ? 'Cancel' : 'Add Address'}
                </button>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <AddressCardSkeleton key={i} />
                  ))}
                </div>
              ) : addresses.length === 0 && !showAddForm ? (
                <div className="text-center py-20">
                  <p className="text-gray-600 text-lg font-medium mb-2">No addresses found</p>
                  <p className="text-gray-500 text-sm mb-6">Add your first shipping address</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    <Plus size={18} />
                    Add Address
                  </button>
                </div>
              ) : (
                <>
                  {/* Saved Addresses */}
                  {!showAddForm && addresses.length > 0 && (
                    <div className="space-y-4 mb-8">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-3">
                                <h3 className="font-semibold text-dark">{addr.recipientName}</h3>
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium flex items-center gap-1">
                                    <Check size={12} />
                                    Default
                                  </span>
                                )}
                                {addr.type && (
                                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">
                                    {addr.type}
                                  </span>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Address</p>
                                  <p className="text-sm text-dark">{addr.street}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">City</p>
                                  <p className="text-sm text-dark">{addr.city}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">State</p>
                                  <p className="text-sm text-dark">{addr.state}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Postal Code</p>
                                  <p className="text-sm text-dark">{addr.postalCode}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Country</p>
                                  <p className="text-sm text-dark">{addr.country}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                                  <p className="text-sm text-dark">{addr.phoneNumber}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex md:flex-col gap-2">
                              <button
                                onClick={() => handleEdit(addr)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 cursor-pointer transition-colors"
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              {!addr.isDefault && (
                                <button
                                  onClick={() => handleSetDefault(addr.id)}
                                  className="px-3 py-1.5 border border-accent/70 text-accent hover:text-white hover:bg-accent/70 rounded text-xs cursor-pointer transition-colors"
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteClick(addr.id)}
                                disabled={deletingId === addr.id}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-dark/5 text-dark rounded text-xs hover:bg-dark/70 hover:text-secondary cursor-pointer transition-colors disabled:opacity-50"
                              >
                                {deletingId === addr.id ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add/Edit Address Form */}
                  {showAddForm && (
                    <div className="border-t pt-6">
                      <h2 className="text-xl font-serif text-dark mb-4">
                        {editingId ? 'Edit Address' : 'Add New Address'}
                      </h2>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="recipientName"
                              required
                              value={formData.recipientName}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border text-dark border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              name="phoneNumber"
                              required
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border text-dark border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                              placeholder="1234567890"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="street"
                              required
                              value={formData.street}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 text-dark border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                              placeholder="123 Main Street, Apt 4B"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="state"
                              required
                              value={formData.state}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 text-dark border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer"
                            >
                              <option value="">Select State</option>
                              {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              District <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="city"
                              required
                              value={formData.city}
                              onChange={handleInputChange}
                              disabled={!formData.state || loadingDistricts}
                              className="w-full px-4 py-2 text-dark border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                              <option value="">
                                {loadingDistricts ? 'Loading districts...' : 'Select District'}
                              </option>
                              {districts.map(district => (
                                <option key={district} value={district}>{district}</option>
                              ))}
                            </select>
                            {!formData.state && (
                              <p className="text-xs text-gray-500 mt-1">Please select a state first</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pincode <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="postalCode"
                                required
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                maxLength={6}
                                className={`w-full px-4 py-2 text-dark border rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                                  pincodeValidation.isValid === true 
                                    ? 'border-green-500' 
                                    : pincodeValidation.isValid === false 
                                    ? 'border-red-500' 
                                    : 'border-gray-300'
                                }`}
                                placeholder="400001"
                              />
                              {pincodeValidation.isValidating && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <Loader2 size={16} className="animate-spin text-gray-400" />
                                </div>
                              )}
                              {!pincodeValidation.isValidating && pincodeValidation.isValid === true && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <CheckCircle2 size={16} className="text-green-500" />
                                </div>
                              )}
                              {!pincodeValidation.isValidating && pincodeValidation.isValid === false && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <XCircle size={16} className="text-red-500" />
                                </div>
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="country"
                              required
                              value="India"
                              disabled
                              className="w-full px-4 py-2 text-dark border border-gray-300 rounded text-sm bg-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">Only Indian addresses are supported</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address Type
                            </label>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 text-dark appearance-none border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                className="w-4 h-4 accent-accent rounded cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">Set as default address</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button 
                            type="button"
                            onClick={resetForm}
                            disabled={submitting}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded hover:bg-opacity-90 transition-colors disabled:opacity-50"
                          >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            {submitting ? 'Saving...' : editingId ? 'Update Address' : 'Add Address'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
        <DeleteAddressModal
          isOpen={addressIdToDelete !== null}
          onClose={() => setAddressIdToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  )
}
