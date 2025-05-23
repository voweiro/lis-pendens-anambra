import { CaseManagement } from "@/components/super-admin/manage-cases/manage";
import SuperAdminLayout from "@/components/super-admin/layout";

export default function Home() {
  return (
    <SuperAdminLayout title="Manage Cases" description="track cases">
      <div className="flex h-screen bg-gray-100">
        <main className="flex-1 overflow-auto">
          <CaseManagement />
        </main>
      </div>
    </SuperAdminLayout>
  );
}
