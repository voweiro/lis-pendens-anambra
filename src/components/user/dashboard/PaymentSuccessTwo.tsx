interface PaymentSuccessTwoProps {
  setShowPaymentSuccessTwo: (show: boolean) => void;
  setShowDownloadAndEmail: (show: boolean) => void;
}

export const PaymentSuccessTwo = ({
  setShowPaymentSuccessTwo,
  setShowDownloadAndEmail
}: PaymentSuccessTwoProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Payment Successful</h2>
      <div className="mb-4">
        <p>Your payment has been processed successfully!</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setShowPaymentSuccessTwo(false);
            setShowDownloadAndEmail(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Download Record
        </button>
      </div>
    </div>
  );
};
