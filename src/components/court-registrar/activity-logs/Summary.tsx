export default function Summary() {
  return (
    <div className="mt-8 px-8 flex gap-4">
        <div className="h-[240px] w-[267px] bg-white rounded-[29px] flex flex-col ">
          <h1 className="text-[17px] font-bold pt-5 pl-6">Summary</h1>
          <div className="h-[1px] w-[222px] bg-[#E8E8E8] mt-3 ml-3"></div>
          <div className="relative gap-2 mt-3 ml-5">
            <div className="absolute h-[112px] w-[112px] bg-[#D5D5D5] rounded-full flex justify-center items-center">
              <div className="flex flex-col text-center">
                <p className="text-black text-[28px] font-bold">350</p>
                <h1 className="text-[14px] font-semibold">Total Upload</h1>
              </div>
            </div>
            <div className="absolute  flex-col h-[112px] w-[112px] right-2 top-11 bg-[#221F1D] rounded-full flex justify-center items-center">
              <div className="flex flex-col text-center">
                <p className="text-white text-[28px] font-bold">185</p>
                <h1 className="text-[14px] font-semibold text-white">
                  Total Update
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[240px] w-full bg-white  rounded-[29px]">
          {/* date picker */}
          <h1 className="text-[17px] font-bold pt-4 pb-4 pl-6 bg-[#F4F4F4]">
            Date Picker
          </h1>
          {/* time between 11 and 12 */}
          <div className="pt-4 pl-7">
            <div className="flex items-center gap-3">
              <h1>11:00AM</h1>
              <div className="h-[1px] w-[90%] bg-green-500"></div>
            </div>
            <div className="space-y-2">
              <div className="flex w-[95%] items-center gap-2 bg-[#4D4A49] pt-3 pb-3 border-l-4 border-black ml-8 mt-2">
                <span className="text-white pl-2">UPDATED: </span>
                <span className="text-gray-300">
                  Michael Okpara updated status of XAVIER vs ABAH to be closed,
                  on 20 May 2024 at 11:45AM
                </span>
              </div>
              <div className="flex w-[95%] items-center gap-2 bg-[#DCDCDC] pt-3 pb-3 border-l-4 border-black ml-8">
                <span className="text-black pl-2">UPLOADED: </span>
                <span className="text-gray-600">
                    <span className=" text-black">maryslessor@gmail.com </span>uploaded AAA vs. Primehomes & 2 Others, on 20 May 2024 at 6:34PM
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <h1>12:00PM</h1>
              <div className="h-[1px] w-[80%] bg-green-500"></div>
            </div>
          </div>
        </div>
      </div>
  )
}