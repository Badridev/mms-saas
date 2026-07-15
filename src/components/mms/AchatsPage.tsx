import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Trash2, Pencil, X, ShoppingCart, TrendingUp,
  Package, Truck, Check, Filter,
} from "lucide-react";
import { Sidebar } from "@/components/mms/Sidebar";
import { formatFCFA } from "@/lib/utils";

type Statut = "En attente" | "Reçue" | "Payée" | "Annulée";
type PayMethod = "Espèces" | "Wave" | "Orange Money" | "Virement" | "Crédit";

type Achat = {
  id: string;
  reference: string;
  date: string; // ISO
  fournisseur: string;
  produit: string;
  categorie: string;
  quantite: number;
  prixUnitaire: number;
  paiement: PayMethod;
  statut: Statut;
  note?: string;
};

const CATEGORIES = ["Papeterie", "Encre & Toner", "Matériel", "Consommables", "Fournitures", "Autre"];
const STATUTS: Statut[] = ["En attente", "Reçue", "Payée", "Annulée"];
const PAIEMENTS: PayMethod[] = ["Espèces", "Wave", "Orange Money", "Virement", "Crédit"];

const STORAGE_KEY = "mms.achats.v1";

function loadAchats(): Achat[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Achat[];
  } catch {
    /* ignore */
  }
  // Seed demo data on first load
  const seed: Achat[] = [
    {
      id: crypto.randomUUID(),
      reference: "ACH-2026-001",
      date: new Date().toISOString().slice(0, 10),
      fournisseur: "Papeterie du Fleuve",
      produit: "Ramette A4 80g",
      categorie: "Papeterie",
      quantite: 50,
      prixUnitaire: 3200,
      paiement: "Virement",
      statut: "Reçue",
    },
    {
      id: crypto.randomUUID(),
      reference: "ACH-2026-002",
      date: new Date().toISOString().slice(0, 10),
      fournisseur: "InkPro Sénégal",
      produit: "Toner HP 26A",
      categorie: "Encre & Toner",
      quantite: 4,
      prixUnitaire: 45000,
      paiement: "Wave",
      statut: "Payée",
    },
    {
      id: crypto.randomUUID(),
      reference: "ACH-2026-003",
      date: new Date().toISOString().slice(0, 10),
      fournisseur: "Bureautique Plus",
      produit: "Spirales reliure 12mm",
      categorie: "Consommables",
      quantite: 200,
      prixUnitaire: 150,
      paiement: "Espèces",
      statut: "En attente",
    },
  ];
  return seed;
}

