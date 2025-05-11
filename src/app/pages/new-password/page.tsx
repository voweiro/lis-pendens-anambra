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
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"

// Import images
import authBgImage from "@/asserts/auth-bg.png"
import logoImage from "@/asserts/lis-pendens-logo-white.png"

// Import the UpdateProfileRequest function
import { UpdateProfileRequest } from "@/Services/AuthRequest/auth.request"

// Schema validation with Yup
const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
})

interface NewPasswordFormData {
  password: string
  confirmPassword: string
}

const NewPassword = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormData>({
    resolver: yupResolver(schema),
  })

  // Get email from URL params
  useEffect(() => {
    const emailParam = searchParams.get("email")
    
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // Fallback to localStorage if email is not in URL
      const storedEmail = localStorage.getItem("userEmail")
      if (storedEmail) {
        setEmail(storedEmail)
      } else {
        // If no email is found, redirect back to forgot password
        toast.error("Email address is missing. Redirecting to forgot password page.")
        setTimeout(() => {
          router.push("/pages/forgot-password")
        }, 2000)
      }
    }

    // Check if reset password token exists in session storage
    const resetToken = sessionStorage.getItem("resetPasswordToken")
    if (!resetToken) {
      // If no token is found, redirect back to verify token page
      toast.error("Reset token is missing. Redirecting to verification page.")
      setTimeout(() => {
        router.push("/pages/verify-token")
      }, 2000)
    }
  }, [searchParams, router])

  const onSubmitHandler = async (data: NewPasswordFormData) => {
    if (!email) {
      toast.error("Email is missing. Please try the reset password process again.")
      return
    }

    // Get the auth token from session storage
    const authToken = sessionStorage.getItem('resetPasswordToken')
    if (!authToken) {
      toast.error("Authentication token is missing. Please verify your email again.")
      return
    }

    setIsSubmitting(true)
    try {
      // Store the token in session storage for the UpdateProfileRequest function to use
      sessionStorage.setItem('token', authToken)
      
      // Call the update profile API endpoint to update the password
      const responseData = await UpdateProfileRequest({
        password: data.password,
        password_confirmation: data.confirmPassword
      })
      
      toast.success("Password reset successfully! Redirecting to login page.")
      
      // Clear stored email and tokens
      localStorage.removeItem("userEmail")
      sessionStorage.removeItem("resetPasswordToken")
      sessionStorage.removeItem("token")
      
      setTimeout(() => {
        router.push("/pages/signin")
      }, 2000)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Password reset failed. Please try again.")
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
          href="/pages/forgot-password"
          className="inline-flex items-center mt-4 ml-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Forgot Password
        </Link>
        
        <div className="max-w-[650px] mx-auto mt-12 lg:mt-24">
          <section className="py-10 m-2 px-6 md:m-6 md:px-12 bg-white rounded-[30px] flex justify-center">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-6 text-[36px] text-black">Reset Password</h3>
              <p className="mb-6 text-gray-600">
                Please enter your new password below.
              </p>

              {/* Password */}
              <div className="mb-4">
                <div className="w-full pt-1 bg-white rounded-2xl border-[1.3px] border-[#A1A1A1] relative">
                  <label className="text-[#8A8A8A] p-3">New Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full outline-none p-1 md:p-2 pl-3 text-[#8A8A8A] rounded-b-2xl"
                    {...register("password")}
                  />
                  {showPassword ? (
                    <BsEyeSlashFill
                      className="absolute right-2 top-8 cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword((prev) => !prev)}
                      color="#8A8A8A"
                    />
                  ) : (
                    <BsEyeFill
                      className="absolute right-2 top-8 cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword((prev) => !prev)}
                      color="#8A8A8A"
                    />
                  )}
                </div>
                <p className="text-red-500 text-[0.75rem]">
                  {errors.password?.message}
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <div className="w-full pt-1 bg-white rounded-2xl border-[1.3px] border-[#A1A1A1] relative">
                  <label className="text-[#8A8A8A] p-3">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full outline-none p-1 md:p-2 pl-3 text-[#8A8A8A] rounded-b-2xl"
                    {...register("confirmPassword")}
                  />
                  {showConfirmPassword ? (
                    <BsEyeSlashFill
                      className="absolute right-2 top-8 cursor-pointer"
                      size={20}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      color="#8A8A8A"
                    />
                  ) : (
                    <BsEyeFill
                      className="absolute right-2 top-8 cursor-pointer"
                      size={20}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      color="#8A8A8A"
                    />
                  )}
                </div>
                <p className="text-red-500 text-[0.75rem]">
                  {errors.confirmPassword?.message}
                </p>
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full my-4 p-5 bg-black text-white rounded-2xl transition duration-700 ease-in-out hover:bg-white hover:text-black hover:border-black border-[1.3px] border-[#A1A1A1] flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="text-[#818181]">
                  Remember your password?{" "}
                  <Link href="/pages/signin" className="text-black font-semibold">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default NewPassword
