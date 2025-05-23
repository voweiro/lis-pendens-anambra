import { Bell, Search } from "lucide-react";
import Image from "next/image";
import usericon from "@/asserts/user-avatar.png";

type HeaderProps = {
  title: string;
  description: string;
  showTitleOnMobile?: boolean;
  showDescriptionOnMobile?: boolean;
};

const Header = ({
  title,
  description,
  showTitleOnMobile = true,
  showDescriptionOnMobile = true,
}: HeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full flex justify-between items-center h-16 md:h-20 px-4 md:px-6">
        <div className="flex-1">
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 ${
              !showTitleOnMobile ? "hidden sm:block" : ""
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-gray-600 text-sm font-medium mt-1 ${
              !showDescriptionOnMobile ? "hidden sm:block" : ""
            }`}
          >
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="text-gray-500 w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="text-gray-500 w-5 h-5 md:w-6 md:h-6" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <Image
              src={usericon}
              alt="User"
              className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 cursor-pointer rounded-full border-2 border-gray-200"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Court Registrar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
