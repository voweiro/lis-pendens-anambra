// pages/user/dashboard.tsx

import NormalUserLayout from '@/components/users/layout';
import DashboardSummary from '@/components/users/dashboard/DashboardSummary';
import SearchHistoryTable from '@/components/users/dashboard/SearchHistoryTable';

const UserDashboard = () => {
  return (
    <NormalUserLayout className="mb-5" title="Dashboard">
      {/* Welcome and Stats Section */}
      <div className="mb-8">
        <DashboardSummary
          userName="Victor"
          totalProperties="40000"
          totalSearches="50"
          profileCompletion={8000}
        />
      </div>
      {/* Searched History Table Section */}
      <SearchHistoryTable />
    </NormalUserLayout>
  );
};

export default UserDashboard;
