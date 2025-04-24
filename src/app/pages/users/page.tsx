// pages/user/dashboard.tsx

import NormalUserLayout from '@/components/users/layout';
import DashboardSummary from '@/components/users/dashboard/DashboardSummary';
import SearchHistory from '@/components/users/dashboard/SearchHistoryTable';

const UserDashboard = () => {
  return (
    <NormalUserLayout title="Dashboard">
      <DashboardSummary userName="John Doe" totalProperties="100" totalSearches="50" profileCompletion={80} />
      <SearchHistory />
    </NormalUserLayout>
  );
};

export default UserDashboard;
