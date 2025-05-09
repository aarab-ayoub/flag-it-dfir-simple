
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Challenge from "@/components/Challenge";
import { useAuth } from "@/contexts/AuthContext";

const ChallengesPage = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    document.title = "Challenges | MiniCTF";
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-ctf-dark">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Challenges</h1>
          <p className="text-gray-400">Solve the challenges and submit the flags to earn points.</p>
        </div>
        
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-ctf-blue rounded-full"></span>
            DFIR (Digital Forensics & Incident Response)
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            <Challenge
              id="dfir-1"
              title="System Compromise Analysis"
              description="A system has been compromised. Analyze the provided logs and memory dump to identify how the attacker gained access and what they were after."
              points={100}
              category="DFIR"
            />
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t border-gray-800 bg-ctf-darker">
        <div className="container mx-auto">
          <p className="text-center text-gray-500 text-sm">
            © 2025 MiniCTF Platform — Simplified DFIR challenges
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChallengesPage;
