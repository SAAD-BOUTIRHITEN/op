import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { reviews, type Review } from "@/content/reviews";
import { IS_DEV } from "@/lib/env";
import { reviewLinkHref } from "@/lib/reviews";

const dateFormat = new Intl.DateTimeFormat("fr-MA", { month: "long", year: "numeric" });

function Stars({ rating }: { rating: Review["rating"] }) {
  return (
    <span className="text-ui tracking-[0.15em] text-or-deep">
      <span aria-hidden="true">{"★".repeat(rating)}</span>
      <span className="sr-only">{`${rating} étoiles sur 5`}</span>
    </span>
  );
}

/**
 * Avis clients.
 *
 * Deux règles tenues depuis le début du projet :
 *
 * 1. Aucun avis inventé. La section n'existe que s'il y a de vrais avis dans
 *    `content/reviews.ts`.
 * 2. Aucune donnée structurée `Review` ni `AggregateRating`. Google ne
 *    soutient plus les avis auto-déclarés pour un commerce sur son propre
 *    site ; les émettre expose à une action manuelle sans rien rapporter.
 */
export function Reviews() {
  const writeReview = reviewLinkHref();

  if (reviews.length === 0) {
    if (!IS_DEV) return null;
    return (
      <section className="pb-section">
        <Container>
          <p className="micro text-taupe">
            Avis — section masquée en production : `content/reviews.ts` est vide.
            {writeReview ? " Lien « laisser un avis » prêt." : " GOOGLE_PLACE_ID non renseigné."}
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="pb-section">
      <Container>
        <SectionHeading
          title="Ce qu'en disent nos clients"
          lede="Avis publiés sur notre fiche Google."
          {...(writeReview ? { link: { label: "Laisser un avis", href: writeReview } } : {})}
        />
        <ul className="grid gap-3.5 lg:grid-cols-3 lg:gap-6">
          {reviews.map((review) => (
            <li
              key={`${review.author}-${review.date}`}
              className="flex flex-col border border-hairline px-6 py-7"
            >
              <Stars rating={review.rating} />
              <p className="mt-4 text-body-sm font-light text-taupe">{review.text}</p>
              <p className="micro mt-auto pt-6 text-taupe">
                {`${review.author} — ${dateFormat.format(new Date(review.date))}`}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
