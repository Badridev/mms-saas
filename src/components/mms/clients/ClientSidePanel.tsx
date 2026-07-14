import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Client } from '@/lib/types/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClientSidePanelProps {
  client: Client | null;
  onClose: () => void;
}

export function ClientSidePanel({ client, onClose }: ClientSidePanelProps) {
  if (!client) return null;

  return (
    <Sheet open={!!client} onOpenChange={() => onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback>{client.nom.charAt(0)}</AvatarFallback>
            </Avatar>
            {client.nom}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Code</p><p className="font-medium">{client.code}</p></div>
            <div><p className="text-sm text-gray-500">Téléphone</p><p className="font-medium">{client.telephone}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="font-medium">{client.email || 'N/A'}</p></div>
            <div><p className="text-sm text-gray-500">Ville</p><p className="font-medium">{client.ville || 'N/A'}</p></div>
          </div>
          
          <Separator />
          
          <Tabs defaultValue="stats">
            <TabsList className="w-full">
              <TabsTrigger value="stats" className="flex-1">Statistiques</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">Historique</TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <p className="text-sm text-gray-500 pt-4">Statistiques détaillées à venir...</p>
            </TabsContent>
            <TabsContent value="history">
              <p className="text-sm text-gray-500 pt-4">Historique des ventes et factures à venir...</p>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
