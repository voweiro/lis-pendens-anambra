"use client";

import CourtRegistrarLayout from "@/components/court-registrar/layout";
import ActivityFeed from "@/components/court-registrar/flagged-case/activity-feed";



const FlaggedCasePage = () => {
    
  
    return (
      <CourtRegistrarLayout title="Flagged-case" description='Track your searches and manage overall activities'>
        <div>
          {/* Add your content here */}
          <ActivityFeed />
        </div>
      </CourtRegistrarLayout>
    );
  };
  
  export default FlaggedCasePage;