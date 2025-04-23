import { useContext } from "react";
import { AuthContext, AuthType } from "@/context/AuthProvider";

interface AuthHook {
  auth: AuthType;
  setAuth: React.Dispatch<React.SetStateAction<AuthType>>;
  logout: () => void;
}

const useAuth = (): AuthHook => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { auth, setAuth } = context;

  const logout = () => {
    setAuth({ role: null, accessToken: null });
    sessionStorage.removeItem("auth");
  };

  return { auth, setAuth, logout };
};

export default useAuth;
