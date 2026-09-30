import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { LensMarkIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils/cn";

const reasons = [
  {
    title: "Une sélection, pas un stock",
    detail: "Nous ne cherchons pas à tout avoir. Nous cherchons à avoir ce qui vous ira.",
  },
  {
    title: "Des mesures prises correctement",
    detail:
      "Centrage, hauteur, ajustage : le confort d'un verre dépend d'abord de ces détails.",
  },
  {
    title: "Un essayage sans pression",
    detail:
      "Venez essayer, repartez réfléchir, revenez. C'est un achat qui se porte tous les jours.",
  },
  {
    title: "Un suivi après l'achat",
    detail: "Réglage, resserrage, nettoyage : passez quand vous voulez, c'est offert.",
  },
];

export function WhyLunea() {
  return (
    <section className="py-section">
      <Container>
        <SectionHeading title="Pourquoi Lunéa" />
        <ul>
          {reasons.map((reason, index) => (
            <li
              key={reason.title}
              className={cn(
                "grid gap-1.5 border-t border-hairline py-7",
                "lg:grid-cols-[auto_5fr_7fr] lg:items-start lg:gap-9 lg:py-9",
                index === reasons.length - 1 && "border-b border-hairline",
              )}
            >
              <LensMarkIcon className="mb-2 h-3.5 w-6.5 text-or lg:mt-2.5 lg:mb-0" />
              <h3 className="font-serif text-[1.35rem] leading-tight lg:text-[1.6rem]">
                {reason.title}
              </h3>
              <p className="measure text-body font-light text-taupe">{reason.detail}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
