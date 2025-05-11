"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignUpRequestForBusiness } from "@/Services/AuthRequest/auth.request"; // adjust this path if needed

import AuthBg from "@/asserts/auth-bg.png"; // Ensure this path matches your project structure
import Logo from "@/asserts/lis-pendens-logo-white.png";

const schema = yup.object().shape({
  nameOfCompany: yup
    .string()
    .required("Company name is required")
    .min(3, "Company Name must be greater than 3 letters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  phoneNumber: yup.string(),
  dob: yup.string(), // Date of establishment
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});

const SignUpCompany = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmitHandler = async (data: any) => {
    // Format the request body to match the structure expected by the API
    const body = {
      type: "company", // Set the type to company
      name: data.nameOfCompany, // Use nameOfCompany as the name field
      email: data.email,
      password: data.password,
      phone_number: data?.phoneNumber || undefined, // Use phone_number instead of phoneNumber
      dob: data?.dob || undefined, // Include date of establishment
    };
    
    console.log('Company signup request body:', body);
    
    try {
      const response = await SignUpRequestForBusiness(body);
      console.log('Company signup response:', response);
      toast.success("SignUp Successful");
      
      // Redirect to the verify-token page with email parameter
      setTimeout(() => {
        // Construct the URL with query parameters
        const verifyTokenUrl = `/pages/verify-token?email=${encodeURIComponent(data.email)}&type=REGISTER`;
        router.push(verifyTokenUrl);
      }, 2000);
    } catch (error: any) {
      console.error('Company signup error:', error);
      toast.error(error?.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <>
      <div className="relative w-full h-screen">
        {/* Background image */}
        <Image
          src={AuthBg}
          alt="Auth background"
          fill
          priority
          className="object-cover -z-10"
        />

        {/* Logo */}
        <div className="pt-6 pl-4">
          <Link href="/" className="flex items-center">
            <Image src={Logo} alt="LisPendens brand logo" width={160} height={50} />
          </Link>



          <Link
          href="/"
          className="inline-flex items-center mt-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Home
        </Link>
        </div>

        {/* Form container */}
        <div className="max-w-[540px] w-full mx-auto mt-10 lg:mt-24 px-4">
          <section className="py-4 px-4 md:px-12 bg-white rounded-[30px] shadow-md">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-4 text-[24px] font-bold text-black">Sign up</h3>

              {/* Company Name */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="text"
                  placeholder="Name (Company or Business)"
                  className="w-full mt-2 border border-slate-300 rounded-lg p-2 outline-none"
                  {...register("nameOfCompany")}
                />
                <p className="text-red-500 text-sm text-right">
                  {errors.nameOfCompany?.message}
                </p>
              </div>

              {/* Email */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="w-full mt-2 border border-slate-300 rounded-lg p-2 outline-none"
                  {...register("email")}
                />
                <p className="text-red-500 text-sm text-right">
                  {errors.email?.message}
                </p>
              </div>

              {/* Phone Number */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  className="w-full mt-2 border border-slate-300 rounded-lg p-2 outline-none"
                  {...register("phoneNumber")}
                />
                <p className="text-red-500 text-sm text-right">
                  {errors.phoneNumber?.message}
                </p>
              </div>

              {/* Date of Establishment */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="date"
                  placeholder="Date of Establishment (optional)"
                  className="w-full mt-2 border border-slate-300 rounded-lg p-2 outline-none"
                  {...register("dob")}
                />
                <p className="text-red-500 text-sm text-right">
                  {errors.dob?.message}
                </p>
              </div>

              {/* Password */}
              <div className="max-w-[400px] mb-4 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full mt-2 border border-slate-300 rounded-lg p-2 outline-none"
                  {...register("password")}
                />
                {showPassword ? (
                  <BsEyeSlashFill
                    className="absolute right-2 top-3 cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword((prev) => !prev)}
                    color="#8A8A8A"
                  />
                ) : (
                  <BsEyeFill
                    className="absolute right-2 top-3 cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword((prev) => !prev)}
                    color="#8A8A8A"
                  />
                )}
                <p className="text-red-500 text-sm text-right">
                  {errors.password?.message}
                </p>
              </div>

              {/* Terms */}
              <div className="text-sm mb-4 text-[#818181]">
                By selecting Agree and continue, I agree to LisPendes’
                <span className="text-[#524A4C]"> Terms of Service,</span>
                <span className="text-[#524A4C]"> Information Terms of Service,</span>
                and
                <span className="text-[#524A4C] ml-1"> Nondiscrimination Policy </span>
                and acknowledge the{" "}
                <span className="text-[#524A4C]">Privacy Policy.</span>
              </div>

              {/* Submit Button */}
              <button className="w-full mb-4 p-3 text-center bg-[#524A4C] rounded-2xl text-white border border-[#A1A1A1] transition hover:bg-white hover:text-[#E37C42] hover:border-[#E37C42]">
                Agree and continue
              </button>

              {/* Login link */}
              <p className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-[#E37C42] underline">
                  Login
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

export default SignUpCompany;
