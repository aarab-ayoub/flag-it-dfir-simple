
import { Navigate } from "react-router-dom";
import RegisterForm from "@/components/RegisterForm";
import { useAuth } from "@/contexts/AuthContext";
import { Flag } from "lucide-react";

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ctf-dark p-6">
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-8">
          <Flag className="h-8 w-8 text-ctf-blue" />
          <h1 className="text-3xl font-bold text-white">MiniCTF</h1>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
