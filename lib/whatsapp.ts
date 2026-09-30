import { isSet, site } from "@/config/site";
import type { Frame } from "@/lib/products/types";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Bonjour, je souhaite avoir des informations sur vos montures.";

/**
 * Construction pure de l'URL wa.me — sans lecture de configuration,
 * afin d'être testable indépendamment de l'état du projet.
 * Retourne `null` si le numéro ne contient aucun chiffre.
 */
export function buildWhatsAppUrl(rawNumber: string, message: string): string | null {
  const digits = rawNumber.replace(/\D/g, "");
  if (digits.length === 0) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * Lien WhatsApp pré-rempli, ou `null` si le numéro n'est pas encore configuré.
 * Les appels à l'action retombent alors sur /contact.
 */
export function whatsappHref(message: string = DEFAULT_WHATSAPP_MESSAGE): string | null {
  if (!isSet(site.WHATSAPP_NUMBER)) return null;
  return buildWhatsAppUrl(site.WHATSAPP_NUMBER, message);
}

/** Message de demande de disponibilité pour une monture précise. */
export function frameEnquiryMessage(frame: Pick<Frame, "name" | "reference">): string {
  return `Bonjour, je suis intéressé(e) par le modèle ${frame.name} – référence ${frame.reference}. Est-il disponible ?`;
}

export function telHref(): string | null {
  if (!isSet(site.PHONE)) return null;
  return `tel:${site.PHONE.replace(/\s/g, "")}`;
}

export function mailHref(): string | null {
  if (!isSet(site.EMAIL)) return null;
  return `mailto:${site.EMAIL}`;
}

/**
 * Affichage lisible d'un numéro marocain : +212 6 98 51 52 02.
 * Un numéro brut de douze chiffres est illisible, et se dicte mal au téléphone.
 */
export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits.startsWith("212") || digits.length !== 12) return phone;
  const n = digits.slice(3);
  return `+212 ${n[0]} ${n.slice(1, 3)} ${n.slice(3, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`;
}
