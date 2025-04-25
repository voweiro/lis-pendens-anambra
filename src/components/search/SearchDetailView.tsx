import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import Image from "next/image";
import stamp from "@/asserts/stamp.png";
import signature from "@/asserts/signature-les.png";

interface SearchResult {
  id: string | number;
  title: string;
  owner: string;
  summary?: string;
  details?: any;
}

const formatDate = (dateStr?: string) => {
  // If no date is provided, use current date
  const date = dateStr ? new Date(dateStr) : new Date();
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
  // Use imported images by default
  const [signatureImage, setSignatureImage] = useState<string | null>(signature.src);
  const [stampImage, setStampImage] = useState<string | null>(stamp.src);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const stampInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("searchResults");
    if (stored && id) {
      try {
        const arr = JSON.parse(stored) as SearchResult[];
        const found = arr.find((item) => String(item.id) === String(id));
        const foundIndex = arr.findIndex((item) => String(item.id) === String(id));
        setDetail(found || null);
        setAllResults(arr);
        setCurrentIndex(foundIndex);
        
        // Debug logging
        console.log("Search results loaded:", arr);
        console.log("Current detail:", found);
        console.log("Current index:", foundIndex);
      } catch (error) {
        console.error("Error parsing search results:", error);
      }
    } else {
      console.log("No search results found in session storage or no ID provided", { stored, id });
    }
  }, [id]);

  // Handle file uploads for signature and stamp
  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignatureImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStampUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStampImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerSignatureUpload = () => {
    signatureInputRef.current?.click();
  };

  const triggerStampUpload = () => {
    stampInputRef.current?.click();
  };

  if (!detail || !detail.details) return <div className="p-8 text-center text-lg font-medium text-gray-600">Result not found. Please try searching again.</div>;
  const d = detail.details;

  const handleDownloadPDF = () => {
    if (!detail || !detail.details) return;
    
    const d = detail.details;
    const pdf = new jsPDF();
    
    // Add header
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("IN THE HIGH COURT OF ENUGU STATE", 105, 20, { align: "center" });
    pdf.setFontSize(12);
    pdf.text("HOLDEN AT ENUGU", 105, 26, { align: "center" });
    pdf.setFontSize(14);
    pdf.text("CERTIFICATE OF LISPENDES", 105, 34, { align: "center" });
    
    // Add content
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "normal");
    
    // Court and case details
    const startY = 44;
    const lineHeight = 6; // Reduced line height
    let currentY = startY;
    
    pdf.text("Court 1", 20, currentY);
    currentY += lineHeight;
    
    pdf.text("Enugu", 20, currentY);
    currentY += lineHeight;
    
    pdf.text("Title Registration No: Land Use Act, 1978", 20, currentY);
    currentY += lineHeight;
    
    // Handle property address with proper text wrapping
    const propertyAddress = `Property Address: ${d.property_location || 'Industrial layout Phase 2 Enugu Enugu North Enugu'}`;
    const addressLines = pdf.splitTextToSize(propertyAddress, 170);
    pdf.text(addressLines, 20, currentY);
    currentY += lineHeight * addressLines.length;
    
    pdf.text(`Name of Title Owner: ${d.name_of_owner || 'Mr. S.I. Okafor'}`, 20, currentY);
    currentY += lineHeight;
    
    pdf.text(`Name of Parties: ${d.name_of_owner || 'Mr. S.I. Okafor'} VS Christian Ogbodo and 2 others`, 20, currentY);
    currentY += lineHeight;
    
    pdf.text(`Suit No: ${d.title_no || 'E/876/20'}`, 20, currentY);
    currentY += lineHeight;
    
    pdf.text(`Status of Case: ${d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'Pending'}`, 20, currentY);
    currentY += lineHeight;
    
    pdf.text("Relief of Sough: Declaration", 20, currentY);
    currentY += lineHeight * 1.5; // Reduced spacing
    
    // To whom it may concern
    pdf.setFont("helvetica", "bold");
    pdf.text("TO WHOM IT MAY CONCERN", 105, currentY, { align: "center" });
    currentY += lineHeight * 1.5; // Reduced spacing
    
    pdf.setFont("helvetica", "normal");
    const concernText = "This certificate of Lis Pendes serves to inform all potential buyers, lenders, and other " +
      "interested parties that the property above is the subject of litigation and any " +
      "transactions involving the property may be subject to the outcome of the pending " +
      "litigation. Transactions or dealings with the property should be conducted with full " +
      "awareness of the ongoing litigation.";
    
    // Split text to fit page width
    const textLines = pdf.splitTextToSize(concernText, 170);
    pdf.text(textLines, 20, currentY);
    currentY += lineHeight * (textLines.length + 0.5); // Reduced spacing
    
    // Use current date when generating PDF
    const currentDate = formatDate();
    pdf.text(`Search Date: ${currentDate}`, 20, currentY);
    currentY += lineHeight * 2; // Reduced spacing
    
    // Signature section
    pdf.text("Signature:", 20, currentY);
    currentY += lineHeight * 1.5; // Reduced spacing
    
    // Always add signature image (using imported image by default)
    try {
      // Use the imported signature image or user uploaded one
      pdf.addImage(signatureImage || signature.src, 'PNG', 20, currentY, 40, 20);
      currentY += lineHeight * 4;
    } catch (error) {
      console.error("Error adding signature image to PDF:", error);
      currentY += lineHeight * 2;
    }
    
    pdf.text("Nkiru Noble", 20, currentY);
    currentY += lineHeight;
    
    pdf.text("ACR Litigation", 20, currentY);
    currentY += lineHeight * 1.5; // Reduced spacing
    
    // Always add stamp image (using imported image by default)
    try {
      // Use the imported stamp image or user uploaded one - position it higher up alongside the signature
      pdf.addImage(stampImage || stamp.src, 'PNG', 140, currentY - 40, 30, 30);
    } catch (error) {
      console.error("Error adding stamp image to PDF:", error);
    }
    
    currentY += lineHeight * 1.5; // Reduced spacing
    
    // Footer text
    const footerText = "For any further information or clarification, please contact the court at Court 1 Enugu. " +
      "This certificate is issued in accordance with the legal requirements and serves as a public " +
      "notice of the ongoing litigation affecting the described property as the search date. This notice " +
      "is for informational purposes only and does not constitute legal advice.";
    
    const footerLines = pdf.splitTextToSize(footerText, 170);
    pdf.text(footerLines, 20, currentY);
    
    // Save the PDF
    pdf.save(`certificate-of-lispendes-${d.title_no || 'report'}.pdf`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header with back button and download button */}
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
        <div className="text-center">
          <h2 className="text-xl font-bold uppercase">IN THE HIGH COURT OF ENUGU STATE</h2>
          <h3 className="text-lg font-medium uppercase mb-1">HOLDEN AT ENUGU</h3>
          <h3 className="text-xl font-bold uppercase mb-4">CERTIFICATE OF LISPENDES</h3>

        <div className="text-left mb-4">
          <div className="mb-1">
            <div>Court 1</div>
            <div>Enugu</div>
          </div>
          <div className="mb-1">
            <div>Title Registration No: Land Use Act, 1978</div>
          </div>
          <div className="mb-1">
            <div>Property Address: {d.property_location || 'Industrial layout Phase 2 Enugu Enugu North Enugu'}</div>
          </div>
          <div className="mb-1">
            <div>Name of Title Owner: {d.name_of_owner || 'Mr. S.I. Okafor'}</div>
          </div>
          <div className="mb-1">
            <div>Name of Parties: {d.name_of_owner || 'Mr. S.I. Okafor'} VS Christian Ogbodo and 2 others</div>
          </div>
          <div className="mb-1">
            <div>Suit No: {d.title_no || 'E/876/20'}</div>
          </div>
          <div className="mb-1">
            <div>Status of Case: {d.status ? d.status.charAt(0).toUpperCase() + d.status.slice(1) : 'Pending'}</div>
          </div>
          <div className="mb-1">
            <div>Relief of Sough: Declaration</div>
          </div>
        </div>
        
        <div className="text-center mt-3 mb-3">
          <h2 className="font-bold text-lg mb-2">TO WHOM IT MAY CONCERN</h2>

          <p className="text-sm text-left mb-2"> 
            This certificate of Lis Pendes serves to inform all potential buyers, lenders, and other
            interested parties that the property above is the subject of litigation and any
            transactions involving the property may be subject to the outcome of the pending
            litigation. Transactions or dealings with the property should be conducted with full
            awareness of the ongoing litigation.
          </p>
          <p className="text-sm text-left mb-3">Search Date: {formatDate()}</p>
          
          {/* Signature and stamp section */}
          <div className="flex flex-col items-center mt-4 mb-4">
            <div className="text-left w-full mb-3">
              <p className="font-bold mb-1">Signature:</p>
              {/* Hidden file input for signature */}
              <input 
                type="file" 
                ref={signatureInputRef} 
                onChange={handleSignatureUpload} 
                accept="image/*" 
                className="hidden" 
              />
              {/* Clickable area to upload signature */}
              <div 
                onClick={triggerSignatureUpload}
                className="h-16 w-40 border border-dashed border-gray-300 mb-2 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Image 
                  src={signatureImage || signature} 
                  alt="Signature" 
                  width={160} 
                  height={64} 
                  className="object-contain h-full w-full"
                />
              </div>
              <p>Nkiru Noble</p>
              <p>ACR Litigation</p>
            </div>
            
            {/* Hidden file input for stamp */}
            <input 
              type="file" 
              ref={stampInputRef} 
              onChange={handleStampUpload} 
              accept="image/*" 
              className="hidden" 
            />
            {/* Clickable area to upload stamp */}
            <div 
              onClick={triggerStampUpload}
              className="h-20 w-20 border border-dashed border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Image 
                src={stampImage || stamp} 
                alt="Stamp" 
                width={80} 
                height={80} 
                className="object-contain h-full w-full rounded-full"
              />
            </div>
          </div>

          <p className="text-sm text-left mt-6">
            For any further information or clarification, please contact the court at Court 1 Enugu.
            This certificate is issued in accordance with the legal requirements and serves as a public
            notice of the ongoing litigation affecting the described property as the search date. This notice
            is for informational purposes only and does not constitute legal advice.
          </p>
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
