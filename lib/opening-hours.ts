import type { OpeningHoursSpec } from "@/config/site";

/** Libellé affiché pour une plage horaire. */
export function hoursLabel(slot: OpeningHoursSpec): string {
  return slot.closed ? "Fermé" : `${slot.opens} – ${slot.closes}`;
}
