
import { format, parseISO } from "date-fns";
import { DailySummary as DailySummaryType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, DollarSignIcon, PackageIcon } from "lucide-react";

interface DailySummaryProps {
  summary: DailySummaryType;
}

export function DailySummary({ summary }: DailySummaryProps) {
  const formattedDate = format(parseISO(summary.date), 'EEEE, MMMM d, yyyy');
  
  return (
    <Card className="w-full max-w-md mx-auto mb-6 shadow-md">
      <CardHeader className="bg-tailor-purpleLight rounded-t-lg">
        <div className="flex items-center justify-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <CardTitle className="text-tailor-text text-xl font-bold">{formattedDate}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-tailor-background rounded-lg p-3 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <PackageIcon className="h-4 w-4 text-tailor-purpleDark" />
              <span className="text-sm text-tailor-gray">Total Pieces</span>
            </div>
            <span className="text-2xl font-bold text-tailor-text">{summary.totalPieces}</span>
          </div>
          
          <div className="bg-tailor-background rounded-lg p-3 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <DollarSignIcon className="h-4 w-4 text-tailor-purpleDark" />
              <span className="text-sm text-tailor-gray">Total Earnings</span>
            </div>
            <span className="text-2xl font-bold text-tailor-purple">₹{summary.totalSalary.toFixed(2)}</span>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="mt-3">
          <h4 className="text-sm font-medium text-tailor-gray mb-2">Sessions</h4>
          <div className="space-y-2">
            {summary.entries.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {summary.entries.map((entry, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-tailor-purpleLight flex justify-between">
                    <div>
                      <p className="text-xs text-tailor-gray">{entry.session} Session</p>
                      <p className="text-sm font-medium">{entry.pieces} pieces at ₹{entry.ratePerPiece.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-tailor-gray">{format(parseISO(entry.createdAt), 'h:mm a')}</p>
                      <p className="text-sm font-bold text-tailor-purpleDark">₹{entry.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-tailor-gray">No sessions recorded today</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
