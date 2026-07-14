import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function FilterBar({ searchTerm, setSearchTerm, onFilterChange, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher (Ctrl+K)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select onValueChange={(val) => onFilterChange('type_client', val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type de client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Particulier">Particulier</SelectItem>
          <SelectItem value="Entreprise">Entreprise</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => onFilterChange('statut', val)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Actif">Actif</SelectItem>
          <SelectItem value="Inactif">Inactif</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" onClick={onReset} size="icon">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
