import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/shared/PagePlaceholder";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: "Politique de confidentialité de Lunéa Optique.",
  path: "/politique-confidentialite",
  noIndex: true,
});

export default function Page() {
  return <PagePlaceholder title="Politique de confidentialité" />;
}
