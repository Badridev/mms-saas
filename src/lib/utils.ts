import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNum(n: number) {
  return n.toLocaleString("fr-FR");
}

export function formatFCFA(n: number) {
  return formatNum(n) + " FCFA";
}
