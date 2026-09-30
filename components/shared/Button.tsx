import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { SmartLink } from "./SmartLink";

export type ButtonVariant = "gold" | "ghost" | "dark" | "line";

const base =
  "inline-flex min-h-11 items-center justify-center gap-3 rounded-xs border px-7 py-4 text-ui font-medium tracking-[0.09em] uppercase transition-colors duration-200";

/**
 * Chaque variante fixe sa propre couleur de bordure, et la base n'en fixe
 * aucune. Auparavant la base portait `border-transparent` : même spécificité
 * que `border-noir`, et comme cn() concatène sans arbitrer, le transparent
 * l'emportait — tous les boutons à contour s'affichaient comme du texte nu.
 */
const variants: Record<ButtonVariant, string> = {
  gold: "border-transparent bg-beige text-noir hover:bg-or",
  ghost: "border-creme-faint text-creme hover:border-creme hover:bg-creme hover:text-noir",
  dark: "border-transparent bg-noir text-creme hover:bg-noir-soft",
  line: "border-noir text-noir hover:bg-noir hover:text-creme",
};

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  fullWidthOnMobile?: boolean;
  ariaLabel?: string;
}

/**
 * Le rendu du lien est délégué à SmartLink : interne, externe ou protocolaire
 * (tel:, mailto:) sont traités correctement sans que l'appelant s'en occupe.
 */
export function Button({
  href,
  children,
  variant = "dark",
  className,
  fullWidthOnMobile = true,
  ariaLabel,
}: ButtonProps) {
  return (
    <SmartLink
      href={href}
      aria-label={ariaLabel}
      className={cn(base, variants[variant], fullWidthOnMobile && "w-full sm:w-auto", className)}
    >
      {children}
    </SmartLink>
  );
}
