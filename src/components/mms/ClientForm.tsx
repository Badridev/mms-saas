import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Client } from '../../lib/types/client';

const clientSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  telephone: z.string().min(8, 'Le téléphone doit contenir au moins 8 caractères'),
  email: z.string().email().optional().or(z.literal('')),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  type_client: z.enum(['Particulier', 'Entreprise']).optional(),
  statut: z.enum(['Actif', 'Inactif']).optional(),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  defaultValues?: Partial<Client>;
  title: string;
}

export const ClientForm = ({ isOpen, onClose, onSubmit, defaultValues, title }: ClientFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type_client: 'Particulier',
      statut: 'Actif',
      ...defaultValues
    },
  });

  const typeClient = watch('type_client');
  const statut = watch('statut');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input id="nom" {...register('nom')} />
              {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input id="telephone" {...register('telephone')} />
              {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
          </div>
          <div>
            <Label htmlFor="adresse">Adresse</Label>
            <Input id="adresse" {...register('adresse')} />
          </div>
          <div>
            <Label htmlFor="ville">Ville</Label>
            <Input id="ville" {...register('ville')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={typeClient} onValueChange={(v) => setValue('type_client', v as 'Particulier' | 'Entreprise')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Entreprise">Entreprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Statut</Label>
              <Select value={statut} onValueChange={(v) => setValue('statut', v as 'Actif' | 'Inactif')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
