import { CaseData } from '@/types';

interface CaseInformationProps {
  selectedCaseData: CaseData | null;
  setShowDownloadAndEmail: (show: boolean) => void;
  setShowBlurredScreenTwo: (show: boolean) => void;
  setShowCaseInformation: (show: boolean) => void;
  setShowSearchResultTwo: (show: boolean) => void;
}

export const CaseInformation = ({
  selectedCaseData,
  setShowDownloadAndEmail,
  setShowBlurredScreenTwo,
  setShowCaseInformation,
  setShowSearchResultTwo
}: CaseInformationProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Case Information</h2>
      <div className="mb-4">
        <pre>{JSON.stringify(selectedCaseData, null, 2)}</pre>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowCaseInformation(false);
            setShowSearchResultTwo(true);
          }}
          className="px-4 py-2 border rounded"
        >
          Back
        </button>
        <button
          onClick={() => {
            setShowCaseInformation(false);
            setShowBlurredScreenTwo(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download
        </button>
      </div>
    </div>
  );
};
