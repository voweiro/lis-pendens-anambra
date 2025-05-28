"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  LoginRequest,
  getUserRedirectPath,
} from "@/Services/AuthRequest/auth.request";
import useAuth from "@/hooks/useAuth";
import BounceLoader from "react-spinners/BounceLoader";
import logoWhite from "@/asserts/lis-pendens-logo-white.png";
import authimg from "@/asserts/auth-bg.png"; // update path if needed
import Image from "next/image";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmitHandler = async (data: any) => {
    // Set login loading state to true when the login button is clicked
    setLoginLoading(true);

    try {
      // Only pass email and password to match LoginBody type
      const response = await LoginRequest({
        email: data.email,
        password: data.password,
      });
      console.log("Login response:", response);

      if (!response) {
        toast.error("Login failed: No response from server");
        return;
      }

      // Extract data from the API response structure
      let userType = "";
      let token = null;

      // Use type assertion to handle the response type
      const typedResponse = response as any;

      // Try to get user type from different possible locations in the response
      if (typedResponse.data && typedResponse.data.type) {
        // Based on the Postman example, the type is in data.type
        userType = typedResponse.data.type;
        console.log("Found user type in data.type:", userType);
      } else if (typedResponse.data && typedResponse.data.user_type) {
        userType = typedResponse.data.user_type;
        console.log("Found user type in data.user_type:", userType);
      } else if (typedResponse.role) {
        userType = typedResponse.role;
        console.log("Found user type in role:", userType);
      } else if (typedResponse.type) {
        userType = typedResponse.type;
        console.log("Found user type in type:", userType);
      }

      // Try to get token from different possible locations in the response
      if (typedResponse.token) {
        token = typedResponse.token;
      } else if (typedResponse.data && typedResponse.data.token) {
        token = typedResponse.data.token;
      }

      console.log("Extracted user type:", userType);
      console.log("Extracted token:", token);

      // Set user data in localStorage for backward compatibility
      const user = typedResponse.data;
      const userId = (
        typedResponse.user_id ||
        (typedResponse.data && typedResponse.data.id)
      )?.toString();

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      if (userId) {
        localStorage.setItem("session_id", userId);
        sessionStorage.setItem("user_id", userId); // For search history auth
      }

      // Create auth object with all necessary data
      const authData = {
        role: userType || null,
        accessToken: token || null,
        email: typedResponse.data?.email || undefined,
        firstName: typedResponse.data?.first_name || undefined,
        user_id: userId || undefined,
      };

      // Check if the user's email is verified
      const isEmailVerified = typedResponse.data?.email_verified_at || false;
      console.log("Email verification status:", isEmailVerified);

      // Set auth state
      setAuth(authData);

      // If email is not verified, redirect to verification page
      if (!isEmailVerified) {
        toast.warning("Please verify your email address to continue");
        console.log("Email not verified, redirecting to verification page");

        // Store the email in localStorage for the verification page
        if (typedResponse.data?.email) {
          localStorage.setItem("userEmail", typedResponse.data.email);
        }

        // Redirect to verify-token page
        router.push(
          `/pages/verify-token?email=${encodeURIComponent(
            typedResponse.data?.email || ""
          )}&type=REGISTER`
        );
      } else {
        toast.success("Login Successful");

        // Get the appropriate redirect path based on user type
        const redirectPath = getUserRedirectPath(userType);
        console.log("Redirecting to:", redirectPath);

        // Navigate to the appropriate page
        router.push(redirectPath);
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Check if the error is related to email verification
      const errorMessage =
        error?.response?.data?.message || error?.message || "Login failed";
      console.log("Error message:", errorMessage);

      // Check if the error message contains verification related text
      if (
        errorMessage.toLowerCase().includes("verified") ||
        errorMessage.toLowerCase().includes("verify") ||
        errorMessage.toLowerCase().includes("verification") ||
        errorMessage.toLowerCase().includes("account hasn't been verified")
      ) {
        toast.warning("Please verify your email address to continue");
        console.log(
          "Email verification required, redirecting to verification page"
        );

        // Try to get the email from the form data that was submitted
        const emailInput = document.querySelector(
          'input[type="email"]'
        ) as HTMLInputElement;
        const email = emailInput?.value || "";
        if (email) {
          localStorage.setItem("userEmail", email);
        }

        // Redirect to verify-token page
        router.push(
          `/pages/verify-token?email=${encodeURIComponent(
            email || ""
          )}&type=REGISTER`
        );
      } else {
        // For other errors, show the error message
        toast.error(errorMessage);
      }

      // Set login loading state to false when there's an error
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BounceLoader loading={pageLoading} size={100} color="#36d7b7" />
      </div>
    );
  }

  return (
    <>
      <div
        className="h-screen bg-white border-[0.2px] border-gray-500 bg-no-repeat bg-cover md:px-4"
        style={{ backgroundImage: `url(${authimg.src})` }}
      >
        <div className="pt-6 pl-4">
          <Link href="/" className="flex items-center space-x-4">
            {/* <Image src={logo} alt="LisPendens brand logo" priority /> */}
            <span className="text-[#FFBB10]  lg:text-[35px]  text-[15px] font-extrabold">
              Lis Pendens Anambra{" "}
            </span>
            {/* <span className="text-[#00AD20] font-extrabold text-[35px]"> Enugu</span> */}
          </Link>
          <br />

          {/* Back to Home Button */}
        </div>

        <div className="max-w-[650px] mx-auto mt-12 lg:mt-24">
          <section className="py-10 m-2 px-6 md:m-6 md:px-12 bg-white rounded-[30px] flex justify-center">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-6 text-[36px] text-black">Login</h3>

              {/* Email */}
              <div className="mb-4">
                <div className="w-full pt-1 bg-white rounded-2xl border-[1.3px] border-[#A1A1A1]">
                  <label className="text-[#8A8A8A] p-3">Email</label>
                  <input
                    type="email"
                    className="w-full outline-none p-1 md:p-2 pl-3 text-[#8A8A8A] rounded-b-2xl"
                    {...register("email")}
                  />
                </div>
                <p className="text-red-500 text-[0.75rem]">
                  {errors.email?.message}
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="w-full pt-1 bg-white rounded-2xl border-[1.3px] border-[#A1A1A1] relative">
                  <label className="text-[#8A8A8A] p-3">Password</label>
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

              {/* Forgot Password */}
              <div className="text-right mt-2 text-[14px] text-[#818181]">
                <Link href="/pages/resend-token">Forgot password?</Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full my-4 p-5 bg-black text-white rounded-2xl transition duration-700 ease-in-out hover:bg-white hover:text-black hover:border-black border-[1.3px] border-[#A1A1A1] flex justify-center items-center"
              >
                {loginLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              {/* Sign up Link */}
              <p className="text-center text-[14px]">
                Don’t have an account?{" "}
                <Link href="/pages/signup" className="text-black ml-1">
                  Sign up
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SignIn;
