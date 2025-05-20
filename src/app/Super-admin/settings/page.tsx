"use client"

import { useState } from "react"
import { Bell, Calendar, Edit, Mail, Search, User } from "lucide-react"

interface UserSettings {
  username: string
  email: string
  password: string
  dateOfBirth: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    username: "Victor Ukaigwe",
    email: "iamvickd@gmail.com",
    password: "••••••••••••••",
    dateOfBirth: "12-01-2024",
  })

  const [isEditing, setIsEditing] = useState<{
    username: boolean
    email: boolean
    password: boolean
    dateOfBirth: boolean
  }>({
    username: false,
    email: false,
    password: false,
    dateOfBirth: false,
  })

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing({ ...isEditing, [field]: true })
  }

  const handleSave = () => {
    // Here you would typically save the settings to your backend
    console.log("Saving settings:", settings)
    setIsEditing({
      username: false,
      email: false,
      password: false,
      dateOfBirth: false,
    })
  }

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings({ ...settings, [field]: value })
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

        {/* Email */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Change email</h2>
            {!isEditing.email && (
              <button onClick={() => handleEdit("email")} className="text-gray-500 hover:text-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="h-4 w-4 text-gray-500" />
            </div>
            {isEditing.email ? (
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="flex-1 border-b border-gray-300 focus:border-gray-500 outline-none py-1"
              />
            ) : (
              <span className="text-gray-800">{settings.email}</span>
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
                  className="w-full border-b border-gray-300 focus:border-gray-500 outline-none py-1"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border-b border-gray-300 focus:border-gray-500 outline-none py-1"
                />
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

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Save changes
        </button>
      </div>
    </div>
  )
}
