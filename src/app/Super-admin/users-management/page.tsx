import UserManagementSystem from "@/components/super-admin/users-management/user-management";
import SuperAdminLayout from "@/components/super-admin/layout";

export default function managecases() {
  return (
    <SuperAdminLayout title="Users Management" description="Manage Users">
      <div className="flex h-screen bg-gray-100">
        <main className="flex-1 overflow-auto">
          <UserManagementSystem />
        </main>
      </div>
    </SuperAdminLayout>
  );
}
