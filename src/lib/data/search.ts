// src/lib/data/search.ts
// READ-ONLY: Simulated search service for ERP data.
// This simulates fetching data using SELECT queries only.

export interface SearchResult {
  id: string;
  type: 'client' | 'product' | 'invoice';
  name: string;
  details: string;
}

export const searchERP = async (query: string): Promise<SearchResult[]> => {
  // Simulating SELECT * FROM table WHERE ... LIKE %query%
  console.log(`Executing read-only search query: SELECT for "${query}"`);
  
  // Return mocked results
  const results: SearchResult[] = [
    { id: '1', type: 'client', name: 'Bamba Diop', details: 'Client régulier' },
    { id: '2', type: 'product', name: 'Service Maintenance', details: 'Maintenance informatique' },
    { id: '3', type: 'invoice', name: 'Facture INV-001', details: 'Montant: 50 000 FCFA' },
  ];
  return results.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
};
