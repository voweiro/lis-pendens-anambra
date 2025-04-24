import { CaseData } from '@/types';

interface PaymentDetailsThreeProps {
  setShowPaymentDetailsThree: (show: boolean) => void;
  setShowPaymentSuccessThree: (show: boolean) => void;
  caseData: string | null;
  setPaymentResponse: (response: any) => void;
}

export const PaymentDetailsThree = ({
  setShowPaymentDetailsThree,
  setShowPaymentSuccessThree,
  caseData,
  setPaymentResponse
}: PaymentDetailsThreeProps) => {
  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPaymentResponse({ success: true, data: { reference: '54321', userId: 'user123' } });
      setShowPaymentDetailsThree(false);
      setShowPaymentSuccessThree(true);
    }, 1500);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <div className="mb-4">
        <p>Case ID: {caseData}</p>
        <p className="mt-2">Amount: $30.00</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowPaymentDetailsThree(false)}
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
