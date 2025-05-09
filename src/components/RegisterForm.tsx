
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Key, User, Mail } from "lucide-react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-gray-800 bg-ctf-darker shadow-lg">
      <CardHeader className="space-y-1 flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-ctf-blue/20 flex items-center justify-center mb-4">
          <User className="h-6 w-6 text-ctf-blue" />
        </div>
        <CardTitle className="text-2xl font-bold text-center text-white">Create an account</CardTitle>
        <CardDescription className="text-center text-gray-400">
          Enter your details to register
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="username"
                placeholder="Username"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-black/20 border-gray-800"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                placeholder="Email"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black/20 border-gray-800"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-black/20 border-gray-800"
                required
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-ctf-blue hover:bg-ctf-blue/90 text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            <span>Already have an account? </span>
            <a 
              onClick={() => navigate("/login")} 
              className="cursor-pointer text-ctf-blue hover:underline"
            >
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
