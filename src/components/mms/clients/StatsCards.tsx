import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Building2, TrendingUp, ShoppingCart, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Client } from '@/lib/types/client';
import { useMemo } from 'react';
import { isSameMonth, parseISO } from 'date-fns';
import { formatFCFA } from '@/lib/utils';

interface StatsCardsProps {
  clients: Client[];
}

export function StatsCards({ clients }: StatsCardsProps) {
  const stats = useMemo(() => {
    const total = clients.length;
    const newThisMonth = clients.filter((c) => isSameMonth(parseISO(c.created_at), new Date())).length;
    const active = clients.filter((c) => c.statut === 'Actif').length;
    const enterprises = clients.filter((c) => c.type_client === 'Entreprise').length;
    
    // For now, placeholders until we connect to sales/orders modules
    const totalRevenue = 0; 
    const totalOrders = 0;

    return [
      { title: 'Total des clients', value: total, icon: Users, color: 'text-blue-500' },
      { title: 'Nouveaux ce mois', value: newThisMonth, icon: UserPlus, color: 'text-green-500' },
      { title: 'Clients actifs', value: active, icon: Activity, color: 'text-blue-500' },
      { title: 'Entreprises', value: enterprises, icon: Building2, color: 'text-purple-500' },
      { title: 'CA Généré', value: formatFCFA(totalRevenue), icon: TrendingUp, color: 'text-green-500' },
      { title: 'Commandes', value: totalOrders, icon: ShoppingCart, color: 'text-orange-500' },
    ];
  }, [clients]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-3">
            <CardHeader className="flex flex-row items-center justify-between p-0 pb-1 space-y-0">
              <CardTitle className="text-xs font-medium text-gray-500">{stat.title}</CardTitle>
              <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
