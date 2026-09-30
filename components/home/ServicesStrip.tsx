import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { cn } from "@/lib/utils/cn";

interface Service {
  title: string;
  detail: string;
  icon: ReactNode;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const services: Service[] = [
  {
    title: "Expertise & conseil",
    detail: "Un accompagnement sur mesure",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M12 5c-4.2 0-7.6 2.8-9 7 1.4 4.2 4.8 7 9 7s7.6-2.8 9-7c-1.4-4.2-4.8-7-9-7Z" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
    ),
  },
  {
    title: "Qualité des marques",
    detail: "Une sélection resserrée",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="m12 3 2.4 5.2 5.6.7-4.1 3.9 1.1 5.6L12 15.7 6.9 18.4 8 12.8 4 8.9l5.6-.7z" />
      </svg>
    ),
  },
  {
    title: "Service personnalisé",
    detail: "Votre vision, notre priorité",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <circle cx="12" cy="8" r="3.6" />
        <path d="M4.5 20c.9-3.6 3.9-5.6 7.5-5.6s6.6 2 7.5 5.6" />
      </svg>
    ),
  },
  {
    title: "Proximité",
    detail: "En plein cœur de la ville",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
];

export function ServicesStrip() {
  return (
    <section className="border-b border-hairline">
      <Container>
        {/* Titre pour lecteurs d'écran : sans lui, l'accueil passait de h1 à h3. */}
        <h2 className="sr-only">Nos engagements</h2>
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li
              key={service.title}
              className={cn(
                "px-4 py-7 lg:px-7 lg:py-10",
                index % 2 === 0 && "border-r border-hairline lg:border-r-0",
                index < 2 && "border-b border-hairline lg:border-b-0",
                index > 0 && "lg:border-l lg:border-hairline",
              )}
            >
              <span className="mb-3 block size-5 text-or">{service.icon}</span>
              <h3 className="text-ui font-medium">{service.title}</h3>
              <p className="mt-1 text-ui leading-snug font-light text-taupe">
                {service.detail}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
