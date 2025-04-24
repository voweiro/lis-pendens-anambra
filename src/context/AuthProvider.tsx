"use client"

import { createContext, useEffect, useState, ReactNode } from "react";

export interface AuthType {
  role: string | null;
  accessToken: string | null;
  email?: string;
  firstName?: string;
}

interface AuthContextType {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
}

// ✅ Provide correct initial value for context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthType>(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = sessionStorage.getItem("auth");
      return storedAuth ? JSON.parse(storedAuth) : { role: null, accessToken: null };
    }
    return { role: null, accessToken: null };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
