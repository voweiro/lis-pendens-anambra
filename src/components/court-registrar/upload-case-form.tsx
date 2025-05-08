"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/utils/buttons"
import { Input } from "@/components/utils/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/utils/dialog"
import { Check, Upload } from "lucide-react"

type FormStep = 1 | 2 | 3

export default function UploadCaseForm() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<FormStep>(1)

  const handleOpen = () => {
    setOpen(true)
    setStep(1)
  }

  const handleClose = () => {
    setOpen(false)
    setStep(1)
  }

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(2)
  }

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(1)
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setStep(3)
    // Auto close the success modal after 3 seconds
    setTimeout(() => {
      handleClose()
    }, 3000)
    // Here you would typically submit the form data to your backend
  }

  return (
    <>
      <Button onClick={handleOpen}>  <span> <Upload className="text-2xl text-gray-400" /> </span>Upload case</Button>

      <Dialog open={open} onOpenChange={setOpen} >
        {step === 3 ? (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Upload case</span>
                <button
                  onClick={handleClose}
                  className="h-4 w-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none"
                >
                  <span className="text-lg">×</span>
                  <span className="sr-only">Close</span>
                </button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-base font-medium">Case Uploaded</p>
            </div>
          </DialogContent>
        ) : (
          <DialogContent className=" bg-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center bg-[#23A863] text-white p-4 -mx-6 -mt-6 rounded-t-lg">
                <span>Upload case</span>
                {step === 1 && (
                  <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
                    Download CSV format
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {step === 1 ? (
                // Step 1: Property Details
                <>
                  <div className="  grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="propertyTitle" className="text-sm font-medium">
                        Property Title i.e. type of title to the property:
                      </label>
                      <Input id="propertyTitle" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="ownerName" className="text-sm font-medium">
                        Name of Owner of Property:
                      </label>
                      <Input id="ownerName" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="titleNumber" className="text-sm font-medium">
                        Registered Title number:
                      </label>
                      <Input id="titleNumber" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location of Property (House or Plot No, Street..
                      </label>
                      <Input id="location" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="surveyNumber" className="text-sm font-medium">
                        Registered Survey plan number:
                      </label>
                      <Input id="surveyNumber" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="parties" className="text-sm font-medium">
                        Name of parties to the Suit/Claim:
                      </label>
                      <Input id="parties" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={handleClose}>
                      Back
                    </Button>
                    <Button type="button" onClick={handleNext}>
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                // Step 2: Case Details
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="suitNumber" className="text-sm font-medium">
                        Suit Number:
                      </label>
                      <Input id="suitNumber" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="natureDispute" className="text-sm font-medium">
                        Nature of dispute:
                      </label>
                      <Input id="natureDispute" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="court" className="text-sm font-medium">
                        The Court and judicial Division of the action:
                      </label>
                      <Input id="court" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">
                        Status of dispute:
                      </label>
                      <Input id="status" placeholder="Pending / On appeal / Disposed" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="commencementDate" className="text-sm font-medium">
                        Date of Commencement of Claim/dispute:
                      </label>
                      <Input id="commencementDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="disposalDate" className="text-sm font-medium">
                        If 'Disposed' date of disposal:
                      </label>
                      <Input id="disposalDate" type="date" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-6 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button type="button" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
