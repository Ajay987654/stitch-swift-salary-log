
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WorkEntryForm } from "@/components/WorkEntryForm";
import { WorkEntryList } from "@/components/WorkEntryList";
import { DailySummary } from "@/components/DailySummary";
import { WorkEntry, DailySummary as DailySummaryType } from "@/types";
import { workEntryService } from "@/services/workEntryService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListIcon, BarChartIcon } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("log");
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [summaries, setSummaries] = useState<DailySummaryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Get today's date in YYYY-MM-DD format
      const today = format(new Date(), 'yyyy-MM-dd');
      
      // Get today's entries
      const todayEntries = await workEntryService.getEntriesByDate(today);
      setEntries(todayEntries);
      
      // Get all daily summaries
      const allSummaries = await workEntryService.getDailySummaries();
      setSummaries(allSummaries);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Handle saving a new work entry
  const handleSaveEntry = async (entry: WorkEntry) => {
    try {
      await workEntryService.saveEntry(entry);
      // Reload data to reflect changes
      loadData();
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-tailor-background pb-10">
      <header className="bg-tailor-purple text-white py-4 shadow-md mb-6">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl font-bold text-center">Tailor Work Tracker</h1>
        </div>
      </header>
      
      <main className="container px-4 mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md mx-auto">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="log" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              <span>Log Work</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              <span>Summary</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="log" className="space-y-6">
            <WorkEntryForm onSave={handleSaveEntry} />
            <WorkEntryList entries={entries} />
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tailor-purple"></div>
              </div>
            ) : summaries.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-6 pr-4">
                  {summaries.map((summary, index) => (
                    <DailySummary key={index} summary={summary} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-10 text-tailor-gray">
                <p>No work entries logged yet.</p>
                <Button 
                  onClick={() => setActiveTab("log")} 
                  variant="outline" 
                  className="mt-4 border-tailor-purple text-tailor-purple hover:bg-tailor-purpleLight"
                >
                  Start Logging
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
