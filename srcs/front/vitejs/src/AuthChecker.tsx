import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthChecker = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/status");
                if (!response.ok) {
                    navigate("/login");
                    return ;
                }
            } catch (err) {
                navigate("/login");
                return ;
            }
        };
        checkAuth();
    }, [navigate]);
};

export default useAuthChecker;