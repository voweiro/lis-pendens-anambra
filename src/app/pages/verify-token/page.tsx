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

// Import images (using the same paths as your signup page)
import authBgImage from "@/asserts/auth-bg.png"
import logoImage from "@/asserts/lis-pendens-logo-white.png"
 // You'll need to add this image

// Import your API request function
import { VerifyTokenRequest, ResendVerificationCodeRequest } from "@/Services/AuthRequest/auth.request"
import { MdMarkEmailRead } from "react-icons/md"

// Schema validation with Yup
const schema = yup.object().shape({
  verificationCode: yup
    .string()
    .required("Verification code is required")
    .length(6, "Verification code must be 6 digits"),
  type: yup
    .string()
    .required("Verification type is required")
    .oneOf(["REGISTER", "PASSWORD_RESET"] as const, "Invalid verification type"),
}) satisfies yup.ObjectSchema<VerifyTokenFormData>

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

interface VerifyTokenFormData {
  verificationCode: string
  type: "REGISTER" | "PASSWORD_RESET"
}

const VerifyToken = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")
  const [countdown, setCountdown] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyTokenFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "REGISTER", // Default to REGISTER since this is after signup
    },
  })

  // Get email from URL params or localStorage
  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
      // Also store in localStorage as a backup
      localStorage.setItem("userEmail", emailParam)
    } else {
      // Fallback to localStorage if email is not in URL
      const storedEmail = localStorage.getItem("userEmail")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        // If no email is found, redirect back to signup
        toast.error("Email address is missing. Redirecting to signup page.")
        setTimeout(() => {
          router.push("/pages/signup")
        }, 2000)
      }
    }

    // Set the verification type from URL params or default to "REGISTER"
    const typeParam = searchParams.get("type")
    if (typeParam) {
      // Convert to uppercase for API compatibility
      const upperType = typeParam.toUpperCase()
      if (upperType === "REGISTER" || upperType === "PASSWORD_RESET") {
        setValue("type", upperType as "REGISTER" | "PASSWORD_RESET")
      }
    }
  }, [searchParams, setValue, router])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const resendVerificationCode = async () => {
    if (!email) {
      toast.error("Email address is missing. Please go back to the signup page.")
      return
    }

    setIsResending(true)
    try {
      // Get the current verification type and convert to uppercase
      const typeParam = searchParams.get("type") || "register"
      const type = typeParam.toUpperCase() as "REGISTER" | "PASSWORD_RESET"

      // Call your actual API endpoint
      await ResendVerificationCodeRequest({ email, type })
      toast.success("Verification code resent successfully")

      // Start countdown for 60 seconds
      setCountdown(60)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.response?.data?.message || "Failed to resend verification code")
    } finally {
      setIsResending(false)
    }
  }

  const onSubmitHandler = async (data: VerifyTokenFormData) => {
    if (!email) {
      toast.error("Email address is missing. Please go back to the signup page.")
      return
    }

    setIsSubmitting(true)
    try {
      // Call your actual API endpoint with token and type in uppercase
      // The API expects token and type (REGISTER or PASSWORD_RESET) as shown in Postman
      await VerifyTokenRequest({
        token: data.verificationCode, // Use the verification code as the token
        type: data.type, // Already in uppercase from the form
      })

      toast.success("Email verified successfully")

      // Clear stored email from localStorage if it exists
      localStorage.removeItem("userEmail")

      setTimeout(() => {
        router.push("/pages/signin")
      }, 2000)
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast.error(apiError?.response?.data?.message || "Verification failed")
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
          href="/pages/signup"
          className="inline-flex items-center mt-4 ml-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Sign Up
        </Link>
        <div className="backdrop-blur-md p-6 rounded-lg shadow-xl mx-auto w-full max-w-md h-[80vh] overflow-y-auto">
          <section className="py-4 m-2 px-4 md:m-6 md:px-12 bg-white rounded-[30px]">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-2 text-[24px] font-bold text-black">Verify Your Email</h3>

              <div className="flex justify-center my-6">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                  <MdMarkEmailRead className="w-10 h-10" />
                </div>
              </div>

              <p className="text-center text-gray-600 mb-6">
                We've sent a verification code to <span className="font-medium">{email}</span>. Please enter the code
                below to verify your account.
              </p>

              {/* VERIFICATION CODE */}
              <div className="max-w-[400px] mb-6 mx-auto">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-3 text-center text-lg tracking-widest"
                  maxLength={6}
                  {...register("verificationCode")}
                />
                <p className="text-red-500 text-[0.75rem] text-center mt-1">{errors.verificationCode?.message}</p>
              </div>

              {/* Hidden type field */}
              <input type="hidden" {...register("type")} />

              {/* Hidden email field - for debugging */}
              <div className="hidden">
                <p>Email: {email}</p>
                <p>Type: {searchParams.get("type") || "register"}</p>
              </div>

              {/* VERIFY BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mb-4 p-3 text-center bg-[#524A4C] rounded-2xl text-white border-1 border-[#A1A1A1] cursor-pointer transition duration-700 ease-in-out hover:bg-white hover:text-[#E37C42] hover:border-[#E37C42] border-[1.3px] disabled:opacity-70"
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </button>

              {/* RESEND CODE */}
              <div className="text-center mb-4">
                <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
                {countdown > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend code in <span className="font-medium">{countdown}</span> seconds
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      // Get the current verification type and email
                      const type = searchParams.get("type") || "register";
                      const email = searchParams.get("email") || localStorage.getItem("userEmail") || "";
                      
                      // Redirect to resend-token page with query parameters
                      router.push(`/pages/resend-token?type=${type}&email=${email}`);
                    }}
                    disabled={isResending}
                    className="text-[#E37C42] font-medium hover:underline disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                )}
              </div>

              {/* LOGIN LINK */}
              <p className="text-center text-[14px]">
                Already verified?{" "}
                <a href="/pages/signin" className="text-[#E37C42] cursor-pointer">
                  Login
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

export default VerifyToken
