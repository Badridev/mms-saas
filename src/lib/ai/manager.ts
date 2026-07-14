// src/lib/ai/manager.ts
// READ-ONLY: This service is strictly restricted to SELECT operations for data analysis.
// NO WRITE OPERATIONS (INSERT, UPDATE, DELETE) ARE PERMITTED.

import { getDashboardMetrics } from "@/lib/data/dashboard";
import { searchERP, type SearchResult } from "@/lib/data/search";
import { getPageContext } from "@/lib/data/context";

export interface AIAnalysisResult {
  summary: string;
  data: any;
  recommendations?: string[];
}

/**
 * AIManager handles analytical queries against the ERP data.
 * All operations MUST be read-only (SELECT).
 */
export const AIManager = {
  // Analyzes dashboard metrics in read-only mode
  async analyzeDashboard(period: 'day' | 'week' | 'month'): Promise<AIAnalysisResult> {
    const metrics = await getDashboardMetrics(period);
    
    return {
      summary: `Voici le résumé pour la période : ${period}.`,
      data: metrics,
      recommendations: [
        "Ventes totales : " + metrics.totalSales.toLocaleString() + " FCFA",
        "Bénéfice : " + metrics.totalProfit.toLocaleString() + " FCFA"
      ],
    };
  },

  // Performs read-only search across ERP data
  async searchData(query: string): Promise<AIAnalysisResult> {
    const results = await searchERP(query);
    
    return {
      summary: `Résultats de recherche pour : "${query}"`,
      data: results,
      recommendations: results.length > 0 
        ? results.map(r => `${r.type.toUpperCase()}: ${r.name} - ${r.details}`)
        : ["Aucun résultat trouvé."],
    };
  },

  // Performs read-only analysis of page context
  async analyzePageContext(page: string): Promise<AIAnalysisResult> {
    const context = await getPageContext(page);
    
    return {
      summary: `Analyse de la page : ${context.title}`,
      data: context,
      recommendations: [
        context.description,
        ...context.keyInsights
      ],
    };
  },
};
