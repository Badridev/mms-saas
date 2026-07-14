// src/lib/data/context.ts
// READ-ONLY: Simulated service for page context retrieval.
// This simulates fetching page metadata using SELECT queries only.

export interface PageContext {
  title: string;
  description: string;
  keyInsights: string[];
}

export const getPageContext = async (page: string): Promise<PageContext> => {
  // Simulating SELECT * FROM page_metadata WHERE name = ...
  console.log(`Executing read-only query: SELECT context for page "${page}"`);
  
  const contexts: Record<string, PageContext> = {
    'ventes': {
      title: 'Gestion des Ventes',
      description: 'Vue d\'ensemble des transactions clients.',
      keyInsights: ['Moyenne de vente: 25 000 FCFA', 'Top client: Bamba Diop']
    },
    'dashboard': {
      title: 'Tableau de Bord',
      description: 'Indicateurs clés de performance.',
      keyInsights: ['Croissance: +15% vs mois dernier', 'Objectifs atteints à 80%']
    }
  };
  
  return contexts[page] || { title: 'Inconnu', description: 'Pas de contexte.', keyInsights: [] };
};
