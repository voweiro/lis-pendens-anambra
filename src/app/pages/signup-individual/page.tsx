"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  type: yup.string().required("User type is required"),
  name: yup
    .string()
    .required("First Name is required")
    .min(3, "First Name must be greater than 3 letters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Invalid Email format"),
  phone_number: yup.string(),
  dob: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 6 characters")
    .max(20, "Password must not exceed 20 characters"),
});

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const SignUpIndividual = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const email = watch("email");

  useEffect(() => {
    setValue("type", "individual");
  }, [setValue]);

  const onSubmitHandler = async (data: {
    name: string;
    email: string;
    password: string;
    phone_number?: string;
    dob?: string;
    type: string;
  }) => {
    setIsSubmitting(true);

    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone_number: data?.phone_number || undefined,
      dob: data?.dob || undefined,
      type: data.type,
    };

    try {
      await SignUpRequestForIndividual(body);
      toast.success("SignUp Successful");

      localStorage.setItem("userEmail", data.email);

      // Navigate to verification page with email as query parameter
      setTimeout(() => {
        router.push(
          `/pages/verify-token?email=${encodeURIComponent(
            data.email
          )}&type=REGISTER`
        );
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.log(apiError?.response?.data?.message);
      toast.error(apiError?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Link href="/" className="flex items-center space-x-4">
          {/* <Image src={logo} alt="LisPendens brand logo" priority /> */}
          <span className="text-[#FFBB10]  lg:text-[35px]  text-[15px] font-extrabold">
            Lis Pendens Anambra{" "}
          </span>
          {/* <span className="text-[#00AD20] font-extrabold text-[35px]"> Enugu</span> */}
        </Link>

        <div className="backdrop-blur-md p-6 rounded-lg shadow-xl mx-auto w-full max-w-md h-[80vh] overflow-y-auto">
          <section className="py-4 m-2 px-4 md:m-6 md:px-12 bg-white rounded-[30px]">
            <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
              <h3 className="mb-2 text-[24px] font-bold text-black">Sign up</h3>

              {/* FIRST NAME */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("name")}
                />
                <p className="text-red-500 text-[0.75rem] text-right">
                  {errors.name?.message}
                </p>
              </div>

              {/* EMAIL */}
              <div className="max-w-[400px] mb-2">
                <input
                  type="email"
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
                  placeholder="Phone number (optional)"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("phone_number")}
                />
              </div>

              <div className="max-w-[400px] mb-2">
                <p className="text-[0.75rem] text-[#818181]">Date of Birth</p>
                <input
                  type="date"
                  placeholder="date of birth"
                  className="w-full mt-2 outline-none focus:out-none border-[1.2px] border-slate-300 rounded-lg p-2"
                  {...register("dob")}
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-4">
                <div className="max-w-[400px] mb-2 relative">
                  <input
                    type={showPassword ? "text" : "password"}
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
                  By selecting Agree and continue, I agree to LisPendes'{" "}
                  <span className="text-[#524A4C]">Terms of Use, And </span>
                  <span className="text-[#524A4C]">Privacy Policy.</span>
                </p>
              </div>

              {/* AGREE AND CONTINUE BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mb-4 p-3 text-center bg-[#FFBB10] rounded-2xl text-white border-1 border-[#cfc3a4] cursor-pointer transition duration-700 ease-in-out hover:bg-[#f4e5bf] hover:text-black hover:border-[#FFBB10] border-[1.3px] disabled:opacity-70"
              >
                {isSubmitting ? "Processing..." : "Agree and continue"}
              </button>

              {/* LOGIN LINK */}
              <p className="text-center text-[14px]">
                Already have an account?{" "}
                <a
                  href="/pages/signin"
                  className="text-[#E37C42] cursor-pointer"
                >
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
