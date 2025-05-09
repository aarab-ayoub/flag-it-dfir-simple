
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  solvedChallenges: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  solveChallengeFlag: (challengeId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('ctf_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      // In a real app, you would call your backend here
      
      if (email && password) {
        // For demo, just create a user if credentials are provided
        // Hard-coded users for demo
        if (email === "user@example.com" && password === "password") {
          const user: User = {
            id: "1",
            username: "testuser",
            email: "user@example.com",
            solvedChallenges: []
          };
          
          setUser(user);
          localStorage.setItem('ctf_user', JSON.stringify(user));
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
        } else {
          throw new Error("Invalid credentials");
        }
      } else {
        throw new Error("Please provide email and password");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulate API call
      if (username && email && password) {
        const newUser: User = {
          id: Math.random().toString(36).substring(2),
          username,
          email,
          solvedChallenges: []
        };
        
        setUser(newUser);
        localStorage.setItem('ctf_user', JSON.stringify(newUser));
        
        toast({
          title: "Registration successful",
          description: "Your account has been created.",
        });
      } else {
        throw new Error("Please provide all required fields");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ctf_user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const solveChallengeFlag = (challengeId: string) => {
    if (user) {
      // Update user's solved challenges
      const updatedUser = {
        ...user,
        solvedChallenges: [...user.solvedChallenges, challengeId]
      };
      
      setUser(updatedUser);
      localStorage.setItem('ctf_user', JSON.stringify(updatedUser));
      
      toast({
        title: "Challenge Solved!",
        description: "Congratulations! You've solved the challenge.",
      });
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    solveChallengeFlag
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
