import React from 'react';
import CourtRegistrarLayout from '@/components/court-registrar/layout';

import StatsBar from '@/components/court-registrar/dashboard/StatsBar';
import UsersAndReports from '@/components/super-admin/dashboard/UsersAndReports';
import UploadedCasesTable from '@/components/court-registrar/dashboard/UploadedCasesTable';

const CourtRegistrarDashboardPage = () => {
  return (
 
      <CourtRegistrarLayout className="mb-8" prop title="Dashboard">
     
      <StatsBar />
      
      <div className="mt-8 px-8">
        <UploadedCasesTable />
      </div>
      <UsersAndReports />

      </CourtRegistrarLayout>
    
  );
};

export default CourtRegistrarDashboardPage;
