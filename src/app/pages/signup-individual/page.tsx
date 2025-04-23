"use client"
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Change to this
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignUpRequestForIndividual } from "@/Services/AuthRequest/auth.request";

// Import images
import authBgImage from "@/asserts/auth-bg.png";
import logoImage from "@/asserts/lis-pendens-logo-white.png";

// Schema validation with Yup
const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(3, "First Name must be greater than 3 letters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(3, "Last Name must be greater than 3 letters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  phoneNumber: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});

const SignUpIndividual = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // useRouter from next/navigation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmitHandler = async (data) => {
    const body = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNumber: data?.phoneNumber || undefined,
    };
    try {
      await SignUpRequestForIndividual(body);
      toast.success("SignUp Successful");
      setTimeout(() => {
        router.push("/pages/signin");
      }, 2000);
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="relative w-full h-screen">
        {/* Background image */}
        <Image
          src={authBgImage}
          alt="Auth background"
          fill
          priority
          className="object-cover -z-10"
        />
        <a href="/" className="flex items-center pt-6 pl-4">
          <img
            src={logoImage.src}
            alt="LisPendens brand logo"
            className="text-white object-cover"
          />



        
        </a>

        
        <Link
          href="/"
          className="inline-flex items-center mt-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Home
        </Link>
        <div className="max-w-[540px] w-full mx-auto mt-10 lg:mt-24">
          <section className="py-4 m-2 px-4 md:m-6 md:px-12 bg-white rounded-[30px]">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-2 text-[24px] font-bold text-black">Sign up</h3>

              {/* FIRST NAME */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="text"
                  placeholder="First name"
                  name="firstName"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("firstName")}
                />
                <p className="text-red-500 text-[0.75rem] text-right">
                  {errors.firstName?.message}
                </p>
              </div>

              {/* LAST NAME */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="text"
                  placeholder="Last name"
                  name="lastName"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("lastName")}
                />
                <p className="text-red-500 text-[0.75rem] text-right">
                  {errors.lastName?.message}
                </p>
              </div>

              {/* EMAIL */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("email")}
                />
                <p className="text-red-500 text-[0.75rem] text-right">
                  {errors.email?.message}
                </p>
              </div>

              {/* PHONE NUMBER */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone number (optional)"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("phoneNumber")}
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <div className="max-w-[400px] mb-2 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
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
                      className="absolute right-2 top-6 cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword((prev) => !prev)}
                      color="#8A8A8A"
                    />
                  )}
                </div>
                <p className="text-red-500 text-[0.75rem] text-right">
                  {errors.password?.message}
                </p>
              </div>

              {/* TERMS AND CONDITIONS */}
              <div className="w-full mb-4 pt-1 text-[14px]">
                <p className="text-[#818181]">
                  By selecting Agree and continue, I agree to LisPendes’{" "}
                  <span className="text-[#524A4C]">
                    Terms of Service, Information Terms of Service,{" "}
                  </span>
                  and
                  <span className="text-[#524A4C] ml-1">
                    Nondiscrimination Policy{" "}
                  </span>
                  and acknowledge the{" "}
                  <span className="text-[#524A4C]">Privacy Policy.</span>
                </p>
              </div>

              {/* AGREE AND CONTINUE BUTTON */}
              <button
                type="submit"
                className="w-full mb-4 p-3 text-center bg-[#524A4C] rounded-2xl text-white border-1 border-[#A1A1A1] cursor-pointer transition duration-700 ease-in-out hover:bg-white hover:text-[#E37C42] hover:border-[#E37C42] border-[1.3px]"
              >
                Agree and continue
              </button>

              {/* LOGIN LINK */}
              <p className="text-center text-[14px]">
                Already have an account?{" "}
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
  );
};

export default SignUpIndividual;
