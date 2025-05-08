import usericon from "@/asserts/user-avatar.png"
import Image from "next/image"


type HeaderProps = {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="pt-5  w-full lg:w-[98%]  ">
    <div className="  flex justify-between items-center pl-7  border-[#23A863]  shadow-sm rounded-2xl  lg:h-[100px] h-full">
     
      <h1 className="lg:text-[38px] text-[28px] font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-full border"
        />
        <Image src={usericon} alt="User" className="w-10 h-10 rounded-full" />
      </div>
    </div>
    <hr  className="w-full lg:w-[98%]  border-[#23A863]  border-b-[1px]"/>
    </div>
  )
}

export default Header
