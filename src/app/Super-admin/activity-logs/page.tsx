"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Flag, MoreHorizontal, Search, Trash2, X } from "lucide-react"
import { ReviewModal } from "@/components/manage-cases/review-modal"


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
  details?: string
}

export default function ActivityLogsPage() {
  const [view, setView] = useState<"summary" | "list">("summary")
  const [selectedDate, setSelectedDate] = useState("20 May")
  const [searchQuery, setSearchQuery] = useState("")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [reviewLog, setReviewLog] = useState<ActivityLog | null>(null)

  const dates = [
    { day: "18 May", weekday: "Mon" },
    { day: "19 May", weekday: "Tue" },
    { day: "20 May", weekday: "Wed" },
    { day: "21 May", weekday: "Thu" },
    { day: "22 May", weekday: "Fri" },
    { day: "23 May", weekday: "Sat" },
    { day: "24 May", weekday: "Sun" },
  ]

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
      details: "Status changed from 'On appeal' to 'Closed'. This case involves a property dispute in Abuja.",
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
      details: "New case uploaded with 3 documents: Certificate of Occupancy, Survey Plan, and Court Filing.",
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
      details: "Complex case with multiple parties. Includes land dispute documentation and historical records.",
    },
    {
      id: "4",
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
      details: "Status changed from 'On appeal' to 'Closed'. This case involves a property dispute in Abuja.",
    },
    {
      id: "5",
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
      details: "New case uploaded with 3 documents: Certificate of Occupancy, Survey Plan, and Court Filing.",
    },
    {
      id: "6",
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
      details: "Complex case with multiple parties. Includes land dispute documentation and historical records.",
    },
  ]

  const todayLogs = [
    {
      time: "11:00AM",
      activities: [
        {
          type: "UPDATED",
          user: "Michael Okpara",
          description: "updated status of XAVIER vs. ABAH to Closed, on 20 May 2024 at 11:45AM",
        },
      ],
    },
    {
      time: "12:00PM",
      activities: [
        {
          type: "UPLOADED",
          user: "maryslessor@gmail.com",
          description: "uploaded AAA vs. Primehomes & 2 Others, on 20 May 2024 at 6:34PM",
        },
      ],
    },
  ]

  const filteredLogs = activityLogs.filter((log) => {
    if (!searchQuery) return true
    return (
      log.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleMenuToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === id ? null : id)
  }

  const handleReview = (log: ActivityLog) => {
    setReviewLog(log)
  }

  const handleDelete = (id: string) => {
    setSelectedLogId(id)
    setShowDeleteModal(true)
    setOpenMenuId(null)
  }

  const confirmDelete = () => {
    // Here you would typically delete the log from your backend
    console.log(`Deleting log ${selectedLogId}`)
    setShowDeleteModal(false)
    setSelectedLogId(null)
  }

  const handleFlagCase = (id: string) => {
    // Here you would typically flag the case in your backend
    console.log(`Flagging case for log ${id}`)
    setOpenMenuId(null)
  }

  // Close dropdowns when clicking outside
  const handleClickOutside = () => {
    if (openMenuId) setOpenMenuId(null)
  }

  return (
    <div className="p-6" onClick={handleClickOutside}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Activity logs</h1>

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

      {view === "summary" && (
        <>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-1">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="flex items-center justify-center gap-4 relative">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold">350</span>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">Total upload</div>
                </div>

                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-white">
                    <span className="text-2xl font-bold">185</span>
                  </div>
                  <div className="text-center mt-2 text-sm text-gray-600">Total update</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm md:col-span-2">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {dates.map((date) => (
                    <button
                      key={date.day}
                      className={`flex flex-col items-center justify-center p-2 rounded-md ${
                        selectedDate === date.day ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => setSelectedDate(date.day)}
                    >
                      <span className="text-xs">{date.weekday}</span>
                      <span className="font-medium">{date.day.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>

                <button className="p-1 rounded-md hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                {todayLogs.map((timeSlot, index) => (
                  <div key={index} className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">{timeSlot.time}</div>
                    {timeSlot.activities.map((activity, actIndex) => (
                      <div
                        key={actIndex}
                        className={`p-3 rounded-md mb-2 ${
                          activity.type === "UPDATED" ? "bg-gray-800 text-white" : "bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">{activity.type}:</div>
                        <div className="text-sm">
                          {activity.user} {activity.description}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="search username.."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button
                onClick={() => setView("list")}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <span>More</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {filteredLogs.slice(0, 3).map((log) => (
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
                      <button className="p-1 rounded-md hover:bg-gray-100" onClick={(e) => handleMenuToggle(log.id, e)}>
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
                                handleDelete(log.id)
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
        </>
      )}

      {view === "list" && (
        <div className="mt-6 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setView("summary")}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="search records, status.."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full min-w-[300px] focus:outline-none focus:ring-2 focus:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredLogs.map((log) => (
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
                    <button className="p-1 rounded-md hover:bg-gray-100" onClick={(e) => handleMenuToggle(log.id, e)}>
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
                              handleDelete(log.id)
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
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delete Record</h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-center text-gray-700 mb-6">Confirm Delete</p>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reviewLog && <ReviewModal log={reviewLog} onClose={() => setReviewLog(null)} />}
    </div>
  )
}
