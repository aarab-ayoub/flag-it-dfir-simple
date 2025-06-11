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
      const correctFlag = "MED{Metadata_Expert_File_Carving_Pro_PDF_Expert_123}";
      
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
          <CardTitle className="text-xl font-bold text-white">
            The Ransomware Incident
          </CardTitle>
          <Badge className="bg-ctf-blue text-white">{points} pts</Badge>
        </div>
        <Badge variant="outline" className="w-fit text-gray-400 border-gray-700">
          {category}
        </Badge>
        <CardDescription className="text-gray-400 mt-2">
          A small business employee accidentally ran a ransomware executable (<span className="font-mono">malware.exe</span>). Critical files were encrypted, but the attacker left behind traces. As a DFIR (Digital Forensics &amp; Incident Response) team, you must analyze the disk, recover the encrypted files, and find the hidden flag (split into 3 parts).
          <div className="mt-2">
            <a 
              href="https://www.mediafire.com/file/cjjbto69pzvga3w/ransomware_ctf_disk.img/file" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-ctf-blue hover:underline flex items-center gap-1"
            >
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Disk Image
            </a>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="terminal-text bg-black/40 p-4 rounded-md border border-gray-800 text-green-400 text-sm">
        <p className="mb-2">$ ls -la disk/</p>
        <p>drwxr-xr-x 3 user user 4096 May 10 09:00 .</p>
        <p>drwxr-xr-x 5 user user 4096 May 10 08:59 ..</p>
        <p>-rw-r--r-- 1 user user 8192 May 10 09:01 malware.exe</p>
        <p>-rw-r--r-- 1 user user 4096 May 10 09:02 important.docx.encrypted</p>
        <p>-rw-r--r-- 1 user user 4096 May 10 09:02 finances.xlsx.encrypted</p>
        <p>-rw-r--r-- 1 user user 2048 May 10 09:03 ransom_note.txt</p>
        <p className="mb-2">$ cat ransom_note.txt</p>
        <p className="text-red-400">Your files have been encrypted! Find the key to recover them.</p>
        <p className="mb-2">$ strings malware.exe | grep FLAG</p>
        <p className="text-yellow-400">Hint: The flag is split into 3 parts. Format: MED&#123;part1_part2_part3&#125;</p>
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
