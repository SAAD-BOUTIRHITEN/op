import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/shared/PagePlaceholder";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales de Lunéa Optique.",
  path: "/mentions-legales",
  noIndex: true,
});

export default function Page() {
  return <PagePlaceholder title="Mentions légales" />;
}
