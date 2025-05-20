// import React from "react";
// import CourtRegistrarLayout from "@/components/court-registrar/layout";

// import StatsBar from "@/components/court-registrar/dashboard/StatsBar";
// import UsersAndReports from "@/components/super-admin/dashboard/UsersAndReports";
// import UploadedCasesTable from "@/components/court-registrar/dashboard/UploadedCasesTable";
// import SuperAdminLayout from "./layout";

// const CourtRegistrarDashboardPage = () => {
//   return (
//     <>
//       <StatsBar />

//       <div className="mt-8 px-8">
//         <UploadedCasesTable />
//       </div>
//       <UsersAndReports />
//     </>
//   );
// };

// export default CourtRegistrarDashboardPage;


"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Flag, MoreHorizontal, Plus, Search, Trash2, X, ChevronLeft } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/manage-cases/delete-confirmation-modal"


type ActivityType = "updated" | "uploaded"

interface ActivityLog {
  id: string
  user: {
    name: string
    email: string
    avatar: string
    initial?: string
  }
  type: ActivityType
  description: string
  timestamp: string
  date: string
  time: string
  caseTitle?: string
  caseId?: string
  details?: {
    propertyTitle: string
    registeredTitleNumber: string
    location: string
    surveyPlanNumber: string
    ownerName: string
    caseStatus: "Pending" | "On appeal" | "Disposed"
    lastUpdated: string
  }
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  initial?: string
}

type RecordType = "Total searches" | "Pending records" | "On-appeal records" | "Dismissed records"

