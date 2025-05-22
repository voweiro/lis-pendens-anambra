"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, Edit, Search, User, Loader2, CheckCircle, AlertCircle, Trash2 } from "lucide-react"
import { UpdateSuperAdminSettings, DeleteAccountRequest } from "@/Services/AuthRequest/auth.request"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

interface UserSettings {
  username: string
  password: string
  password_confirmation: string
  dateOfBirth: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>({
    username: "",
    password: "••••••••••••••",
    password_confirmation: "",
    dateOfBirth: "",
  })

  const [isEditing, setIsEditing] = useState<{
    username: boolean
    password: boolean
    password_confirmation: boolean
    dateOfBirth: boolean
  }>({
    username: false,
    password: false,
    password_confirmation: false,
    dateOfBirth: false,
  })

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch user data on component mount
  useEffect(() => {
    fetchSuperAdminData()
  }, [])

  const fetchSuperAdminData = () => {
    // Try to get user data from sessionStorage
    try {
      let userData = null
      
      // First try to get from auth
      const authStr = sessionStorage.getItem('auth')
      if (authStr) {
        const authData = JSON.parse(authStr)
        userData = authData.data || authData.user || {}
      }
      
      // If not found, try to get from user data directly
      if (!userData || Object.keys(userData).length === 0) {
        const userStr = sessionStorage.getItem('user')
        if (userStr) {
          userData = JSON.parse(userStr)
        }
      }
      
      // If still not found, try to get from superadmin data
      if (!userData || Object.keys(userData).length === 0) {
        const superAdminStr = sessionStorage.getItem('superadmin')
        if (superAdminStr) {
          userData = JSON.parse(superAdminStr)
        }
      }
      
      if (userData && Object.keys(userData).length > 0) {
        console.log('Found user data:', userData)
        setSettings({
          username: userData.name || userData.username || '',
          password: "••••••••••••••",
          password_confirmation: "",
          dateOfBirth: userData.dob || userData.date_of_birth || '',
        })
      } else {
        console.warn('No user data found in storage')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleEdit = (field: keyof typeof isEditing) => {
    // Reset any previous messages
    setSuccessMessage(null)
    setPasswordError(null)
    
    // If editing password, reset password fields
    if (field === 'password') {
      setNewPassword('')
      setConfirmPassword('')
    }
    
    setIsEditing({ ...isEditing, [field]: true })
  }

  const handleSave = async () => {
    // Validate password confirmation if editing password
    if (isEditing.password) {
      if (!newPassword) {
        setPasswordError('Please enter a new password')
        return
      }
      
      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match')
        return
      }
    }
    
    setLoading(true)
    setPasswordError(null)
    setSuccessMessage(null)
    
    try {
      // Prepare data for API call
      const updateData: any = {}
      
      if (isEditing.username) {
        updateData.name = settings.username
      }
      
      // We're not updating email as the endpoint doesn't expect it
      
      if (isEditing.password && newPassword) {
        updateData.password = newPassword
        updateData.password_confirmation = confirmPassword
      }
      
      if (isEditing.password_confirmation) {
        updateData.password_confirmation = settings.password_confirmation
      }
      
      if (isEditing.dateOfBirth) {
        updateData.dob = settings.dateOfBirth
      }
      
      // Only make API call if there are changes
      if (Object.keys(updateData).length > 0) {
        const response = await UpdateSuperAdminSettings(updateData)
        
        if (response.success) {
          setSuccessMessage('Settings updated successfully')
          toast.success('Settings updated successfully')
          
          // Update session storage with new data
          try {
            // Update auth data if it exists
            const authStr = sessionStorage.getItem('auth')
            if (authStr) {
              const authData = JSON.parse(authStr)
              if (authData.data) {
                // Update the user data in auth
                const updatedUserData = { ...authData.data }
                
                if (updateData.name) updatedUserData.name = updateData.name
                if (updateData.dob) updatedUserData.dob = updateData.dob
                
                authData.data = updatedUserData
                sessionStorage.setItem('auth', JSON.stringify(authData))
              }
            }
            
            // Update user data if it exists
            const userStr = sessionStorage.getItem('user')
            if (userStr) {
              const userData = JSON.parse(userStr)
              
              if (updateData.name) userData.name = updateData.name
              if (updateData.dob) userData.dob = updateData.dob
              
              sessionStorage.setItem('user', JSON.stringify(userData))
            }
            
            // Update superadmin data if it exists
            const superAdminStr = sessionStorage.getItem('superadmin')
            if (superAdminStr) {
              const superAdminData = JSON.parse(superAdminStr)
              
              if (updateData.name) superAdminData.name = updateData.name
              if (updateData.dob) superAdminData.dob = updateData.dob
              
              sessionStorage.setItem('superadmin', JSON.stringify(superAdminData))
            }
            
            // Refresh user data
            fetchSuperAdminData()
            
            // Set a timeout to refresh the page after showing success message
            setTimeout(() => {
              window.location.reload()
            }, 2000) // 2 seconds delay to show the success message
          } catch (storageError) {
            console.error('Error updating session storage:', storageError)
          }
        } else {
          throw new Error(response.error || 'Failed to update settings')
        }
      }
      
      // Reset editing state
      setIsEditing({
        username: false,
        password: false,
        password_confirmation: false,
        dateOfBirth: false,
      })
    } catch (error: any) {
      console.error('Error saving settings:', error)
      toast.error(error.message || 'Failed to update settings')
      
      if (error.message?.toLowerCase().includes('password')) {
        setPasswordError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings({ ...settings, [field]: value })
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true)
      
      // Call the delete account API
      await DeleteAccountRequest()
      
      toast.success('Account deleted successfully')
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Failed to delete account')
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600 text-sm mt-1">Track your searches and manage overall activities</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-full w-[200px] focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="relative">
            <button className="p-2 rounded-full bg-gray-100 relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img src="/placeholder.svg?height=40&width=40" alt="User avatar" className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Username</h2>
            {!isEditing.username && (
              <button onClick={() => handleEdit("username")} className="text-gray-500 hover:text-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            {isEditing.username ? (
              <input
                type="text"
                value={settings.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-gray-500 outline-none py-1"
              />
            ) : (
              <span className="text-gray-800">{settings.username}</span>
            )}
          </div>
        </div>

        {/* Password Confirmation */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Password Confirmation</h2>
            {!isEditing.password_confirmation && (
              <button onClick={() => handleEdit("password_confirmation")} className="text-gray-500 hover:text-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 font-bold">•••</span>
            </div>
            {isEditing.password_confirmation ? (
              <input
                type="password"
                value={settings.password_confirmation}
                onChange={(e) => handleChange("password_confirmation", e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-gray-500 outline-none py-1"
                placeholder="Confirm your password"
              />
            ) : (
              <span className="text-gray-800">{settings.password_confirmation || "Not set"}</span>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Change password</h2>
            {!isEditing.password && (
              <button onClick={() => handleEdit("password")} className="text-gray-500 hover:text-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 font-bold">•••</span>
            </div>
            {isEditing.password ? (
              <div className="flex-1 space-y-3">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`w-full border-b ${passwordError ? 'border-red-500' : 'border-gray-300 focus:border-gray-500'} outline-none py-1`}
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full border-b ${passwordError ? 'border-red-500' : 'border-gray-300 focus:border-gray-500'} outline-none py-1`}
                />
                {passwordError && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-800">{settings.password}</span>
            )}
          </div>
        </div>

        {/* Date of Birth */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Date of Birth</h2>
            {!isEditing.dateOfBirth && (
              <button onClick={() => handleEdit("dateOfBirth")} className="text-gray-500 hover:text-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            {isEditing.dateOfBirth ? (
              <input
                type="date"
                value={settings.dateOfBirth.split("-").reverse().join("-")}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date.getFullYear()}`
                  handleChange("dateOfBirth", formattedDate)
                }}
                className="flex-1 border-b border-gray-300 focus:border-gray-500 outline-none py-1"
              />
            ) : (
              <span className="text-gray-800">{settings.dateOfBirth}</span>
            )}
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mt-6 flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-green-700">{successMessage}</span>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleteLoading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center disabled:bg-red-400 disabled:cursor-not-allowed"
        >
          {deleteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Trash2 className="h-4 w-4 mr-2" />
          {deleteLoading ? 'Deleting...' : 'Delete Account'}
        </button>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Delete Account</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {deleteLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
