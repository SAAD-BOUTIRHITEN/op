/**
 * Validation partagée par le formulaire et par la route d'API.
 * Un seul jeu de règles : le client ne peut pas être plus permissif que le
 * serveur, et le serveur ne refait pas une validation différente.
 */

export interface ContactInput {
  nom: string;
  email: string;
  telephone: string;
  message: string;
  /** Champ piège, invisible pour un humain. Rempli = robot. */
  societe: string;
}

export type ContactField = "nom" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  nom: { min: 2, max: 80 },
  message: { min: 10, max: 2000 },
  telephone: { max: 40 },
  email: { max: 160 },
} as const;

/** Volontairement permissif : refuser une adresse valide coûte un client. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const emptyContact: ContactInput = {
  nom: "",
  email: "",
  telephone: "",
  message: "",
  societe: "",
};

export function validateContact(input: ContactInput): {
  errors: ContactErrors;
  isSpam: boolean;
} {
  const errors: ContactErrors = {};
  const nom = input.nom.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (nom.length < LIMITS.nom.min) errors.nom = "Indiquez votre nom.";
  else if (nom.length > LIMITS.nom.max) errors.nom = "Ce nom est trop long.";

  if (email.length === 0) errors.email = "Indiquez votre adresse e-mail.";
  else if (email.length > LIMITS.email.max) errors.email = "Cette adresse est trop longue.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Cette adresse e-mail semble incomplète.";

  if (message.length < LIMITS.message.min)
    errors.message = "Décrivez votre demande en quelques mots.";
  else if (message.length > LIMITS.message.max) errors.message = "Ce message est trop long.";

  return { errors, isSpam: input.societe.trim().length > 0 };
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Normalise un corps de requête inconnu en `ContactInput`. */
export function toContactInput(body: unknown): ContactInput {
  const source = (typeof body === "object" && body !== null ? body : {}) as Record<
    string,
    unknown
  >;
  const read = (key: keyof ContactInput) =>
    typeof source[key] === "string" ? (source[key] as string) : "";

  return {
    nom: read("nom"),
    email: read("email"),
    telephone: read("telephone"),
    message: read("message"),
    societe: read("societe"),
  };
}
