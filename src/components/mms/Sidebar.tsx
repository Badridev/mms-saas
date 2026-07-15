import { motion } from "framer-motion";
import {
  Home, Wallet, FileText, Users, Wrench,
  ShoppingCart, Truck, Receipt, TrendingUp, Settings, Sparkles,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  soon?: boolean;
};

const items: Item[] = [
  { icon: Home, label: "Assistant IA", to: "/" },
  { icon: Wallet, label: "Ventes (POS)", to: "/ventes" },
  { icon: Users, label: "Clients", to: "/clients" },
  { icon: FileText, label: "Devis", soon: true },
  { icon: Wrench, label: "Services", soon: true },
  { icon: ShoppingCart, label: "Achats", soon: true },
  { icon: Truck, label: "Fournisseurs", soon: true },
  { icon: Receipt, label: "Dépenses", soon: true },
  { icon: TrendingUp, label: "Rapports", soon: true },
  { icon: Settings, label: "Paramètres", soon: true },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground p-4 gap-2 border-r border-sidebar-border">
      <div className="flex items-center gap-2 px-2 py-4">
        <div className="grid place-items-center h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-glow shadow-lg shadow-primary/30">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold tracking-tight">MMS AI CORE</div>
          <div className="text-xs text-sidebar-foreground/60">Maguy Multi Services</div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1 mt-2">
        {items.map((it) => {
          const active = !!it.to && (it.to === "/" ? pathname === "/" : pathname.startsWith(it.to));
          const baseClass =
            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors";
          const content = (
            <>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-glow shadow-lg shadow-primary/40"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <it.icon className={`relative h-[18px] w-[18px] ${active ? "text-white" : ""}`} />
              <span className={`relative flex-1 ${active ? "text-white" : ""}`}>{it.label}</span>
              {it.soon && (
                <span className="relative text-[9px] uppercase tracking-wide bg-sidebar-accent/70 px-1.5 py-0.5 rounded">
                  Bientôt
                </span>
              )}
            </>
          );

          if (it.soon || !it.to) {
            return (
              <div
                key={it.label}
                title="Bientôt disponible"
                className={`${baseClass} text-sidebar-foreground/40 cursor-not-allowed`}
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={it.label}
              to={it.to}
              className={`${baseClass} text-sidebar-foreground/75 hover:text-white`}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-sidebar-accent/60 p-3 border border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center text-white text-sm font-bold">B</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">Bamba</div>
            <div className="text-xs text-sidebar-foreground/60 truncate">Administrateur</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
