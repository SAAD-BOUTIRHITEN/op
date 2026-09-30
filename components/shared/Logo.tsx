import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** `md` pour l'en-tête et le pied de page, `sm` pour les surfaces compactes. */
  size?: "sm" | "md";
  tone?: "dark" | "light";
  href?: string | null;
  className?: string;
}

/**
 * Verrou typographique du Concept 2 : LUNÉA en serif très espacé,
 * OPTIQUE en dessous, encadré de deux filets or.
 */
export function Logo({ size = "md", tone = "dark", href = "/", className }: LogoProps) {
  const content = (
    <span
      className={cn(
        "flex flex-col gap-1",
        tone === "light" ? "text-creme" : "text-noir",
        className,
      )}
    >
      <span
        className={cn(
          "font-serif font-medium leading-none",
          size === "md" ? "text-[1.35rem] lg:text-[1.6rem]" : "text-[1.1rem]",
        )}
        style={{ letterSpacing: "0.28em", textIndent: "0.28em" }}
      >
        LUNÉA
      </span>
      <span
        className={cn(
          "flex items-center gap-[7px] text-[0.53rem] font-medium",
          tone === "light" ? "text-creme-muted" : "text-taupe",
        )}
        style={{ letterSpacing: "0.42em", textIndent: "0.42em" }}
      >
        <i className="block h-px w-[18px] shrink-0 bg-or" aria-hidden="true" />
        OPTIQUE
        <i className="block h-px w-[18px] shrink-0 bg-or" aria-hidden="true" />
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} aria-label={`${site.BUSINESS_NAME}, accueil`} className="inline-flex">
      {content}
    </Link>
  );
}
