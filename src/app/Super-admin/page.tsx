// import React from "react";
"use client";

import SuperAdminLayout from "@/components/super-admin/layout";

import StatsBar from "@/components/super-admin/dashboard/StatsBar";
import UsersAndReports from "@/components/super-admin/dashboard/UsersAndReports";
import UploadedCasesTable from "@/components/court-registrar/dashboard/UploadedCasesTable";
// import SuperAdminLayout from "./layout";

const CourtRegistrarDashboardPage = () => {
  return (
    <>
      <SuperAdminLayout title="Super Admin" description="Dashboard">
        <StatsBar />

        <div className="mt-8 px-8">
          <UploadedCasesTable />
        </div>
        <UsersAndReports />
      </SuperAdminLayout>
    </>
  );
};

export default CourtRegistrarDashboardPage;
