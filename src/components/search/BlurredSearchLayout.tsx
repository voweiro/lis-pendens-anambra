interface BlurredSearchLayoutProps {
  setShowBlurredScreen: (show: boolean) => void;
  setShowPaymentDetails: (show: boolean) => void;
  setShowPaymentDetailsThree: (show: boolean) => void;
}

export const BlurredSearchLayout = ({
  setShowBlurredScreen,
  setShowPaymentDetails,
  setShowPaymentDetailsThree
}: BlurredSearchLayoutProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Access Restricted</h2>
      <div className="mb-4">
        <p>Please make a payment to view full case details</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowBlurredScreen(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setShowBlurredScreen(false);
            setShowPaymentDetails(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};
