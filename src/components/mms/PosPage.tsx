import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Minus, Trash2, Printer, MessageCircle, CreditCard,
  Wallet, Smartphone, Banknote, X, Check, Receipt as ReceiptIcon,
  Copy, FileText, Layers, Image as ImageIcon, Scissors, Stamp, Palette,
} from "lucide-react";
import { Sidebar } from "@/components/mms/Sidebar";

// ---------------- Types & catalogue ----------------
type Category = "Impression" | "Copie" | "Reliure" | "Finition" | "Numérique";
type Service = {
  id: string;
  name: string;
  price: number; // FCFA
  unit: string;
  category: Category;
  icon: React.ComponentType<{ className?: string }>;
};

const CATALOG: Service[] = [
  { id: "imp-n-a4", name: "Impression N&B A4", price: 100, unit: "page", category: "Impression", icon: FileText },
  { id: "imp-c-a4", name: "Impression Couleur A4", price: 300, unit: "page", category: "Impression", icon: Palette },
  { id: "imp-n-a3", name: "Impression N&B A3", price: 250, unit: "page", category: "Impression", icon: FileText },
  { id: "imp-c-a3", name: "Impression Couleur A3", price: 600, unit: "page", category: "Impression", icon: Palette },
  { id: "photo", name: "Photo d'identité", price: 1500, unit: "planche", category: "Impression", icon: ImageIcon },
  { id: "cop-n-a4", name: "Photocopie N&B A4", price: 50, unit: "page", category: "Copie", icon: Copy },
  { id: "cop-c-a4", name: "Photocopie Couleur A4", price: 200, unit: "page", category: "Copie", icon: Copy },
  { id: "scan", name: "Scan document", price: 200, unit: "page", category: "Numérique", icon: Layers },
  { id: "grav-cd", name: "Gravure CD/DVD", price: 1000, unit: "unité", category: "Numérique", icon: Layers },
  { id: "rel-spir", name: "Reliure spirale", price: 1500, unit: "unité", category: "Reliure", icon: Layers },
  { id: "rel-therm", name: "Reliure thermique", price: 2500, unit: "unité", category: "Reliure", icon: Layers },
  { id: "plast-a4", name: "Plastification A4", price: 500, unit: "unité", category: "Finition", icon: Stamp },
  { id: "plast-a3", name: "Plastification A3", price: 1000, unit: "unité", category: "Finition", icon: Stamp },
  { id: "decoupe", name: "Découpe / Massicot", price: 300, unit: "lot", category: "Finition", icon: Scissors },
];

const CATEGORIES: (Category | "Tous")[] = ["Tous", "Impression", "Copie", "Reliure", "Finition", "Numérique"];

type CartItem = Service & { qty: number };
type PayMethod = "Espèces" | "Wave" | "Orange Money" | "Carte";

