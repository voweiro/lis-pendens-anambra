export interface SearchResultData {
  data: {
    cases: CaseData[];
  };
}

export interface CaseData {
  _id: string;
  propertyTitle?: string;
  propertyOwner?: string;
  state?: string;
  lga?: string;
  // Add other case properties as needed
}
