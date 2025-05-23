import React, { ReactNode } from "react";
import Sidebar from "@/components/court-registrar/dashboard/Sidebar";
import Header from "@/components/court-registrar/dashboard/Header";

type CourtRegistrarLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

const CourtRegistrarLayout = ({
  title,
  description,
  children,
  className,
}: CourtRegistrarLayoutProps) => {
  return (
    <div className={`flex min-h-screen bg-gray-50 ${className || ""}`}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <Header
          title={title}
          description={description}
          showTitleOnMobile={false}
          showDescriptionOnMobile={false}
        />

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
};

export default CourtRegistrarLayout;
