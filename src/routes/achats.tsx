import { createFileRoute } from "@tanstack/react-router";
import { AchatsPage } from "@/components/mms/AchatsPage";

export const Route = createFileRoute("/achats")({
  component: AchatsPage,
  head: () => ({
    meta: [
      { title: "Achats — MMS AI CORE" },
      { name: "description", content: "Gestion des achats, fournisseurs et paiements de l'imprimerie." },
    ],
  }),
});
