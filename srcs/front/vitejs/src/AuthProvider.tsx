
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import WebSocketComponent from "./pages/Auth/WebSocketComponent";

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
        // const json = await response.json()
        // if (json.error == "1020") {
        //     navigate("/2fa-check")
        // }
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
        fetch("/api/auth/logout", { method: "DELETE" });
        setIsAuthenticated(false);
        navigate("/login");
    };

    const location = useLocation()


    const checkAuthStatus = async () => {
      const logoutPages = [
        "/register",
        "/login",
        "/login?oauth=true",
        "/forgot-password",
        "/forgot-password/new-password",
      ]
      try {
        const response = await fetch("/api/auth/status", { method: "GET" });
        if (!response.ok) {
          setIsAuthenticated(false);
          const data = await response.json()
          console.log(data)
          if (data.error == "1020") {
            navigate("/2fa-check");
            return ;
          }
        
          if (!logoutPages.includes(location.pathname))
              navigate("/login");
        }
        else {
          setIsAuthenticated(true);
          if (logoutPages.includes(location.pathname))
            navigate("/");
        }
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/login");
      }
    };

    useEffect(() => {
      checkAuthStatus();
    }, [navigate]);


    useEffect(() => {
      checkAuthStatus();
    }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, fetchWithAuth, setLogged }}>
      {isAuthenticated ? <WebSocketComponent>
        {children}
      </WebSocketComponent>
      :
      children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
