
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin");
      } else if (user?.role === "student") {
        navigate("/student");
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Redirigiendo...</h2>
        <p className="mt-2">Por favor, espere un momento.</p>
      </div>
    </div>
  );
};

export default Index;
