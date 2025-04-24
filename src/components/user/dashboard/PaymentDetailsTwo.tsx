import { CaseData } from '@/types';

interface PaymentDetailsTwoProps {
  setShowPaymentDetailsTwo: (show: boolean) => void;
  setShowPaymentSuccessTwo: (show: boolean) => void;
  selectedCaseData: CaseData | null;
  setPaymentResponseTwo: (response: any) => void;
}

export const PaymentDetailsTwo = ({
  setShowPaymentDetailsTwo,
  setShowPaymentSuccessTwo,
  selectedCaseData,
  setPaymentResponseTwo
}: PaymentDetailsTwoProps) => {
  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentResponseTwo({ success: true, data: { reference: '67890', userId: 'user123' } });
      setShowPaymentDetailsTwo(false);
      setShowPaymentSuccessTwo(true);
    }, 1500);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <div className="mb-4">
        <p>Case ID: {selectedCaseData?._id}</p>
        <p className="mt-2">Amount: $20.00</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowPaymentDetailsTwo(false)}
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
