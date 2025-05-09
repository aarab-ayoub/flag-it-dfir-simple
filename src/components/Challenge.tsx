
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Flag, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
}

export default function Challenge({ id, title, description, points, category }: ChallengeCardProps) {
  const [flag, setFlag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, solveChallengeFlag } = useAuth();
  const { toast } = useToast();

  const isSolved = user?.solvedChallenges.includes(id);

  const handleSubmitFlag = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Check if flag is correct
    setTimeout(() => {
      const correctFlag = "MED{test}";
      
      if (flag === correctFlag) {
        // Mark as solved
        solveChallengeFlag(id);
      } else {
        toast({
          title: "Incorrect Flag",
          description: "The flag you submitted is not correct. Try again!",
          variant: "destructive"
        });
      }
      
      setIsSubmitting(false);
      setFlag("");
    }, 800); // Simulate network delay
  };

  return (
    <Card className={`challenge-card border-gray-800 bg-ctf-darker ${isSolved ? 'border-green-500/50' : ''}`}>
      {isSolved && (
        <div className="solved-badge">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3" />
            <span>Solved</span>
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
          <Badge className="bg-ctf-blue text-white">{points} pts</Badge>
        </div>
        <Badge variant="outline" className="w-fit text-gray-400 border-gray-700">
          {category}
        </Badge>
        <CardDescription className="text-gray-400 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="terminal-text bg-black/40 p-4 rounded-md border border-gray-800 text-green-400 text-sm">
        <p className="mb-2">$ ls -la evidence/</p>
        <p>drwxr-xr-x 2 root root 4096 May 9 08:14 .</p>
        <p>drwxr-xr-x 3 root root 4096 May 9 08:12 ..</p>
        <p>-rw-r--r-- 1 root root 2048 May 9 08:13 memory.dump</p>
        <p>-rw-r--r-- 1 root root 1024 May 9 08:13 network.pcap</p>
        <p>-rw-r--r-- 1 root root 3072 May 9 08:14 system.log</p>
        <p className="mb-2">$ cat system.log | grep 'suspicious'</p>
        <p className="text-yellow-400">Hint: The flag format is MED{"{something}"}...</p>
      </CardContent>
      
      <CardFooter className="pt-4">
        {!isSolved ? (
          <form onSubmit={handleSubmitFlag} className="w-full space-y-2">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Flag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input 
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="Enter flag (e.g., CTF{flag})"
                  className="pl-10 bg-black/20 border-gray-800"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="bg-ctf-blue hover:bg-ctf-blue/90"
                disabled={isSubmitting || !flag}
              >
                {isSubmitting ? "Checking..." : "Submit"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex w-full items-center justify-center p-2 bg-green-900/20 rounded-md">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-500 font-medium">Challenge completed!</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
