
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Flag, Trophy, Clock, Award } from "lucide-react";

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    document.title = "Dashboard | MiniCTF";
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const totalChallenges = 1; // We only have 1 challenge
  const solvedChallenges = user?.solvedChallenges.length || 0;
  const completionPercentage = Math.round((solvedChallenges / totalChallenges) * 100);
  
  return (
    <div className="flex flex-col min-h-screen bg-ctf-dark">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold text-white mb-6">Your Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-800 bg-ctf-darker">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-medium">Solved Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{solvedChallenges}/{totalChallenges}</div>
                <Flag className="h-6 w-6 text-ctf-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-ctf-darker">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-medium">Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{completionPercentage}%</div>
                <Trophy className="h-6 w-6 text-ctf-blue" />
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div 
                  className="bg-ctf-blue h-2 rounded-full" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-ctf-darker">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-medium">Points Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-white">{solvedChallenges * 100}</div>
                <Award className="h-6 w-6 text-ctf-blue" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-800 bg-ctf-darker">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-400 text-sm font-medium">Last Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xl font-medium text-white">Now</div>
                <Clock className="h-6 w-6 text-ctf-blue" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-gray-800 bg-ctf-darker">
          <CardHeader>
            <CardTitle className="text-white">Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {solvedChallenges > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-400">
                  <Flag className="h-5 w-5" />
                  <span className="font-medium">You've solved the DFIR challenge!</span>
                </div>
                <p className="text-gray-300">
                  Congratulations on solving the Digital Forensics challenge. 
                  The flag was <code className="bg-black/40 p-1 rounded text-green-400">MED{"{test}"}</code> and you
                  correctly identified it!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <Flag className="h-5 w-5" />
                  <span className="font-medium">You haven't solved any challenges yet.</span>
                </div>
                <p className="text-gray-400">
                  Head over to the challenges page and start solving to earn points!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
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

export default DashboardPage;
