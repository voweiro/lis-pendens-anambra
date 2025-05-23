"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";
import { CaseDetailsModal } from "./case-detail-modal";
import { UploadModal } from "./upload";
import { CaseList } from "./case-list";
import { getAllCases } from "@/components/utils/api";
import { toast } from "react-toastify";

type CaseStatus = "On appeal" | "Disposed" | "Pending";

interface Case {
  id: string;
  propertyTitle: string;
  location: string;
  status: CaseStatus;
}

export function CaseManagement() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  // Function to refresh the case list after a new case is created
  const handleCaseCreated = () => {
    setIsUploadModalOpen(false);
    setRefreshData((prev) => !prev); // Toggle to trigger a refresh
    toast.success("Case created successfully");
  };

  return (
    <div className="p-6 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1 bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Upload New Case</span>
        </button>
      </div>

      <div className="mt-4">
        <CaseList refreshTrigger={refreshData} />
      </div>

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleCaseCreated}
        />
      )}

      {selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onStatusChange={(newStatus) => {
            // This will be implemented later when we add status change functionality
            setSelectedCase(null);
          }}
        />
      )}
    </div>
  );
}

function getNextStatus(currentStatus: CaseStatus): CaseStatus {
  switch (currentStatus) {
    case "On appeal":
      return "Pending";
    case "Pending":
      return "Disposed";
    case "Disposed":
      return "On appeal";
    default:
      return "Pending";
  }
}

interface StatusBadgeProps {
  status: CaseStatus;
  onClick?: () => void;
}

function StatusBadge({ status, onClick }: StatusBadgeProps) {
  if (status === "On appeal") {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1 cursor-pointer"
      >
        <span className="px-3 py-1 text-sm rounded-full border border-red-300 text-red-600">
          On appeal
        </span>
        <ChevronDown className="h-4 w-4 text-red-600" />
      </button>
    );
  }

  if (status === "Disposed") {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-1 cursor-pointer"
      >
        <span className="px-3 py-1 text-sm rounded-full border border-green-300 text-green-600">
          Disposed
        </span>
        <ChevronDown className="h-4 w-4 text-green-600" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 cursor-pointer"
    >
      <span className="px-3 py-1 text-sm rounded-full border border-orange-300 text-orange-600">
        Pending
      </span>
      <ChevronDown className="h-4 w-4 text-orange-600" />
    </button>
  );
}
