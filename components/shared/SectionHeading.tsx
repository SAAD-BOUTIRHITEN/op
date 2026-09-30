import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { SmartLink } from "./SmartLink";

interface SectionHeadingProps {
  title: ReactNode;
  lede?: string;
  link?: { label: string; href: string };
  tone?: "dark" | "light";
  className?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  title,
  lede,
  link,
  tone = "dark",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn("mb-10 flex flex-wrap items-end justify-between gap-5 lg:mb-12", className)}
    >
      <div>
        <Tag className="font-serif text-title">{title}</Tag>
        {lede ? (
          <p
            className={cn(
              "measure mt-3 text-body font-light",
              tone === "light" ? "text-creme-muted" : "text-taupe",
            )}
          >
            {lede}
          </p>
        ) : null}
      </div>

      {link ? (
        <SmartLink
          href={link.href}
          className={cn(
            // `after` élargit la zone tactile à ~44 px sans rien déplacer :
    // le texte de 12,5 px ne donnait qu'une cible de 22 px de haut.
    "relative border-b pb-1.5 text-ui font-medium transition-colors duration-200",
    "after:absolute after:-inset-y-3 after:inset-x-0 after:content-['']",
            tone === "light"
              ? "border-hairline-inverse text-creme hover:border-or"
              : "border-hairline hover:border-or",
          )}
        >
          {link.label} →
        </SmartLink>
      ) : null}
    </div>
  );
}
