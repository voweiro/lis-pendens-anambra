"use client"

import { Trash2, X } from "lucide-react"

interface DeleteConfirmationModalProps {
  onCancel: () => void
  onConfirm: () => void
  title: string
  message: string
}

export function DeleteConfirmationModal({ onCancel, onConfirm, title, message }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-center text-gray-700 mb-6">{message}</p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
