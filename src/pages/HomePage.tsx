
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Flag } from "lucide-react";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-ctf-dark">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container mx-auto text-center max-w-3xl">
            <div className="mb-8 flex justify-center">
              <div className="h-24 w-24 rounded-full bg-ctf-blue/20 flex items-center justify-center">
                <Flag className="h-12 w-12 text-ctf-blue glow-effect" />
              </div>
            </div>
            
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-white">
              Welcome to <span className="text-ctf-blue">MiniCTF</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              A simple platform to test your Digital Forensics and Incident Response skills. 
              Solve challenges, capture flags, and improve your cybersecurity knowledge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate("/challenges")} 
                  className="bg-ctf-blue hover:bg-ctf-blue/90 text-white px-8 py-6 text-lg"
                >
                  View Challenges
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate("/login")} 
                    className="bg-ctf-blue hover:bg-ctf-blue/90 text-white px-8 py-6 text-lg"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate("/register")} 
                    variant="outline" 
                    className="border-ctf-blue text-ctf-blue hover:bg-ctf-blue/10 px-8 py-6 text-lg"
                  >
                    Create Account
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16 px-6 bg-ctf-darker">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-ctf-dark p-6 rounded-lg border border-gray-800">
                <div className="h-12 w-12 rounded-full bg-ctf-blue/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-ctf-blue">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Create an Account</h3>
                <p className="text-gray-400">
                  Register to access challenges and track your progress.
                </p>
              </div>
              
              <div className="bg-ctf-dark p-6 rounded-lg border border-gray-800">
                <div className="h-12 w-12 rounded-full bg-ctf-blue/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-ctf-blue">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Solve Challenges</h3>
                <p className="text-gray-400">
                  Analyze the provided evidence to discover hidden flags.
                </p>
              </div>
              
              <div className="bg-ctf-dark p-6 rounded-lg border border-gray-800">
                <div className="h-12 w-12 rounded-full bg-ctf-blue/20 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-ctf-blue">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Submit Flags</h3>
                <p className="text-gray-400">
                  Submit the found flags to earn points and track your progress.
                </p>
              </div>
            </div>
          </div>
        </section>
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

export default HomePage;
