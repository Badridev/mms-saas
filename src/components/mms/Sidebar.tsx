import { motion } from "framer-motion";
import {
  Home, Bot, Wallet, FileText, Users, Wrench,
  ShoppingCart, Truck, Receipt, TrendingUp, Settings, Sparkles,
} from "lucide-react";
import { useState } from "react";

const items = [
  { icon: Home, label: "Dashboard", key: "dashboard" },
  { icon: Bot, label: "Assistant IA", key: "ai" },
  { icon: Wallet, label: "Ventes", key: "ventes" },
  { icon: FileText, label: "Devis", key: "devis" },
  { icon: Users, label: "Clients", key: "clients" },
  { icon: Wrench, label: "Services", key: "services" },
  { icon: ShoppingCart, label: "Achats", key: "achats" },
  { icon: Truck, label: "Fournisseurs", key: "fournisseurs" },
  { icon: Receipt, label: "Dépenses", key: "depenses" },
  { icon: TrendingUp, label: "Rapports", key: "rapports" },
  { icon: Settings, label: "Paramètres", key: "params" },
];

export function Sidebar() {
  const [active, setActive] = useState("ai");
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
          const isActive = active === it.key;
          return (
            <button
              key={it.key}
              onClick={() => setActive(it.key)}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/75 hover:text-white transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-primary-glow shadow-lg shadow-primary/40"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <it.icon className={`relative h-[18px] w-[18px] ${isActive ? "text-white" : ""}`} />
              <span className={`relative ${isActive ? "text-white" : ""}`}>{it.label}</span>
            </button>
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
