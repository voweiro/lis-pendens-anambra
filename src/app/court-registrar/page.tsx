import React from 'react';
import CourtRegistrarLayout from '@/components/court-registrar/layout';

import TopActions from '@/components/court-registrar/dashboard/TopActions';
import StatsBar from '@/components/court-registrar/dashboard/StatsBar';
import UploadedCasesTable from '@/components/court-registrar/dashboard/UploadedCasesTable';

const CourtRegistrarDashboardPage = () => {
  return (
 

      <CourtRegistrarLayout className="mb-8 " title="Court Registrar"  description="Court 3 of the Awka Judicial Division">

     
      <StatsBar />
      <TopActions />
      <div className="mt-8 px-8">
        <UploadedCasesTable />
      </div>
      </CourtRegistrarLayout>
    
  );
};

export default CourtRegistrarDashboardPage;
