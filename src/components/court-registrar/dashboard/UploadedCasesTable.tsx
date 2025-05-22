"use client";

import React, { useState, useEffect } from 'react';
import { GetAllCases } from "@/Services/AuthRequest/auth.request";
import { Loader2 } from "lucide-react";
import { CaseDetailsModal } from "../uploaded-cases/case-details-modal";

type CaseStatus = "ongoing" | "pending" | "concluded";

interface Case {
  id: string;
  tile?: string; // Note: API has a typo, using 'tile' instead of 'title'
  title?: string; // Keep this for backward compatibility
  address?: string;
  status: CaseStatus;
  owner_name?: string;
  suit_number?: string;
  date_of_commencement?: string;
  date_of_disposal?: string;
  court_details?: string;
  nature_of_case?: string;
  judicial_division_id?: string;
  state_id?: string;
  lga_id?: string;
  created_at?: string;
  updated_at?: string;
  title_number?: string;
  survey_plan_number?: string;
  parties?: string;
  street?: string;
  city?: string;
  plot_number?: string;
  user_id?: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-400',
  ongoing: 'bg-blue-50 text-blue-600 border-blue-400',
  concluded: 'bg-green-50 text-green-700 border-green-400',
  // Fallback for unknown statuses
  default: 'bg-gray-50 text-gray-600 border-gray-400'
};

const UploadedCasesTable: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Calling GetAllCases API...');
        const response = await GetAllCases();
        console.log('Raw API response:', response);
        
        if (response.success && response.data) {
          console.log('Fetched cases for dashboard:', response.data);
          console.log('First case data structure:', response.data[0] ? JSON.stringify(response.data[0], null, 2) : 'No cases found');
          
          // Log each case's ID and type to debug issues
          response.data.forEach((caseItem: Case, index: number) => {
            console.log(`Case ${index} - ID: ${caseItem.id}, Type: ${typeof caseItem.id}`);
            console.log(`Case ${index} - Title: ${caseItem.tile || caseItem.title || 'No title'}`);
            console.log(`Case ${index} - Status: ${caseItem.status || 'No status'}`);
          });
          
          // Only show the most recent 3 cases
          setCases(response.data.slice(0, 3));
        } else {
          console.error('Failed to fetch cases for dashboard:', response.error);
          setError(response.error || 'Failed to fetch cases');
        }
      } catch (err) {
        console.error('Error fetching cases for dashboard:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCases();
  }, []);

  // Helper function to get the status style
  const getStatusStyle = (status: string) => {
    return statusStyles[status.toLowerCase()] || statusStyles.default;
  };

  // Helper function to get the title
  const getTitle = (caseItem: Case) => {
    return caseItem.title || caseItem.tile || 'Untitled Case';
  };

  // Helper function to get the location
  const getLocation = (caseItem: Case) => {
    if (caseItem.address) return caseItem.address;
    
    const parts = [];
    if (caseItem.plot_number) parts.push(caseItem.plot_number);
    if (caseItem.street) parts.push(caseItem.street);
    if (caseItem.city) parts.push(caseItem.city);
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
  };

  // Function to handle viewing case details
  const handleViewDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowDetailsModal(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedCase(null);
  };

  // Function to handle case status changes
  const handleStatusChange = (id: string, newStatus: CaseStatus) => {
    // Update the case status in the local state
    setCases(prevCases => 
      prevCases.map(caseItem => 
        caseItem.id === id ? { ...caseItem, status: newStatus } : caseItem
      )
    );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-2 sm:p-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h2 className="font-semibold text-lg">Uploaded cases</h2>
          <button 
            onClick={() => window.location.href = '/court-registrar/managecase'} 
            className="text-gray-700 font-medium flex items-center gap-1"
          >
            More <span>&gt;</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Loading cases...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : cases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No cases found</div>
        ) : (
          <>
            {/* Mobile: Card view */}
            <div className="flex flex-col gap-3 sm:hidden">
              {cases.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 flex flex-col gap-1 shadow-sm">
                  <div className="font-medium text-sm">{getTitle(item)}</div>
                  <div className="text-xs text-gray-500">{getLocation(item)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${getStatusStyle(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    <button 
                      onClick={() => handleViewDetails(item)}
                      className="ml-auto border border-gray-300 rounded-lg px-3 py-1 text-xs hover:bg-gray-100 transition"
                    >
                      See Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop: Table view */}
            <table className="min-w-full text-left hidden sm:table">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3 font-medium">Property Title (cert of occupancy)</th>
                  <th className="py-2 px-3 font-medium">Location/Address of Property</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="py-2 px-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {cases.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="py-3 px-3 whitespace-nowrap max-w-[220px] truncate">{getTitle(item)}</td>
                    <td className="py-3 px-3 whitespace-nowrap max-w-[220px] truncate">{getLocation(item)}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-3 py-1 rounded-full border text-xs font-medium ${getStatusStyle(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button 
                        onClick={() => handleViewDetails(item)}
                        className="border border-gray-300 rounded-lg px-4 py-1 text-sm hover:bg-gray-100 transition"
                      >
                        See Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Case Details Modal */}
      {showDetailsModal && selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
          onCaseDeleted={(id) => {
            setCases(prevCases => prevCases.filter(caseItem => caseItem.id !== id));
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default UploadedCasesTable;
