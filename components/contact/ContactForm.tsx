"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import {
  emptyContact,
  hasErrors,
  LIMITS,
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact/validate";
import { contactPayload } from "@/lib/contact/transport";
import { cn } from "@/lib/utils/cn";

/** Inliné au build : défini seulement pour l'export statique (voir transport.ts). */
const DIRECT_WEBHOOK = (process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL ?? "").trim();

type Status = "idle" | "sending" | "sent" | "failed";

const fieldClass =
  "mt-1.5 min-h-11 w-full border-b border-hairline bg-transparent py-2 text-base font-light outline-none focus:border-or-deep";

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const ids = {
    nom: useId(),
    email: useId(),
    telephone: useId(),
    message: useId(),
    societe: useId(),
  };

  const set = (key: keyof ContactInput) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { errors: found, isSpam } = validateContact(values);
    setErrors(found);

    if (hasErrors(found)) {
      // Le premier champ en faute reçoit le focus : sur mobile, un message
      // d'erreur hors écran ne sert à rien.
      const firstKey = (["nom", "email", "message"] as const).find((key) => found[key]);
      if (firstKey) formRef.current?.querySelector<HTMLElement>(`#${ids[firstKey]}`)?.focus();
      return;
    }

    // Champ piège rempli : même réponse qu'un succès, rien n'est envoyé.
    if (isSpam) {
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      if (DIRECT_WEBHOOK) {
        // Export statique : pas de /api/contact, on parle au webhook directement.
        const direct = await fetch(DIRECT_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(contactPayload(values)),
        });
        if (!direct.ok) {
          setStatus("failed");
          return;
        }
        setValues(emptyContact);
        setErrors({});
        setStatus("sent");
        return;
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as { ok: boolean; errors?: ContactErrors };

      if (!response.ok || !payload.ok) {
        if (payload.errors) setErrors(payload.errors);
        setStatus("failed");
        return;
      }

      setValues(emptyContact);
      setErrors({});
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-hairline px-6 py-8">
        <p className="font-serif text-[1.35rem]">Message envoyé</p>
        <p className="measure mt-3 text-body-sm font-light text-taupe">
          Merci, nous vous répondons dès que possible. Pour une réponse immédiate,
          WhatsApp reste le plus rapide.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 min-h-11 border-b border-hairline pb-1 text-ui font-medium tracking-[0.05em] transition-colors hover:border-or"
        >
          Écrire un autre message
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-6">
      <Field
        id={ids.nom}
        label="Nom"
        error={errors.nom}
        value={values.nom}
        onChange={set("nom")}
        autoComplete="name"
        maxLength={LIMITS.nom.max}
        required
      />
      <Field
        id={ids.email}
        label="E-mail"
        type="email"
        inputMode="email"
        error={errors.email}
        value={values.email}
        onChange={set("email")}
        autoComplete="email"
        maxLength={LIMITS.email.max}
        required
      />
      <Field
        id={ids.telephone}
        label="Téléphone (facultatif)"
        type="tel"
        inputMode="tel"
        value={values.telephone}
        onChange={set("telephone")}
        autoComplete="tel"
        maxLength={LIMITS.telephone.max}
      />

      <div>
        <label htmlFor={ids.message} className="micro text-taupe">
          Message
        </label>
        <textarea
          id={ids.message}
          value={values.message}
          onChange={(event) => set("message")(event.target.value)}
          rows={5}
          maxLength={LIMITS.message.max}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${ids.message}-erreur` : undefined}
          className={cn(fieldClass, "resize-y", errors.message && "border-red-700")}
        />
        {errors.message ? (
          <p id={`${ids.message}-erreur`} className="mt-1.5 text-ui text-red-700">
            {errors.message}
          </p>
        ) : null}
      </div>

      {/* Piège à robots : masqué visuellement, ignoré par les lecteurs d'écran. */}
      <div
        aria-hidden="true"
        className="absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]"
      >
        <label htmlFor={ids.societe}>Société</label>
        <input
          id={ids.societe}
          name="societe"
          tabIndex={-1}
          autoComplete="off"
          value={values.societe}
          onChange={(event) => set("societe")(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-11 items-center justify-center rounded-xs bg-noir px-7 py-4 text-ui font-medium tracking-[0.09em] text-creme uppercase transition-colors hover:bg-noir-soft disabled:opacity-60"
        >
          {status === "sending" ? "Envoi…" : "Envoyer"}
        </button>

        <p aria-live="polite" className="text-ui font-light text-taupe">
          {status === "failed"
            ? "L’envoi a échoué. Écrivez-nous sur WhatsApp en attendant."
            : null}
        </p>
      </div>
    </form>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "email" | "tel";
  autoComplete?: string;
  maxLength?: number;
  required?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="micro text-taupe">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-erreur` : undefined}
        className={cn(fieldClass, error && "border-red-700")}
      />
      {error ? (
        <p id={`${id}-erreur`} className="mt-1.5 text-ui text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
