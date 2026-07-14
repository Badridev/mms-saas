import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2, Mail, Phone, MessageCircle } from 'lucide-react';
import { Client } from '@/lib/types/client';
import { Badge } from '@/components/ui/badge';

interface ClientsTableProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (id: string) => void;
}

export function ClientsTable({ clients, onSelectClient, onEditClient, onDeleteClient }: ClientsTableProps) {
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"><Checkbox /></TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ville</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onSelectClient(client)}>
              <TableCell><Checkbox onClick={(e) => e.stopPropagation()} /></TableCell>
              <TableCell className="font-medium">{client.code}</TableCell>
              <TableCell>{client.nom}</TableCell>
              <TableCell>{client.telephone}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.ville || '-'}</TableCell>
              <TableCell>
                <Badge variant={client.statut === 'Actif' ? 'default' : 'secondary'}>
                  {client.statut || 'Inactif'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectClient(client); }}><Eye className="mr-2 h-4 w-4" /> Voir</DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditClient(client); }}><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Phone className="mr-2 h-4 w-4" /> Appeler</DropdownMenuItem>
                    <DropdownMenuItem><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp</DropdownMenuItem>
                    <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Email</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); onDeleteClient(client.id); }}><Trash2 className="mr-2 h-4 w-4" /> Supprimer</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