export default function SuperAdminDashboard() {
  const [showAllActivities, setShowAllActivities] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showRecordTypeDropdown, setShowRecordTypeDropdown] = useState(false)
  const [recordType, setRecordType] = useState<RecordType>("Total searches")

  const activityLogs: ActivityLog[] = [
    {
      id: "1",
      user: {
        name: "Michael Okpara",
        email: "michael@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "M",
      },
      type: "updated",
      description: "updated status of XAVIER vs. ABAH to Closed, on 24th Jan 2024 at 11:45AM",
      timestamp: "2024-01-24T11:45:00",
      date: "24th Jan 2024",
      time: "11:45AM",
      caseTitle: "XAVIER vs. ABAH",
      caseId: "CASE-2024-001",
      details: {
        propertyTitle: "Deelaw Housing & Real Estates Agency",
        registeredTitleNumber: "LP24452168PD",
        location: "A120UJHGCF123",
        surveyPlanNumber: "Olivia Chinaza",
        ownerName: "Plot 1-5 Lamido crescent, Abuja",
        caseStatus: "Pending",
        lastUpdated: "20 Jan 2024",
      },
    },
    {
      id: "2",
      user: {
        name: "Mary Slessor",
        email: "maryslessor@gmail.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "M",
      },
      type: "uploaded",
      description: "uploaded AAA vs. Primehomes & 2 Others, on 25th Jan 2024 at 6:34PM",
      timestamp: "2024-01-25T18:34:00",
      date: "25th Jan 2024",
      time: "6:34PM",
      caseTitle: "AAA vs. Primehomes & 2 Others",
      caseId: "CASE-2024-002",
      details: {
        propertyTitle: "AAA Properties Limited",
        registeredTitleNumber: "LP87654321PD",
        location: "B230KLMNOP456",
        surveyPlanNumber: "James Johnson",
        ownerName: "23 Main Street, Lagos",
        caseStatus: "On appeal",
        lastUpdated: "25 Jan 2024",
      },
    },
    {
      id: "3",
      user: {
        name: "Debby Annie",
        email: "debbyannie@yahoo.com",
        avatar: "/placeholder.svg?height=40&width=40",
        initial: "D",
      },
      type: "uploaded",
      description: "uploaded Samir A vs. Squareit & 12 Others, on 26th Jan 2024 at 8:15PM",
      timestamp: "2024-01-26T20:15:00",
      date: "26th Jan 2024",
      time: "8:15PM",
      caseTitle: "Samir A vs. Squareit & 12 Others",
      caseId: "CASE-2024-003",
      details: {
        propertyTitle: "Squareit Development Company",
        registeredTitleNumber: "LP11223344PD",
        location: "C340QRSTUV789",
        surveyPlanNumber: "Ahmed Mohammed",
        ownerName: "45 Park Avenue, Kano",
        caseStatus: "Disposed",
        lastUpdated: "26 Jan 2024",
      },
    },
  ]

  const users: User[] = [
    {
      id: "1",
      name: "Victor Ukaigwe",
      email: "iamvickd@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "V",
    },
    {
      id: "2",
      name: "Stanley Johnson",
      email: "stanley@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "S",
    },
    {
      id: "3",
      name: "Chioma Chris",
      email: "chiomachris@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
      initial: "C",
    },
  ]

  const monthlyData = [
    { name: "Jan", value: 38 },
    { name: "Feb", value: 20 },
    { name: "Mar", value: 15 },
    { name: "Apr", value: 45 },
    { name: "May", value: 30 },
    { name: "Jun", value: 22 },
  ]

  const handleReview = (activity: ActivityLog) => {
    setSelectedActivity(activity)
  }

  const handleDelete = (activity: ActivityLog) => {
    setSelectedActivity(activity)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // Here you would typically delete the record from your backend
    console.log(`Deleting record ${selectedActivity?.id}`)
    setShowDeleteModal(false)
    setSelectedActivity(null)
  }

  const handleDownload = (activity: ActivityLog) => {
    // Here you would typically generate and download a file
    console.log(`Downloading record ${activity.id}`)
    // Simulate a download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `${activity.caseTitle?.replace(/\s+/g, "_")}_${activity.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleFlagCase = (id: string) => {
    // Here you would typically flag the case in your backend
    console.log(`Flagging case ${id}`)
    setOpenMenuId(null)
  }

  const handleRecordTypeSelect = (type: RecordType) => {
    setRecordType(type)
    setShowRecordTypeDropdown(false)
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    if (openMenuId) setOpenMenuId(null)
    if (showRecordTypeDropdown) setShowRecordTypeDropdown(false)
  }

  return (
    <div className="p-6" onClick={handleClickOutside}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Super Admin</h1>
          <p className="text-gray-600 text-sm mt-1">Track your searches and manage overall activities</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-full w-[200px] focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            <img src="/placeholder.svg?height=40&width=40" alt="User avatar" className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 bg-gray-700 rounded-lg p-4 grid grid-cols-4 gap-4">
        <div className="flex items-center gap-2 border-r border-gray-600 pr-4">
          <div className="p-2 bg-gray-600 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">4657</div>
            <div className="text-xs">Total searches</div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-r border-gray-600 pr-4">
          <div className="p-2 bg-gray-600 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">4657</div>
            <div className="text-xs">Total searches</div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-r border-gray-600 pr-4">
          <div className="p-2 bg-gray-600 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">4657</div>
            <div className="text-xs">Total searches</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2 bg-gray-600 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10" />
              <path d="M7 12h10" />
              <path d="M7 17h10" />
            </svg>
          </div>
          <div className="text-white">
            <div className="text-2xl font-bold">4657</div>
            <div className="text-xs">Total searches</div>
          </div>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          {showAllActivities ? (
            <button
              onClick={() => setShowAllActivities(false)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="search records, status.."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
          )}

          {!showAllActivities && (
            <button
              onClick={() => setShowAllActivities(true)}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <span>More</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {(showAllActivities ? activityLogs.concat(activityLogs) : activityLogs.slice(0, 3)).map((log) => (
            <div key={log.id} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                {log.user.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{log.user.name}</span>
                  <span className="text-gray-500 text-sm">{log.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => handleReview(log)}
                >
                  Review
                </button>
                <div className="relative">
                  <button
                    className="p-1 rounded-md hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMenuToggle(log.id)
                    }}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>

                  {openMenuId === log.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleFlagCase(log.id)
                          }}
                        >
                          <Flag className="h-4 w-4 text-red-500" />
                          <span>Flag case</span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(log)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users and Data Reports */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Users</h2>
            <button className="p-1 rounded-md hover:bg-gray-100">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 flex-shrink-0">
                  {user.initial}
                </div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Data Reports</h2>

            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-md text-sm"
                onClick={() => setShowRecordTypeDropdown(!showRecordTypeDropdown)}
              >
                <span>{recordType}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showRecordTypeDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleRecordTypeSelect("Total searches")}
                    >
                      Total searches
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleRecordTypeSelect("Pending records")}
                    >
                      Pending records
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleRecordTypeSelect("On-appeal records")}
                    >
                      On-appeal records
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleRecordTypeSelect("Dismissed records")}
                    >
                      Dismissed records
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-64 w-full">
            <div className="flex items-end h-full w-full">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-12 bg-gray-200 rounded-t" style={{ height: `${(item.value / 45) * 100}%` }}></div>
                  <div className="mt-2 text-xs text-gray-500">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedActivity && !showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-4 bg-gray-700 text-white flex justify-between items-center">
              <h2 className="text-lg font-semibold">Record Details</h2>
              <button onClick={() => setSelectedActivity(null)} className="text-white hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Property Title (certificate of occupancy):</h3>
                  <p className="text-gray-900 font-medium">{selectedActivity.details?.propertyTitle}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Registered Title number:</h3>
                  <p className="text-gray-900 font-medium">{selectedActivity.details?.registeredTitleNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Location/Address of Property:</h3>
                  <p className="text-gray-900 font-medium">{selectedActivity.details?.location}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Survey plan number:</h3>
                  <p className="text-gray-900 font-medium">{selectedActivity.details?.surveyPlanNumber}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Name of Owner of property (optional):</h3>
                  <p className="text-gray-900 font-medium">{selectedActivity.details?.ownerName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Case Status</h3>
                  <p className="text-orange-500 font-medium">{selectedActivity.details?.caseStatus}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated:</h3>
                <p className="text-gray-900">{selectedActivity.details?.lastUpdated}</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => handleDelete(selectedActivity)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Delete
              </button>
              <button
                onClick={() => handleDownload(selectedActivity)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Record"
          message="Are you sure you want to delete this record? This action cannot be undone."
        />
      )}
    </div>
  )
}

