import { SearchResultData } from '@/types';

interface PaymentSuccessThreeProps {
  showSearchResultData: SearchResultData;
  setShowPaymentSuccessThree: (show: boolean) => void;
  setShowCaseInformation: (show: boolean) => void;
  setShowSearchResultThree: (show: boolean) => void;
}

export const PaymentSuccessThree = ({
  showSearchResultData,
  setShowPaymentSuccessThree,
  setShowCaseInformation,
  setShowSearchResultThree
}: PaymentSuccessThreeProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Successful</h2>
      <div className="mb-4">
        <p>Your payment has been processed successfully!</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowPaymentSuccessThree(false);
            setShowCaseInformation(true);
            setShowSearchResultThree(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
