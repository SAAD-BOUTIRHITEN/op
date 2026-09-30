import type { JsonLdObject } from "@/lib/seo/jsonld";

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      // Contenu généré par l'application, jamais saisi par un visiteur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
