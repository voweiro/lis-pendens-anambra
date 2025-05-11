import CourtRegistrarLayout from "@/components/court-registrar/layout";
import React from "react";
import Summary from "@/components/court-registrar/activity-logs/Summary";

function page() {
  return (
    <CourtRegistrarLayout
      title="Activity-logs"
      description="Track your searches and manage overall activities"
    >
      <div className="">
        <Summary />
        
      <div>hello</div>
       </div>

    </CourtRegistrarLayout>
  );
}

export default page;
