export type LGA = {
    id: number;
    name: string;
  };
  
  export type NigeriaState = {
    name: string;
    lgas: LGA[];
  };
  
  export const NigeriaStateLGAData: NigeriaState[] = [
    {
      name: "Enugu",
      lgas: [
        { id: 1, name: "Aninri" },
        { id: 2, name: "Awgu" },
        { id: 3, name: "Enugu East" },
        { id: 4, name: "Enugu North" },
        { id: 5, name: "Enugu South" },
        { id: 6, name: "Ezeagu" },
        { id: 7, name: "Igbo Etiti" },
        { id: 8, name: "Igbo Eze North" },
        { id: 9, name: "Igbo Eze South" },
        { id: 10, name: "Isi Uzo" },
        { id: 11, name: "Nkanu East" },
        { id: 12, name: "Nkanu West" },
        { id: 13, name: "Nsukka" },
        { id: 14, name: "Oji River" },
        { id: 15, name: "Udenu" },
        { id: 16, name: "Udi" },
        { id: 17, name: "Uzouwani" },
      ],
    },
    // You can add more states here like this:
    // {
    //   name: "Lagos",
    //   lgas: [ { id: 1, name: "Ikeja" }, { id: 2, name: "Surulere" }, ... ]
    // }
  ];
  