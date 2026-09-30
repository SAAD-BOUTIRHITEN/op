import type { ContactInput } from "./validate";

/**
 * Acheminement du formulaire.
 *
 * Volontairement sans dépendance : un webhook générique (Formspree, Make,
 * Zapier, n8n, une fonction maison) reçoit le message en JSON. Passer plus
 * tard à un fournisseur d'e-mail ne touche que ce fichier.
 *
 * Tant que `CONTACT_WEBHOOK_URL` n'est pas défini, le formulaire n'est pas
 * affiché du tout : mieux vaut aucune boîte de saisie qu'une boîte de saisie
 * qui perd les messages.
 */
export function isContactTransportConfigured(): boolean {
  return contactWebhookUrl().length > 0;
}

/**
 * Serveur : CONTACT_WEBHOOK_URL (privée). Export statique : pas de serveur, le
 * navigateur appelle le webhook lui-même — NEXT_PUBLIC_CONTACT_WEBHOOK_URL,
 * donc visible dans le code du site. C'est le cas normal d'un Formspree ou
 * d'un Web3Forms, dont l'adresse est publique par conception.
 */
export function contactWebhookUrl(): string {
  return (process.env.CONTACT_WEBHOOK_URL ?? process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL ?? "").trim();
}

/** Corps JSON envoyé au webhook — partagé par le serveur et le navigateur. */
export function contactPayload(input: ContactInput) {
  return {
    nom: input.nom.trim(),
    email: input.email.trim(),
    telephone: input.telephone.trim(),
    message: input.message.trim(),
    recu_le: new Date().toISOString(),
  };
}

export async function deliverContactMessage(input: ContactInput): Promise<void> {
  const endpoint = contactWebhookUrl();
  if (endpoint.length === 0) throw new Error("CONTACT_WEBHOOK_URL n'est pas configuré.");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contactPayload(input)),
  });

  if (!response.ok) {
    throw new Error(`Le webhook a répondu ${response.status}.`);
  }
}
