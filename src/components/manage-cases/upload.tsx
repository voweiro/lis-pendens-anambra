"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface UploadModalProps {
  onClose: () => void
}

export function UploadModal({ onClose }: UploadModalProps) {
  const [step, setStep] = useState<"options" | "form">("options")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        {step === "options" && (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-center relative">
              <h2 className="text-lg font-semibold">Upload case</h2>
              <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-12 flex flex-col items-center justify-center gap-4">
              <button
                onClick={() => setStep("form")}
                className="w-full max-w-xs bg-gray-700 text-white px-4 py-3 rounded hover:bg-gray-800 transition-colors"
              >
                Upload case
              </button>

              <button className="w-full max-w-xs border border-gray-300 px-4 py-3 rounded text-gray-700 hover:bg-gray-50 transition-colors">
                Upload by CSV
              </button>

              <button className="w-full max-w-xs border border-gray-300 px-4 py-3 rounded text-gray-700 hover:bg-gray-50 transition-colors">
                Download CSV format
              </button>
            </div>
          </>
        )}

        {step === "form" && (
          <>
            <div className="p-4 border-b border-gray-200 flex justify-center relative">
              <h2 className="text-lg font-semibold">Upload case</h2>
              <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title i.e. type of title to the property:
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name of Owner of Property:</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registered Title number:</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location of Property (House or Plot No, Street):
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registered Survey plan number:</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name of parties to the Suit/Claim:
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setStep("options")}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
