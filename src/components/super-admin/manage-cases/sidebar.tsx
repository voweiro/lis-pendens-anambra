import type React from "react"
import Link from "next/link"
import { BarChart2, Briefcase, Flag, LogOut, PieChart, Settings, Upload, Users } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-[220px] bg-white border-r border-gray-200 p-4 flex flex-col h-full">
      <nav className="space-y-2 flex-1">
        <SidebarItem icon={<BarChart2 className="h-5 w-5" />} label="Dashboard" href="/Super-admin" active />
        <SidebarItem icon={<Briefcase className="h-5 w-5" />} label="Manage Cases" href="/Super-admin/manage-cases" />
        <SidebarItem icon={<Users className="h-5 w-5" />} label="Users" href="#" />
        <SidebarItem icon={<BarChart2 className="h-5 w-5 rotate-90" />} label="Activity Logs" href="/Super-admin/activity-logs" />
        <SidebarItem icon={<Flag className="h-5 w-5" />} label="Flagged Cases" href="#" />
        <SidebarItem icon={<PieChart className="h-5 w-5" />} label="Data Reports" href="/Super-admin/data-report" />
        <SidebarItem icon={<Settings className="h-5 w-5" />} label="Settings" href="/Super-admin/settings" />
      </nav>

      <div className="mt-auto">
        <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 transition-colors">
          <Upload className="h-5 w-5" />
          <span>Upload Record</span>
        </button>

        <button className="w-full mt-4 flex items-center justify-center gap-2 bg-gray-700 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md ${
        active
          ? "bg-gray-100 text-gray-900 font-medium border border-gray-300"
          : "text-gray-700 hover:bg-gray-100 transition-colors"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
