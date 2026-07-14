export interface Client {
  id: string;
  code: string;
  nom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  ville?: string;
  type_client?: 'Particulier' | 'Entreprise';
  statut?: 'Actif' | 'Inactif';
  notes?: string;
  created_at: string;
  updated_at?: string;
}
