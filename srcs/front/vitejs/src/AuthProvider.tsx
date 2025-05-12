import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
  setLogged: ()=> void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const fetchWithAuth = async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (response.status === 401) {
      navigate("/login");
    }
    const json = await response.json()
    if (json.error == "1020") {
      navigate("/2fa-check")
    }
    return (response);
  };

  const setLogged = () => {
    setIsAuthenticated(true)
  }

  const login = async (email: string, password: string) => {
    const requestData = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch("/api/auth/login", requestData);
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error || "0500");
    }
    if (json.need2fa) {
      navigate("/2fa-check");
      return ;
    }

    setIsAuthenticated(true);
    navigate("/");
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" });
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, fetchWithAuth, setLogged }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


export const checkAuth = () {
  
}

export const AuthChecker = ()=> {
  const verify = async () => {
    const check = await 
  }
}