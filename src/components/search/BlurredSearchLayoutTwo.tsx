interface BlurredSearchLayoutTwoProps {
  setShowBlurredScreenTwo: (show: boolean) => void;
  setShowPaymentDetailsTwo: (show: boolean) => void;
}

export const BlurredSearchLayoutTwo = ({
  setShowBlurredScreenTwo,
  setShowPaymentDetailsTwo
}: BlurredSearchLayoutTwoProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upgrade Required</h2>
      <div className="mb-4">
        <p>Please upgrade your account to access these features</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowBlurredScreenTwo(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            setShowBlurredScreenTwo(false);
            setShowPaymentDetailsTwo(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};
