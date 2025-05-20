import { CaseManagement } from "@/components/manage-cases/manage";
import SuperAdminLayout from "../layout";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      
        <main className="flex-1 overflow-auto">
          <CaseManagement />
        </main>
      
    </div>
  );
}
