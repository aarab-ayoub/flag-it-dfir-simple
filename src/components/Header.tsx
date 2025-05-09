
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Flag, LogOut, User } from "lucide-react";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  return (
    <header className="border-b border-gray-800 bg-ctf-darker py-3 px-6 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Flag className="h-6 w-6 text-ctf-blue" />
          <span className="font-bold text-xl tracking-tight">MiniCTF</span>
        </Link>
        
        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/challenges" className="text-gray-300 hover:text-ctf-blue transition">
                Challenges
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-gray-300 hover:text-ctf-blue transition">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-ctf-blue" />
                <span className="text-gray-300">{user?.username}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-400 hover:text-ctf-blue"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => navigate("/login")}
              className="bg-ctf-blue hover:bg-ctf-blue/90"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
