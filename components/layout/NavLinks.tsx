"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/**
 * Navigation de bureau avec état actif.
 *
 * Seul usage de `usePathname` du site, et la raison de cet îlot client : sans
 * lui, aucun repère ne dit sur quelle page on se trouve — ni visuellement, ni
 * pour un lecteur d'écran, faute d'`aria-current`.
 */
export function NavLinks({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="hidden justify-center gap-9 lg:flex">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-b py-1.5 text-ui font-medium transition-colors duration-200",
              active ? "border-or-deep" : "border-transparent hover:border-or",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
