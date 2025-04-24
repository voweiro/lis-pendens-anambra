import { CaseData } from '@/types';

interface PaymentDetailsProps {
  setShowPaymentDetails: (show: boolean) => void;
  setShowPaymentSuccess: (show: boolean) => void;
  selectedCaseData: CaseData | null;
  setPaymentResponse: (response: any) => void;
}

export const PaymentDetails = ({
  setShowPaymentDetails,
  setShowPaymentSuccess,
  selectedCaseData,
  setPaymentResponse
}: PaymentDetailsProps) => {
  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentResponse({ success: true, data: { reference: '12345', userId: 'user123' } });
      setShowPaymentDetails(false);
      setShowPaymentSuccess(true);
    }, 1500);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <div className="mb-4">
        <p>Case ID: {selectedCaseData?._id}</p>
        <p className="mt-2">Amount: $10.00</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowPaymentDetails(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};
