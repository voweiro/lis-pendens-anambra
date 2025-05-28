import React from "react";
import UploadCaseForm from "../upload-case-form";

const TopActions: React.FC = () => (
  <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 md:px-8 py-3 md:py-4">
    <button className="border border-black rounded-full px-6 py-2 font-semibold bg-white hover:bg-[#d8d39e] shadow-sm">
      Search case record
    </button>
    <button className="rounded-md px-6 py-2 font-semibold bg-[#ffbb10] text-white hover:bg-[#d2d89e]">
      {" "}
      <UploadCaseForm />
    </button>
  </div>
);

export default TopActions;
