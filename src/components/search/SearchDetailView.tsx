import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";

interface SearchResult {
  id: string | number;
  title: string;
  owner: string;
  summary?: string;
  details?: any;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SearchDetailView = () => {
  // Get ID from path parameter instead of query parameter
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [detail, setDetail] = useState<SearchResult | null>(null);
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useEffect(() => {
    const stored = sessionStorage.getItem("searchResults");
    if (stored && id) {
      const arr = JSON.parse(stored) as SearchResult[];
      const found = arr.find((item) => String(item.id) === String(id));
      const foundIndex = arr.findIndex((item) => String(item.id) === String(id));
      setDetail(found || null);
      setAllResults(arr);
      setCurrentIndex(foundIndex);
    }
  }, [id]);

  if (!detail || !detail.details) return <div>Result not found.</div>;
  const d = detail.details;

  const handleDownloadPDF = () => {
    if (!detail || !detail.details) return;
    
    const d = detail.details;
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Case Information", 105, 20, { align: "center" });
    
    // Add content
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    
    // Property details
    const startY = 40;
    const lineHeight = 10;
    let currentY = startY;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Property Title:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.property_title || "-", 80, currentY);
    currentY += lineHeight;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Survey Plan Number:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.survey_plan_no || d.survey_plan_number || "-", 80, currentY);
    currentY += lineHeight;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Registered Title Number:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.title_no || "-", 80, currentY);
    currentY += lineHeight;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Name of Owner:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.name_of_owner || "-", 80, currentY);
    currentY += lineHeight;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Location/Address:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.property_location || "-", 80, currentY);
    currentY += lineHeight;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Case Status:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : "-", 80, currentY);
    currentY += lineHeight;
    
    pdf.setFont("helvetica", "bold");
    pdf.text("Last Updated:", 20, currentY);
    pdf.setFont("helvetica", "normal");
    pdf.text(formatDate(d.updated_at), 80, currentY);
    
    // Add footer
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on ${new Date().toLocaleString()}`, 105, 280, { align: "center" });
    
    // Save the PDF
    pdf.save(`property-details-${d.title_no || 'report'}.pdf`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header with search result title and download button */}
      <div className="bg-gray-100 p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => router.push('/pages/search-results')} 
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h3 className="text-sm font-medium">Showing search result: {detail.title || d.property_title || 'Computer village abeokuta area GRA Close to Oando filling station Lagos'}</h3>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition"
        >
          Download
        </button>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-8">Case Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-8">
          <div>
            <div className="text-gray-600 text-sm">Property Title (certificate of occupancy)</div>
            <div className="font-bold text-lg">{d.property_title}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Survey plan number</div>
            <div className="font-bold text-lg">{d.survey_plan_no || d.survey_plan_number || '-'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Registered Title number</div>
            <div className="font-bold text-lg">{d.title_no}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Name of Owner of property</div>
            <div className="font-bold text-lg">{d.name_of_owner}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-gray-600 text-sm">Location/Address of Property</div>
            <div className="font-bold text-lg">{d.property_location}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Case Status</div>
            <div className="font-bold text-lg">{d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : '-'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm">Last Updated</div>
            <div className="font-bold text-lg">{formatDate(d.updated_at)}</div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button 
            className="bg-gray-200 text-gray-600 px-6 py-2 rounded-md font-semibold" 
            disabled={currentIndex <= 0}
            onClick={() => {
              if (currentIndex > 0) {
                const prevId = allResults[currentIndex - 1].id;
                router.push(`/search-details/${prevId}`);
              }
            }}
          >
            Previous
          </button>
          <button 
            className="bg-black text-white px-6 py-2 rounded-md font-semibold"
            disabled={currentIndex >= allResults.length - 1}
            onClick={() => {
              if (currentIndex < allResults.length - 1) {
                const nextId = allResults[currentIndex + 1].id;
                router.push(`/search-details/${nextId}`);
              }
            }}
          >
            Next result
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchDetailView;