function saveAchats(list: Achat[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function nextReference(list: Achat[]) {
  const year = new Date().getFullYear();
  const prefix = `ACH-${year}-`;
  const nums = list
    .map((a) => a.reference)
    .filter((r) => r.startsWith(prefix))
    .map((r) => parseInt(r.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export function AchatsPage() {
  const [achats, setAchats] = useState<Achat[]>(() => loadAchats());
  const [query, setQuery] = useState("");
  const [statutFilter, setStatutFilter] = useState<Statut | "Tous">("Tous");
  const [editing, setEditing] = useState<Achat | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    saveAchats(achats);
  }, [achats]);

  const filtered = useMemo(() => {
    return achats
      .filter((a) => (statutFilter === "Tous" ? true : a.statut === statutFilter))
      .filter((a) => {
        const q = query.toLowerCase();
        return (
          !q ||
          a.reference.toLowerCase().includes(q) ||
          a.fournisseur.toLowerCase().includes(q) ||
          a.produit.toLowerCase().includes(q) ||
          a.categorie.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [achats, query, statutFilter]);

  const stats = useMemo(() => {
    const total = achats.reduce((s, a) => s + a.quantite * a.prixUnitaire, 0);
    const enAttente = achats.filter((a) => a.statut === "En attente").length;
    const payees = achats
      .filter((a) => a.statut === "Payée")
      .reduce((s, a) => s + a.quantite * a.prixUnitaire, 0);
    return { total, enAttente, payees, count: achats.length };
  }, [achats]);

  const openNew = () => {
    setEditing({
      id: crypto.randomUUID(),
      reference: nextReference(achats),
      date: new Date().toISOString().slice(0, 10),
      fournisseur: "",
      produit: "",
      categorie: CATEGORIES[0],
      quantite: 1,
      prixUnitaire: 0,
      paiement: "Espèces",
      statut: "En attente",
    });
    setShowForm(true);
  };

  const openEdit = (a: Achat) => {
    setEditing({ ...a });
    setShowForm(true);
  };

  const save = (a: Achat) => {
    setAchats((prev) => {
      const exists = prev.some((x) => x.id === a.id);
      return exists ? prev.map((x) => (x.id === a.id ? a : x)) : [a, ...prev];
    });
    setShowForm(false);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm("Supprimer cet achat ?")) return;
    setAchats((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                Module Achats
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Gestion des achats
              </h1>
              <p className="text-muted-foreground mt-1">
                Suivez vos approvisionnements, fournisseurs et paiements.
              </p>
            </div>
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-white text-sm font-semibold shadow-lg shadow-primary/30 hover:opacity-95 transition"
            >
              <Plus className="h-4 w-4" /> Nouvel achat
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={ShoppingCart} label="Achats totaux" value={stats.count.toString()} />
            <StatCard icon={TrendingUp} label="Montant total" value={formatFCFA(stats.total)} />
            <StatCard icon={Check} label="Payées" value={formatFCFA(stats.payees)} tone="success" />
            <StatCard icon={Truck} label="En attente" value={stats.enAttente.toString()} tone="warning" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par référence, fournisseur, produit…"
                className="w-full rounded-xl bg-card border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/60 transition"
              />
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-card border border-border p-1">
              <Filter className="h-4 w-4 text-muted-foreground mx-2" />
              {(["Tous", ...STATUTS] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatutFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    statutFilter === s
                      ? "bg-primary text-white shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Référence</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">Fournisseur</th>
                    <th className="text-left px-4 py-3 font-medium">Produit</th>
                    <th className="text-right px-4 py-3 font-medium">Qté</th>
                    <th className="text-right px-4 py-3 font-medium">P.U.</th>
                    <th className="text-right px-4 py-3 font-medium">Total</th>
                    <th className="text-left px-4 py-3 font-medium">Paiement</th>
                    <th className="text-left px-4 py-3 font-medium">Statut</th>
                    <th className="text-right px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-muted-foreground">
                        <Package className="h-8 w-8 mx-auto mb-3 opacity-50" />
                        Aucun achat trouvé.
                      </td>
                    </tr>
                  )}
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-t border-border hover:bg-muted/20 transition">
                      <td className="px-4 py-3 font-mono text-xs">{a.reference}</td>
                      <td className="px-4 py-3">{a.date}</td>
                      <td className="px-4 py-3 font-medium">{a.fournisseur}</td>
                      <td className="px-4 py-3">
                        <div>{a.produit}</div>
                        <div className="text-xs text-muted-foreground">{a.categorie}</div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{a.quantite}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatFCFA(a.prixUnitaire)}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold">
                        {formatFCFA(a.quantite * a.prixUnitaire)}
                      </td>
                      <td className="px-4 py-3">{a.paiement}</td>
                      <td className="px-4 py-3">
                        <StatutBadge statut={a.statut} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(a)}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove(a.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showForm && editing && (
          <AchatForm
            achat={editing}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSave={save}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "from-emerald-500/20 to-emerald-500/5 text-emerald-500"
      : tone === "warning"
      ? "from-amber-500/20 to-amber-500/5 text-amber-500"
      : "from-primary/20 to-primary/5 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl grid place-items-center bg-gradient-to-br ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold truncate">{value}</div>
        </div>
      </div>
    </div>
  );
}

function StatutBadge({ statut }: { statut: Statut }) {
  const map: Record<Statut, string> = {
    "En attente": "bg-amber-500/15 text-amber-500 border-amber-500/30",
    "Reçue": "bg-blue-500/15 text-blue-500 border-blue-500/30",
    "Payée": "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    "Annulée": "bg-red-500/15 text-red-500 border-red-500/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${map[statut]}`}>
      {statut}
    </span>
  );
}

function AchatForm({
  achat,
  onClose,
  onSave,
}: {
  achat: Achat;
  onClose: () => void;
  onSave: (a: Achat) => void;
}) {
  const [form, setForm] = useState<Achat>(achat);
  const total = form.quantite * form.prixUnitaire;

  const upd = <K extends keyof Achat>(k: K, v: Achat[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fournisseur.trim() || !form.produit.trim()) return;
    onSave({
      ...form,
      quantite: Math.max(1, Number(form.quantite) || 1),
      prixUnitaire: Math.max(0, Number(form.prixUnitaire) || 0),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {achat.fournisseur ? "Modifier l'achat" : "Nouvel achat"}
            </div>
            <div className="font-mono text-sm">{form.reference}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => upd("date", e.target.value)}
              className="input"
              required
            />
          </Field>
          <Field label="Fournisseur">
            <input
              value={form.fournisseur}
              onChange={(e) => upd("fournisseur", e.target.value)}
              placeholder="Nom du fournisseur"
              className="input"
              required
            />
          </Field>
          <Field label="Produit / Description">
            <input
              value={form.produit}
              onChange={(e) => upd("produit", e.target.value)}
              placeholder="Ex : Ramette A4 80g"
              className="input"
              required
            />
          </Field>
          <Field label="Catégorie">
            <select
              value={form.categorie}
              onChange={(e) => upd("categorie", e.target.value)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Quantité">
            <input
              type="number"
              min={1}
              value={form.quantite}
              onChange={(e) => upd("quantite", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Prix unitaire (FCFA)">
            <input
              type="number"
              min={0}
              value={form.prixUnitaire}
              onChange={(e) => upd("prixUnitaire", Number(e.target.value))}
              className="input"
            />
          </Field>
          <Field label="Mode de paiement">
            <select
              value={form.paiement}
              onChange={(e) => upd("paiement", e.target.value as PayMethod)}
              className="input"
            >
              {PAIEMENTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </Field>
          <Field label="Statut">
            <select
              value={form.statut}
              onChange={(e) => upd("statut", e.target.value as Statut)}
              className="input"
            >
              {STATUTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Note (optionnel)">
              <textarea
                value={form.note ?? ""}
                onChange={(e) => upd("note", e.target.value)}
                rows={2}
                className="input resize-none"
                placeholder="Bon de commande, référence interne…"
              />
            </Field>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Total : <span className="text-foreground font-semibold text-base">{formatFCFA(total)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-glow shadow-lg shadow-primary/30 hover:opacity-95 transition"
            >
              <Check className="h-4 w-4" /> Enregistrer
            </button>
          </div>
        </div>

        <style>{`
          .input {
            width: 100%;
            border-radius: 0.75rem;
            background: hsl(var(--background));
            border: 1px solid hsl(var(--border));
            padding: 0.6rem 0.85rem;
            font-size: 0.875rem;
            outline: none;
            transition: border-color 0.15s;
            color: inherit;
          }
          .input:focus { border-color: hsl(var(--primary) / 0.6); }
        `}</style>
      </motion.form>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}
