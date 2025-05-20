"use client"

import { X } from "lucide-react"

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

interface ReviewModalProps {
  log: ActivityLog
  onClose: () => void
  onDelete: (log: ActivityLog) => void
  onDownload: (log: ActivityLog) => void
}

export function ReviewModal({ log, onClose, onDelete, onDownload }: ReviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 bg-gray-700 text-white flex justify-between items-center">
          <h2 className="text-lg font-semibold">Record Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Property Title (certificate of occupancy):</h3>
              <p className="text-gray-900 font-medium">{log.details?.propertyTitle}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Registered Title number:</h3>
              <p className="text-gray-900 font-medium">{log.details?.registeredTitleNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location/Address of Property:</h3>
              <p className="text-gray-900 font-medium">{log.details?.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Survey plan number:</h3>
              <p className="text-gray-900 font-medium">{log.details?.surveyPlanNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Name of Owner of property (optional):</h3>
              <p className="text-gray-900 font-medium">{log.details?.ownerName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Case Status</h3>
              <p className="text-orange-500 font-medium">{log.details?.caseStatus}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated:</h3>
            <p className="text-gray-900">{log.details?.lastUpdated}</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={() => onDelete(log)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Delete
          </button>
          <button
            onClick={() => onDownload(log)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  )
}
