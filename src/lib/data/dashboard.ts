// src/lib/data/dashboard.ts
// READ-ONLY: Simulated data service for dashboard metrics.
// This simulates fetching data from the database using SELECT queries only.

export interface DashboardMetrics {
  totalSales: number;
  totalProfit: number;
  salesCount: number;
  date: string;
}

export const getDashboardMetrics = async (period: 'day' | 'week' | 'month'): Promise<DashboardMetrics> => {
  // Simulating SELECT * FROM dashboard_metrics WHERE ...
  console.log(`Executing read-only query: SELECT metrics for ${period}`);
  
  return {
    totalSales: 1500000, // Example data
    totalProfit: 450000,
    salesCount: 42,
    date: new Date().toLocaleDateString('fr-FR')
  };
};
