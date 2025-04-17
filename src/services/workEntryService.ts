
import { WorkEntry, DailySummary } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Service to handle work entries using Supabase
export const workEntryService = {
  // Save a new work entry
  saveEntry: async (entry: WorkEntry): Promise<WorkEntry> => {
    // Map our app's WorkEntry to the Supabase table structure
    const supabaseEntry = {
      pieces: entry.pieces,
      rate: entry.ratePerPiece,
      total: entry.total,
      session: entry.session.toLowerCase(),
      timestamp: entry.createdAt,
      user_id: entry.userId
    };
    
    const { data, error } = await supabase
      .from('work_entries')
      .insert(supabaseEntry)
      .select()
      .single();
    
    if (error) {
      console.error("Error saving entry:", error);
      throw error;
    }
    
    // Map back to our app's WorkEntry format
    return {
      id: data.id.toString(),
      pieces: data.pieces,
      ratePerPiece: data.rate,
      total: data.total,
      session: data.session.charAt(0).toUpperCase() + data.session.slice(1) as 'Morning' | 'Evening',
      createdAt: data.timestamp,
      date: new Date(data.timestamp).toISOString().split('T')[0],
      userId: data.user_id
    };
  },
  
  // Get all work entries for the current user
  getAllEntries: async (): Promise<WorkEntry[]> => {
    const { data, error } = await supabase
      .from('work_entries')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error("Error getting entries:", error);
      throw error;
    }
    
    // Map Supabase entries to our app's WorkEntry format
    return data.map(entry => ({
      id: entry.id.toString(),
      pieces: entry.pieces,
      ratePerPiece: entry.rate,
      total: entry.total,
      session: entry.session.charAt(0).toUpperCase() + entry.session.slice(1) as 'Morning' | 'Evening',
      createdAt: entry.timestamp,
      date: new Date(entry.timestamp).toISOString().split('T')[0],
      userId: entry.user_id
    }));
  },
  
  // Get entries for a specific date
  getEntriesByDate: async (date: string): Promise<WorkEntry[]> => {
    // For Supabase, we need to use the timestamp field with a date range
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Add one day to get the range
    
    const { data, error } = await supabase
      .from('work_entries')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .lt('timestamp', endDate.toISOString())
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error("Error getting entries by date:", error);
      throw error;
    }
    
    // Map Supabase entries to our app's WorkEntry format
    return data.map(entry => ({
      id: entry.id.toString(),
      pieces: entry.pieces,
      ratePerPiece: entry.rate,
      total: entry.total,
      session: entry.session.charAt(0).toUpperCase() + entry.session.slice(1) as 'Morning' | 'Evening',
      createdAt: entry.timestamp,
      date: new Date(entry.timestamp).toISOString().split('T')[0],
      userId: entry.user_id
    }));
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
