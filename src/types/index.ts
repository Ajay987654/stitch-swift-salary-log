
export interface WorkEntry {
  id?: string;
  pieces: number;
  ratePerPiece: number;
  total: number;
  session: 'Morning' | 'Evening';
  createdAt: string;
  date: string; // YYYY-MM-DD format for easy grouping
  userId?: string; // User ID from Supabase Auth
}

export interface DailySummary {
  date: string;
  totalPieces: number;
  totalSalary: number;
  entries: WorkEntry[];
}
