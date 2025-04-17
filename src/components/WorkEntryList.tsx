
import { format, parseISO } from "date-fns";
import { WorkEntry } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SunIcon, MoonIcon } from "lucide-react";

interface WorkEntryListProps {
  entries: WorkEntry[];
}

export function WorkEntryList({ entries }: WorkEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-6 text-tailor-gray">
        <p>No entries yet. Start logging your work!</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="bg-tailor-purpleLight rounded-t-lg">
        <CardTitle className="text-tailor-text text-xl font-bold text-center">Recent Entries</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-tailor-purpleLight">
          {entries.map((entry, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {entry.session === 'Morning' ? 
                    <SunIcon className="h-4 w-4 text-yellow-500" /> : 
                    <MoonIcon className="h-4 w-4 text-blue-500" />
                  }
                  <span className="text-sm font-medium">{entry.session} Session</span>
                </div>
                <span className="text-xs text-tailor-gray">
                  {format(parseISO(entry.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm mb-1">
                <div>
                  <p className="text-tailor-gray">Pieces</p>
                  <p className="font-medium">{entry.pieces}</p>
                </div>
                <div>
                  <p className="text-tailor-gray">Rate</p>
                  <p className="font-medium">₹{entry.ratePerPiece.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-tailor-gray">Earned</p>
                  <p className="font-bold text-tailor-purpleDark">₹{entry.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
