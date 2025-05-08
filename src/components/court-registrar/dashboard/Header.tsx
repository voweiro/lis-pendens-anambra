import React from 'react'
import { BiAlarm, BiBell, BiSearch, BiUser } from 'react-icons/bi'



type HeaderProps = {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center max-w-[95%] mx-auto ">
      <h1 className="text-[28px] font-[800] ">{title}</h1>
      <div className="flex items-center gap-4 ">
        <div className='w-[42px] h-[42px] border border-gray-300 rounded-full flex items-center justify-center'>
          <BiSearch className="w-8 h-8" />
        </div>
        <div className='w-[42px] h-[42px] border border-gray-300 rounded-full flex items-center justify-center'>
          <BiBell className="w-8 h-8" />
        </div>
        <div className='w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center'>
          <BiUser className="w-6 h-6" />
        </div>

      </div>
    </div>
  )
}

export default Header
