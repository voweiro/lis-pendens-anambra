"use client"

import { useState } from "react"
import { Search, Flag, MoreHorizontal, Trash2, Download } from "lucide-react"
import { Button } from "@/components/utils/buttons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/utils/dropdown-menu"

type ActivityItem = {
  id: string
  user: string
  action: string
  caseTitle: string
  date: string
  time: string
  details: string
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      user: "Michael Okpara",
      action: "updated status of",
      caseTitle: "XAVIER vs. ABAH",
      date: "24th Jan 2024",
      time: "11:45AM",
      details: "to Closed, on",
    },
    {
      id: "2",
      user: "marylessor@gmail.com",
      action: "uploaded",
      caseTitle: "AAA vs. Primehomes & 2 Others",
      date: "25th Jan 2024",
      time: "6:34PM",
      details: "on",
    },
    {
      id: "3",
      user: "debbyannnie@yahoo.com",
      action: "uploaded",
      caseTitle: "Samir A vs. Squareit & 12 Others",
      date: "26th Jan 2024",
      time: "8:15PM",
      details: "on",
    },
  ])

  const handleRemove = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  return (
    <div className="border border-blue-200 rounded-md p-4 w-[80%] mx-auto">
      <div className="relative mb-6">
        <div className="bg-gray-100 rounded-full flex items-center pl-3 pr-4 py-2 w-full max-w-[220px]">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="search username..."
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start justify-between border-b pb-6">
            <div className="flex items-start">
              <Flag className="h-4 w-4 text-red-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-gray-600">
                    {activity.action} {activity.caseTitle} {activity.details} {activity.date} at {activity.time}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="rounded-full px-4 h-8">
                Review
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500"
                    onClick={() => handleRemove(activity.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
