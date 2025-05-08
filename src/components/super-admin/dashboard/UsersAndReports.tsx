"use client"
import React from "react"
import { ChevronDown } from "lucide-react"

const users = [
  { name: "iamvickd@gmail.com", avatar: "/avatar1.png" },
  { name: "stanley@gmail.com", avatar: "/avatar2.png" },
  { name: "chiomachris@gmail.com", avatar: "/avatar3.png" },
]

const chartData = [
  { label: "Jan", value: 40 },
  { label: "Feb", value: 25 },
  { label: "Mar", value: 10 },
  { label: "Apr", value: 45 },
  { label: "May", value: 35 },
  { label: "Jun", value: 28 },
]

const UsersAndReports: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full rounded-3xl p-6 bg-gray-50 shadow-md">
      {/* Users */}
      <div className="bg-white rounded-2xl p-4 w-full md:w-[250px] shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Users</h3>
          <button className="text-xl font-bold">+</button>
        </div>
        <ul className="space-y-4">
          {users.map((user, idx) => (
            <li key={idx} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm">{user.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Data Reports */}
      <div className="bg-white rounded-2xl p-4 flex-1 shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Data Reports</h3>
          <button className="flex items-center text-sm border px-3 py-1.5 rounded-full">
            Total searches
            <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
        <div className="flex items-end h-40 space-x-4">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center w-10">
              <div
                className="bg-gray-400 w-full rounded"
                style={{ height: `${item.value * 2}px` }}
              />
              <span className="mt-2 text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UsersAndReports
