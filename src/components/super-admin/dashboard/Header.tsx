import { Bell, Search } from "lucide-react";
import Image from "next/image";
import usericon from "@/asserts/user-avatar.png";

type HeaderProps = {
  title: string;
  description: string;
};

const Header = ({ title, description }: HeaderProps) => {
  return (
    <div>
      <div className="lg:w-[98%]  w-full  rounded-2xl  border-[#ffbb10] shadow-sm flex justify-between items-center  h-full  lg:h-[100px]">
        <div className="pl-5 ">
          <h1 className="lg:text-[38px]  text-[28px] sm:text-[10px]   font-semibold">
            {title}
          </h1>
          <p className="text-[#4D4D4D] text-[14px] font-medium">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-10">
          <Search className="text-gray-500 cursor-pointer" />
          <Bell className="text-gray-500 cursor-pointer" />
          <Image
            src={usericon}
            alt="User"
            className="w-15 h-15 cursor-pointer rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
