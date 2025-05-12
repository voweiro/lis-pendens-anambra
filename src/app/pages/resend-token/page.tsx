"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Import images
import authBgImage from "@/asserts/auth-bg.png"
import logoImage from "@/asserts/lis-pendens-logo-white.png"


// Import your API request function
import { ResendVerificationCodeRequest } from "@/Services/AuthRequest/auth.request"
import { MdEmail } from "react-icons/md"

// Schema validation with Yup
const schema = yup.object().shape({
  email: yup.string().required("Email is required").email("Invalid email format"),
  type: yup
    .string()
    .required("Verification type is required")
    .oneOf(["REGISTER", "PASSWORD_RESET"] as const, "Invalid verification type"),
})

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface ResendTokenFormData {
  email: string
  type: "REGISTER" | "PASSWORD_RESET"
}

export default function ResendToken() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ResendTokenFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "REGISTER",
    },
  })
  
  // Get email and type from URL parameters
  useEffect(() => {
    const emailParam = searchParams.get("email")
    const typeParam = searchParams.get("type")
    
    if (emailParam) {
      setValue("email", emailParam)
    }
    
    if (typeParam) {
      // Convert to uppercase for API compatibility
      const upperType = typeParam.toUpperCase()
      if (upperType === "REGISTER" || upperType === "PASSWORD_RESET") {
        setValue("type", upperType as "REGISTER" | "PASSWORD_RESET")
      }
    }
  }, [searchParams, setValue])

  // Watch the email field to access its value
  const email = watch("email")

  const onSubmitHandler = async (data: ResendTokenFormData) => {
    setIsSubmitting(true)

    try {
      await ResendVerificationCodeRequest({
        email: data.email,
        type: data.type,
      })

      toast.success("Verification code sent successfully")

      // Store email in localStorage for the verification page
      localStorage.setItem("userEmail", data.email)

      // Navigate to verification page with email as query parameter
      setTimeout(() => {
        router.push(`/pages/verify-token?email=${encodeURIComponent(data.email)}&type=${data.type}`)
      }, 2000)
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast.error(apiError?.response?.data?.message || "Failed to send verification code")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="relative w-full h-screen">
        {/* Background image */}
        <Image
          src={authBgImage || "/placeholder.svg"}
          alt="Auth background"
          fill
          priority
          className="object-cover -z-10"
        />
        <a href="/" className="flex items-center pt-6 pl-4">
          <img
            src={logoImage.src || "/placeholder.svg"}
            alt="LisPendens brand logo"
            className="text-white object-cover"
          />
        </a>

        <Link
          href="/pages/signin"
          className="inline-flex items-center mt-4 ml-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Sign In
        </Link>
        <div className="backdrop-blur-md p-6 rounded-lg shadow-xl mx-auto w-full max-w-md h-[80vh] overflow-y-auto">
          <section className="py-4 m-2 px-4 md:m-6 md:px-12 bg-white rounded-[30px]">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-2 text-[24px] font-bold text-black">Resend Verification Code</h3>

              <div className="flex justify-center my-6">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                  <MdEmail className="w-10 h-10" />
                </div>
              </div>

              <p className="text-center text-gray-600 mb-6">
                Enter your email address below and we'll send you a new verification code.
              </p>

              {/* EMAIL */}
              <div className="max-w-[400px] mb-4 mx-auto">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-3"
                  {...register("email")}
                />
                <p className="text-red-500 text-[0.75rem] mt-1">{errors.email?.message}</p>
              </div>

              {/* VERIFICATION TYPE */}
              <div className="max-w-[400px] mb-6 mx-auto">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Type
                </label>
                <select
                  id="type"
                  className="w-full outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-3"
                  {...register("type")}
                >
                  <option value="REGISTER">Account Registration</option>
                  <option value="PASSWORD_RESET">Password Reset</option>
                </select>
                <p className="text-red-500 text-[0.75rem] mt-1">{errors.type?.message}</p>
              </div>

              {/* SEND CODE BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mb-4 p-3 text-center bg-[#00AD20] rounded-2xl text-white border-1 border-[rgb(45,180,17)] cursor-pointer transition duration-700 ease-in-out hover:bg-white hover:text-[#E37C42] hover:border-[#E37C42] border-[1.3px] disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Verification Code"}
              </button>

              {/* SIGN UP LINK */}
              <p className="text-center text-[14px]">
                Don't have an account?{" "}
                <a href="/pages/signup" className="text-[#E37C42] cursor-pointer">
                  Sign Up
                </a>
              </p>
            </form>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}
