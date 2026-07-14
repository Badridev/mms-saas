import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useClients, useCreateClient, useDeleteClient, useUpdateClient } from '../lib/data/clients';
import { Button } from '../components/ui/button';
import { ClientForm } from '../components/mms/ClientForm';
import { Client } from '../lib/types/client';
import { toast } from 'sonner';
import { StatsCards } from '../components/mms/clients/StatsCards';
import { FilterBar } from '../components/mms/clients/FilterBar';
import { ClientsTable } from '../components/mms/clients/ClientsTable';
import { ClientSidePanel } from '../components/mms/clients/ClientSidePanel';

export const Route = createFileRoute('/clients')({
  component: ClientsPage,
});

function ClientsPage() {
  const navigate = useNavigate();
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ type_client: '', statut: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch = c.nom.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
                           c.telephone.includes(debouncedSearch) ||
                           (c.email?.toLowerCase() || '').includes(debouncedSearch.toLowerCase()) ||
                           c.code.includes(debouncedSearch);
      const matchesType = !filters.type_client || c.type_client === filters.type_client;
      const matchesStatut = !filters.statut || c.statut === filters.statut;
      return matchesSearch && matchesType && matchesStatut;
    });
  }, [clients, debouncedSearch, filters]);

  const handleFormSubmit = (data: any) => {
    // Basic duplicate check
    const isDuplicate = clients.some(c => 
      (data.telephone && c.telephone === data.telephone && c.id !== editingClient?.id) ||
      (data.email && c.email === data.email && c.id !== editingClient?.id)
    );

    if (isDuplicate) {
      toast.error('Un client avec ce téléphone ou email existe déjà.');
      return;
    }

    if (editingClient) {
      updateClient.mutate({ ...editingClient, ...data }, {
        onSuccess: () => { toast.success('Client modifié avec succès'); setIsFormOpen(false); setEditingClient(null); }
      });
    } else {
      createClient.mutate(data, {
        onSuccess: () => { toast.success('Client créé avec succès'); setIsFormOpen(false); }
      });
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate({ to: '..' });
    } else {
      navigate({ to: '/' });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-gray-500">Gérez vos relations clients et suivez leur activité.</p>
        </div>
        <div className="ml-auto space-x-2">
          <Button variant="outline">📥 Importer</Button>
          <Button variant="outline">📤 Exporter</Button>
          <Button onClick={() => setIsFormOpen(true)}>➕ Nouveau Client</Button>
        </div>
      </div>

      <StatsCards clients={clients} />

      <FilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
        onReset={() => { setSearchTerm(''); setFilters({ type_client: '', statut: '' }); }}
      />

      <ClientsTable 
        clients={filteredClients} 
        onSelectClient={setSelectedClient}
        onEditClient={(c) => { setEditingClient(c); setIsFormOpen(true); }}
        onDeleteClient={(id) => {
          deleteClient.mutate(id, { onSuccess: () => toast.success('Client supprimé') });
        }}
      />

      <ClientSidePanel client={selectedClient} onClose={() => setSelectedClient(null)} />
      
      <ClientForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingClient(null); }}
        onSubmit={handleFormSubmit}
        defaultValues={editingClient || {}}
        title={editingClient ? "Modifier le client" : "Nouveau Client"}
      />
    </div>
  );
}
