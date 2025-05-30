import Link from "next/link";
import { BiUser } from "react-icons/bi";
import Image from "next/image";
import lislogo from "@/asserts/lis-pendens-logo-white.png";
import authimg from "@/asserts/auth-bg.png";

const SignUp = () => {
  return (
    <div
      className="h-screen bg-no-repeat bg-cover "
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
            className="w-full mt-4 p-3 text-center bg-[#FFBB10] rounded-2xl text-white border-1 border-[#FFBB10] cursor-pointer transition duration-700 ease-in-out hover:bg-[rgba(220,237,126,0.42)] hover:text-white  hover:border-[#FFBB10] border-[1.3px]"
          >
            <p>Individual</p>
          </Link>

          <Link
            href="/pages/signup-company"
            className="w-full mt-4 mb-4 p-3 text-center bg-[rgba(204,221,110,0.39)] rounded-2xl text-black border-1 border-[#FFBB10] cursor-pointer transition duration-700 ease-in-out hover:bg-[#FFBB10] hover:text-white hover:border-[#E37C42] border-[1.3px]"
          >
            <p>Company</p>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default SignUp;
