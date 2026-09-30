import Link from "next/link";
import type { ReactNode } from "react";
import { linkKind } from "@/lib/utils/links";

interface SmartLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  onClick?: () => void;
}

/**
 * Rend un lien interne (next/link), externe (nouvel onglet + rel) ou
 * protocolaire (tel:, mailto: — même onglet). Évite de répéter cette
 * logique dans chaque composant.
 */
export function SmartLink({ href, children, className, onClick, ...rest }: SmartLinkProps) {
  const kind = linkKind(href);

  if (kind === "internal") {
    return (
      <Link href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
