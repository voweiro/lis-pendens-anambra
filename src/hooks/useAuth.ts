"use client";
import { useContext } from "react";
import { AuthContext, AuthType } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

interface AuthHook {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
  logout: () => void;
}

const useAuth = (): AuthHook => {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { auth, setAuth } = context;

  const logout = () => {
    // Clear auth state
    setAuth({ role: null, accessToken: null });
    
    // Clear all storage
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("user_id");
    localStorage.removeItem("user");
    localStorage.removeItem("session_id");
    
    // Redirect to signin page
    router.push("/pages/signin");
  };

  return { auth, setAuth, logout };
};

export default useAuth;
