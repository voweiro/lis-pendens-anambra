import Link from "next/link";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import lislogo from "@/asserts/lis-pendens-logo-white.png";
import authimg from "@/asserts/auth-bg.png";

const SignUp = () => {
  return (
    <div
      className="h-screen bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${authimg.src})` }}
    >
      <div className="pt-6 pl-4">
        <Link href="/" className="flex items-center">
          <Image
            src={lislogo}
            alt="LisPendens brand logo"
            width={160}
            height={40}
            className="object-cover"
          />
        </Link>

        {/* ✅ Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center mt-4 text-black bg-white border border-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-[540px] w-full mx-auto mt-10 lg:mt-32">
        <section className="flex flex-col items-center justify-center py-4 m-2 px-4 md:m-6 md:px-12 bg-white rounded-[30px]">
          <div className="flex items-center mt-4">
            <BiUser className="text-4xl text-black mr-2" />
          </div>

          <div className="mb-4 flex items-center">
            <p className="text-2xl font-bold text-black">Sign Up</p>
          </div>

          <p className="mt-4 mb-2 text-lg text-black">
            Create an account as a/an
          </p>

          <Link
            href="/pages/signup-individual"
            className="w-full mt-4 p-3 text-center bg-[#524A4C] rounded-2xl text-white border-1 border-[#A1A1A1] cursor-pointer transition duration-700 ease-in-out hover:bg-white hover:text-[#E37C42] hover:border-[#E37C42] border-[1.3px]"
          >
            <p>Individual</p>
          </Link>

          <Link
            href="/pages/signup-company"
            className="w-full mt-4 mb-4 p-3 text-center bg-[#D9D9D9] rounded-2xl text-black border-1 border-[#A1A1A1] cursor-pointer transition duration-700 ease-in-out hover:bg-white hover:text-[#E37C42] hover:border-[#E37C42] border-[1.3px]"
          >
            <p>Company</p>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
