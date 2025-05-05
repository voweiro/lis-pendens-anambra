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
import { LoginRequest } from "@/Services/AuthRequest/auth.request";
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
  const [loading, setLoading] = useState(true);
  const { setAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmitHandler = async (data: any) => {
    const body = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await LoginRequest(body);
      console.log('Login response:', response);
      
      // Extract data from the new API response structure
      const role = response?.role;
      const accessToken = response?.token;
      const email = response?.data?.email;
      const firstName = response?.data?.first_name;
      const lastName = response?.data?.last_name;
      
      // Set user data in localStorage
      const user = response?.data;
      const userId = response?.user_id?.toString(); // Convert to string to match expected type
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      if (userId) {
        localStorage.setItem('session_id', userId);
        sessionStorage.setItem('user_id', userId); // <-- ensure sessionStorage is set for search history auth
      }
      
      // Create auth object with all necessary data
      const authData = { 
        role: role ?? null, 
        accessToken: accessToken ?? null, 
        email: email ?? undefined, 
        firstName: firstName ?? undefined, 
        user_id: userId ?? undefined
      };
      
      // Set auth state
      setAuth(authData);
      
      // Also directly set in sessionStorage as a backup
      sessionStorage.setItem('auth', JSON.stringify(authData));

      toast.success("Login Successful");
      console.log('Redirecting with role:', role);
      
      // Handle routing based on the role from the API response
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "registrar") {
        router.push("/court-registrar");
      } else if (role === "user_company") {
        // Handle user_company role from the API response
        router.push("/users");
      } else {
        // Default route for other roles
        router.push("/users");
      }
    } catch (error: any) {
      toast.error(error?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <BounceLoader loading={loading} size={100} color="#36d7b7" />
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
          <Link href="/">
            <Image
              src={logoWhite}
              alt="LisPendens brand logo"
              className="object-cover"
              priority
            />
          </Link>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center mt-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
          >
            ← Back to Home
          </Link>
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
                <Link href="/forgot-password">Forgot password?</Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full my-4 p-5 bg-black text-white rounded-2xl transition duration-700 ease-in-out hover:bg-white hover:text-black hover:border-black border-[1.3px] border-[#A1A1A1]"
              >
                Login
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
