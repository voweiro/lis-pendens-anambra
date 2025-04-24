import { SearchResultData } from '@/types';

interface PaymentSuccessProps {
  showSearchResultData: SearchResultData;
  setShowPaymentSuccess: (show: boolean) => void;
  setShowCaseInformation: (show: boolean) => void;
  setShowSearchResultTwo: (show: boolean) => void;
}

export const PaymentSuccess = ({
  showSearchResultData,
  setShowPaymentSuccess,
  setShowCaseInformation,
  setShowSearchResultTwo
}: PaymentSuccessProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Successful</h2>
      <div className="mb-4">
        <p>Your payment has been processed successfully!</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowPaymentSuccess(false);
            setShowCaseInformation(true);
            setShowSearchResultTwo(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
