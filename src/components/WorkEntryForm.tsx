
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WorkEntry } from "@/types";
import { format } from "date-fns";
import { SunIcon, MoonIcon } from "lucide-react";

interface WorkEntryFormProps {
  onSave: (entry: WorkEntry) => void;
  userId?: string;
}

export function WorkEntryForm({ onSave, userId }: WorkEntryFormProps) {
  const [pieces, setPieces] = useState<number>(0);
  const [ratePerPiece, setRatePerPiece] = useState<number>(0);
  const [session, setSession] = useState<'Morning' | 'Evening'>('Morning');
  
  const calculateTotal = (): number => {
    return pieces * ratePerPiece;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pieces <= 0 || ratePerPiece <= 0) {
      return;
    }
    
    const now = new Date();
    const entry: WorkEntry = {
      pieces,
      ratePerPiece,
      total: calculateTotal(),
      session,
      createdAt: now.toISOString(),
      date: format(now, 'yyyy-MM-dd'),
      userId
    };
    
    onSave(entry);
    
    // Reset form
    setPieces(0);
    setRatePerPiece(0);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto mb-6 shadow-md">
      <CardHeader className="bg-tailor-purpleLight rounded-t-lg">
        <CardTitle className="text-tailor-text text-xl font-bold text-center">Log Your Work</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="session" className="text-sm font-medium">Session</Label>
              <ToggleGroup 
                type="single" 
                value={session} 
                onValueChange={(value) => value && setSession(value as 'Morning' | 'Evening')}
                className="justify-center gap-4"
              >
                <ToggleGroupItem value="Morning" className="flex items-center gap-1 px-6 py-3 data-[state=on]:bg-tailor-purple data-[state=on]:text-white">
                  <SunIcon className="h-4 w-4" />
                  <span>Morning</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="Evening" className="flex items-center gap-1 px-6 py-3 data-[state=on]:bg-tailor-purple data-[state=on]:text-white">
                  <MoonIcon className="h-4 w-4" />
                  <span>Evening</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pieces" className="text-sm font-medium">Pieces Completed</Label>
              <Input
                id="pieces"
                type="number"
                min="1"
                value={pieces || ''}
                onChange={(e) => setPieces(parseInt(e.target.value) || 0)}
                className="text-lg py-6"
                placeholder="Enter number of pieces"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rate" className="text-sm font-medium">Rate Per Piece (₹)</Label>
              <Input
                id="rate"
                type="number"
                min="0.01"
                step="0.01"
                value={ratePerPiece || ''}
                onChange={(e) => setRatePerPiece(parseFloat(e.target.value) || 0)}
                className="text-lg py-6"
                placeholder="Enter rate per piece"
              />
            </div>
            
            {pieces > 0 && ratePerPiece > 0 && (
              <div className="bg-tailor-purpleLight rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-tailor-text">Total Earnings:</p>
                <p className="text-2xl font-bold text-tailor-purpleDark">₹{calculateTotal().toFixed(2)}</p>
              </div>
            )}
          </div>
          
          <CardFooter className="flex justify-center p-0 pt-6">
            <Button 
              type="submit" 
              size="lg"
              className="w-full bg-tailor-purple hover:bg-tailor-purpleDark text-white font-bold py-6"
              disabled={pieces <= 0 || ratePerPiece <= 0}
            >
              Save Entry
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
