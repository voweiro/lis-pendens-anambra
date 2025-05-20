import React from "react";
import CaseListing from "@/components/court-registrar/uploaded-cases/cases";
import CourtRegistrarLayout from "@/components/court-registrar/layout";

function page() {
  return (
    <CourtRegistrarLayout
      title="Manage Cases"
      description="View and manage all uploaded court cases"
    >
      <div className="p-4">
        <CaseListing />
      </div>
    </CourtRegistrarLayout>
  );
}

export default page;
