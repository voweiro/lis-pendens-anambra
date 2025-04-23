// src/context/MyContext.tsx
"use client"; // This is a client component

import React, { createContext, useContext, ReactNode, useState } from "react";

// Define the shape of your context
interface MyContextType {
  basename: string;
  setBasename: (basename: string) => void;
}

// Create a context with default values (optional)
const MyContext = createContext<MyContextType | undefined>(undefined);

// Create a provider component
export const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const [basename, setBasename] = useState<string>("");

  return (
    <MyContext.Provider value={{ basename, setBasename }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useMyContext = (): MyContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
