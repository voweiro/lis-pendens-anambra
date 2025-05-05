import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-[#f7f7fa] to-[#c3f2e2] flex flex-col items-center">
      <div className="w-full max-w-screen-sm px-2 sm:px-4 pt-4 pb-20 flex flex-col gap-4">
        {children}
      </div>
    </main>
  );
};

export default DashboardLayout;
