import { NigeriaStateLGAData } from "@/components/utils/StateData";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

interface SearchFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  isSearching: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  register,
  errors,
  watch,
  isSearching,
}) => {
  const stateList = (stateName: string) => {
    const stateResult = NigeriaStateLGAData.find(
      (state) => state.name === stateName
    );
    return stateResult ? stateResult.lgas : [];
  };

  return (
    <div className="bg-white px-6 py-4 max-w-[480px] rounded-2xl shadow-2xl mb-2 md:mt-4 md:mb-8 lg:px-8 max-h-[80vh] overflow-y-scroll">
      <p className="text-lg md:text-xl font-semibold mb-4">Fill the search form</p>

      <div className="space-y-4">
        {/* Type of Title */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">Type of Title</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("propertyTitle")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* Registered Title Number */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">Registered Title Number</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("registerTitle")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* Plot Number */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">Plot Number</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("plotNumber")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* Street Name */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">Street Name</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("plotStreetName")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* City */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">City/Town</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("city")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* State */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">State</label>
          <select
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("state")}
          >
            <option value="">-Select State-</option>
            {NigeriaStateLGAData.map((state, index) => (
              <option key={index} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* LGA */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">LGA</label>
          <select
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("lga")}
          >
            <option value="">-Select LGA-</option>
            {stateList(watch("state")).map((lga, index) => (
              <option key={index} value={lga.name}>
                {lga.name}
              </option>
            ))}
          </select>
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* Survey Plan Number */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">Survey Plan Number</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("surveyPlanNumber")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>

        {/* Property Owner (Optional) */}
        <div className="mt-4">
          <label className="text-xs md:text-sm">Name of Owner of Property (Optional)</label>
          <input
            type="text"
            className="block h-[1.9rem] w-full px-2 py-1 border border-[#BFBFBF] rounded-[0.3rem] mt-3"
            {...register("propertyOwner")}
          />
          <p className="text-red-500 text-[0.75rem]"></p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          disabled={isSearching}
          className="bg-black text-white shadow-xl font-semibold text-sm px-4 py-2 rounded transition duration-700 hover:bg-white hover:text-black hover:border border-black"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