// ---------------- POS Page ----------------
export function PosPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(Category | "Tous")>("Tous");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [client, setClient] = useState("");
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<PayMethod>("Espèces");
  const [checkout, setCheckout] = useState<null | Ticket>(null);

  const filtered = useMemo(() => {
    return CATALOG.filter((s) => {
      const matchCat = category === "Tous" || s.category === category;
      const matchQ = s.name.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQ;
    });
  }, [query, category]);

  const subTotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);
  const total = Math.max(0, subTotal - discount);

  const addToCart = (s: Service) => {
    setCart((c) => {
      const found = c.find((i) => i.id === s.id);
      if (found) return c.map((i) => (i.id === s.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...s, qty: 1 }];
    });
  };
  const setQty = (id: string, qty: number) => {
    if (qty <= 0) return setCart((c) => c.filter((i) => i.id !== id));
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty } : i)));
  };
  const clearCart = () => {
    setCart([]);
    setClient("");
    setDiscount(0);
  };

  const validate = () => {
    if (cart.length === 0) return;
    const ticket: Ticket = {
      number: "T-" + Math.floor(Math.random() * 900000 + 100000),
      date: new Date(),
      items: cart,
      subTotal,
      discount,
      total,
      payment,
      client: client || "Client comptoir",
      cashier: "Bamba",
    };
    setCheckout(ticket);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 flex min-w-0">
        {/* Catalogue */}
        <section className="flex-1 flex flex-col min-w-0 border-r border-border">
          <header className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Point de vente</h1>
                <p className="text-sm text-muted-foreground">Imprimerie — services & articles</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un service..."
                className="w-full rounded-2xl bg-muted/60 border border-border pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary/40 transition"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(s)}
                  className="group text-left rounded-2xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="font-medium text-sm leading-tight">{s.name}</div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-primary font-semibold text-sm">{formatFCFA(s.price)}</span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">/ {s.unit}</span>
                  </div>
                </motion.button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
                  Aucun service trouvé
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Panier */}
        <aside className="w-[380px] shrink-0 flex flex-col bg-card">
          <div className="px-5 pt-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Ticket en cours</h2>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" /> Vider
                </button>
              )}
            </div>
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Nom du client (facultatif)"
              className="mt-3 w-full rounded-xl bg-muted/60 border border-border px-3 py-2 text-sm outline-none focus:border-primary/40"
            />
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-3">
            {cart.length === 0 ? (
              <div className="h-full grid place-items-center text-center text-muted-foreground text-sm p-6">
                <div>
                  <ReceiptIcon className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  Sélectionnez des services<br />pour démarrer la vente
                </div>
              </div>
            ) : (
              <ul className="space-y-2">
                <AnimatePresence initial={false}>
                  {cart.map((i) => (
                    <motion.li
                      key={i.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="rounded-xl border border-border bg-background p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{i.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFCFA(i.price)} / {i.unit}
                          </div>
                        </div>
                        <button
                          onClick={() => setQty(i.id, 0)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-border">
                          <button
                            onClick={() => setQty(i.id, i.qty - 1)}
                            className="h-8 w-8 grid place-items-center hover:bg-muted"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <input
                            value={i.qty}
                            onChange={(e) =>
                              setQty(i.id, Math.max(0, parseInt(e.target.value) || 0))
                            }
                            className="w-10 text-center bg-transparent outline-none text-sm"
                          />
                          <button
                            onClick={() => setQty(i.id, i.qty + 1)}
                            className="h-8 w-8 grid place-items-center hover:bg-muted"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-primary">
                          {formatFCFA(i.qty * i.price)}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>

          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="font-medium">{formatFCFA(subTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Remise</span>
              <input
                type="number"
                min={0}
                value={discount || ""}
                onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className="w-24 text-right rounded-lg bg-muted/60 border border-border px-2 py-1 text-sm outline-none focus:border-primary/40"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-bold text-primary">{formatFCFA(total)}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {(
                [
                  { m: "Espèces" as const, icon: Banknote },
                  { m: "Wave" as const, icon: Smartphone },
                  { m: "Orange Money" as const, icon: Wallet },
                  { m: "Carte" as const, icon: CreditCard },
                ]
              ).map(({ m, icon: Icon }) => (
                <button
                  key={m}
                  onClick={() => setPayment(m)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-[11px] transition ${
                    payment === m
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {m}
                </button>
              ))}
            </div>

            <button
              disabled={cart.length === 0}
              onClick={validate}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-white font-semibold shadow-lg shadow-primary/30 disabled:opacity-40 disabled:shadow-none hover:scale-[1.01] transition"
            >
              Encaisser {formatFCFA(total)}
            </button>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {checkout && (
          <ReceiptModal
            ticket={checkout}
            onClose={() => {
              setCheckout(null);
              clearCart();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- Ticket / Receipt ----------------
type Ticket = {
  number: string;
  date: Date;
  items: CartItem[];
  subTotal: number;
  discount: number;
  total: number;
  payment: PayMethod;
  client: string;
  cashier: string;
};

function ReceiptModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const html = printRef.current?.innerHTML;
    if (!html) return;
    const w = window.open("", "_blank", "width=380,height=640");
    if (!w) return;
    w.document.write(`<!doctype html><html><head><title>Ticket ${ticket.number}</title>
      <style>
        @page { size: 80mm auto; margin: 4mm; }
        body { font-family: 'Courier New', monospace; font-size: 12px; color:#000; margin:0; padding:0; }
        .ticket { width: 72mm; }
        .center { text-align:center; }
        .row { display:flex; justify-content:space-between; }
        .sep { border-top:1px dashed #000; margin:6px 0; }
        h1 { font-size:14px; margin:2px 0; }
        table { width:100%; border-collapse:collapse; }
        td { padding:2px 0; vertical-align:top; }
        .qty { width:22px; }
        .amt { text-align:right; white-space:nowrap; }
        .total { font-size:14px; font-weight:bold; }
      </style></head><body onload="window.print();setTimeout(()=>window.close(),300)">
      <div class="ticket">${html}</div></body></html>`);
    w.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-green-500/10 text-green-600 grid place-items-center">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-sm">Vente encaissée</div>
              <div className="text-xs text-muted-foreground">Ticket {ticket.number}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-5 bg-muted/30">
          <div
            ref={printRef}
            className="mx-auto bg-white text-black font-mono text-[12px] leading-snug p-4 shadow-md"
            style={{ width: 300 }}
          >
            <div className="center">
              <h1 style={{ fontSize: 14, margin: "2px 0", fontWeight: 700 }}>MAGUY MULTI SERVICES</h1>
              <div>Imprimerie & Bureautique</div>
              <div>Dakar — Tél. +221 77 000 00 00</div>
              <div>NINEA: 00000000 · RC: SN.DKR.00</div>
            </div>
            <div className="sep" style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Ticket:</span><span>{ticket.number}</span>
            </div>
            <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Date:</span>
              <span>{ticket.date.toLocaleString("fr-FR")}</span>
            </div>
            <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Caissier:</span><span>{ticket.cashier}</span>
            </div>
            <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Client:</span><span>{ticket.client}</span>
            </div>
            <div className="sep" style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {ticket.items.map((i) => (
                  <>
                    <tr key={i.id + "-n"}>
                      <td style={{ padding: "2px 0" }} colSpan={2}>{i.name}</td>
                    </tr>
                    <tr key={i.id + "-l"}>
                      <td style={{ paddingLeft: 8 }}>{i.qty} x {formatNum(i.price)}</td>
                      <td style={{ textAlign: "right" }}>{formatNum(i.qty * i.price)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
            <div className="sep" style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Sous-total</span><span>{formatNum(ticket.subTotal)}</span>
            </div>
            {ticket.discount > 0 && (
              <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Remise</span><span>-{formatNum(ticket.discount)}</span>
              </div>
            )}
            <div
              className="row total"
              style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14, marginTop: 4 }}
            >
              <span>TOTAL FCFA</span><span>{formatNum(ticket.total)}</span>
            </div>
            <div className="row" style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              <span>Paiement</span><span>{ticket.payment}</span>
            </div>
            <div className="sep" style={{ borderTop: "1px dashed #000", margin: "6px 0" }} />
            <div className="center" style={{ textAlign: "center" }}>
              Merci de votre visite !<br />
              À bientôt chez MMS<br />
              <span style={{ fontSize: 10 }}>Ticket non remboursable</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-4 border-t border-border">
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <Printer className="h-4 w-4" /> Imprimer le ticket
          </button>
          <button
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-green-500 text-white hover:opacity-90 transition"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-muted hover:bg-accent transition"
          >
            Nouvelle vente
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------- Utils ----------------
function formatNum(n: number) {
  return n.toLocaleString("fr-FR");
}
function formatFCFA(n: number) {
  return formatNum(n) + " FCFA";
}
