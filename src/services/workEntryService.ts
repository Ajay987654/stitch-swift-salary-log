
import { WorkEntry, DailySummary } from "@/types";

const STORAGE_KEY = 'tailor_work_entries';

// Temporary local storage implementation until Supabase is connected
export const workEntryService = {
  // Save a new work entry
  saveEntry: async (entry: WorkEntry): Promise<WorkEntry> => {
    const entries = await workEntryService.getAllEntries();
    
    // Generate a simple ID
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    
    const updatedEntries = [...entries, newEntry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    
    return newEntry;
  },
  
  // Get all work entries
  getAllEntries: async (): Promise<WorkEntry[]> => {
    const entriesJson = localStorage.getItem(STORAGE_KEY);
    return entriesJson ? JSON.parse(entriesJson) : [];
  },
  
  // Get entries for a specific date
  getEntriesByDate: async (date: string): Promise<WorkEntry[]> => {
    const entries = await workEntryService.getAllEntries();
    return entries.filter(entry => entry.date === date);
  },
  
  // Get daily summaries for all dates
  getDailySummaries: async (): Promise<DailySummary[]> => {
    const entries = await workEntryService.getAllEntries();
    
    // Group entries by date
    const entriesByDate: Record<string, WorkEntry[]> = {};
    
    entries.forEach(entry => {
      if (!entriesByDate[entry.date]) {
        entriesByDate[entry.date] = [];
      }
      entriesByDate[entry.date].push(entry);
    });
    
    // Create summaries
    const summaries: DailySummary[] = Object.keys(entriesByDate).map(date => {
      const dateEntries = entriesByDate[date];
      const totalPieces = dateEntries.reduce((sum, entry) => sum + entry.pieces, 0);
      const totalSalary = dateEntries.reduce((sum, entry) => sum + entry.total, 0);
      
      return {
        date,
        totalPieces,
        totalSalary,
        entries: dateEntries.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      };
    });
    
    // Sort summaries by date (most recent first)
    return summaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  
  // Get daily summary for a specific date
  getDailySummary: async (date: string): Promise<DailySummary | null> => {
    const entries = await workEntryService.getEntriesByDate(date);
    
    if (entries.length === 0) {
      return null;
    }
    
    const totalPieces = entries.reduce((sum, entry) => sum + entry.pieces, 0);
    const totalSalary = entries.reduce((sum, entry) => sum + entry.total, 0);
    
    return {
      date,
      totalPieces,
      totalSalary,
      entries: entries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    };
  }
};
