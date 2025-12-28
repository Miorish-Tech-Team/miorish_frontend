'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Camera, Loader2, Phone } from 'lucide-react'
import { profileAPI, UpdateProfileData } from '@/services/profileService'
import { useAuth } from '@/contexts/AuthContext'
import AccountSidebar from '@/components/layout/AccountSidebar'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  // const router = useRouter()
  const { user, updateUser } = useAuth()
  console.log('Current user in ProfilePage:', user)
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  })
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        zipCode: user.zipCode || '',
      })
      if (user.profilePhoto) {
        setPhotoPreview(user.profilePhoto)
      }
    }
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setIsLoading(true)

    try {
      const updateData: UpdateProfileData = {
        ...profileData,
      }
      
      if (profilePhoto) {
        updateData.profilePhoto = profilePhoto
      }

      const response = await profileAPI.updateProfile(user.id, updateData)
      
      if (response.success && response.user) {
        updateUser(response.user)
        toast.success('Profile updated successfully!', {
          duration: 4000,
          position: 'top-right',
        })
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Failed to update profile', {
        duration: 4000,
        position: 'top-right',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 xl:px-25 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs md:text-sm mb-4 md:mb-6">
          <Link href="/" className="text-accent hover:underline">Home</Link>
          <span className="text-gray-400">{'>'}</span>
          <Link href="/account" className="text-accent hover:underline">My Account</Link>
          <span className="text-gray-400">{'>'}</span>
          <span className="text-dark">Profile</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Sidebar */}
          <AccountSidebar activePage="profile" />

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg p-4 md:p-6 lg:p-8 shadow-sm">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 md:pb-6 mb-4 md:mb-6 border-b border-gray-200">
                <div className="relative shrink-0">
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/10 flex items-center justify-center">
                      <User size={32} className="text-accent" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-dark">{user.fullName}</h1>
                  <p className="text-gray-600 text-sm break-all">{user.email}</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                    user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Not Verified'}
                  </span>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleProfileSubmit} className="space-y-4 md:space-y-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Profile Photo</label>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative shrink-0">
                    {photoPreview ? (
                        <Image
                          src={photoPreview}
                          alt="Profile Preview"
                          width={96}
                          height={96}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                      </div>
                    )}
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-accent text-white p-2 rounded-full cursor-pointer hover:bg-opacity-90 transition-colors shadow-lg"
                    >
                      <Camera size={16} />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="text-sm text-gray-600 text-center sm:text-left">
                    <p>Click the camera icon to upload a new photo</p>
                    <p className="text-xs mt-1">JPG, PNG or GIF (MAX. 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-dark mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-dark mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-dark mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-dark mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm"
                    placeholder="State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-dark mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-dark mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-dark text-sm"
                    placeholder="ZIP Code"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm md:text-base"
              >
                {isLoading && <Loader2 size={20} className="animate-spin" />}
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
