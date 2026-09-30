"use client";

import { useEffect, useRef, useState } from "react";
import { shareUrl } from "@/lib/share";

interface ShareButtonProps {
  title: string;
  text: string;
}

type Status = "idle" | "copied" | "error";

/**
 * Partage natif quand le navigateur le propose, copie du lien sinon.
 *
 * Le libellé ne dépend jamais de `navigator.share` : le décider au rendu
 * provoquerait une divergence d'hydratation, puisque le serveur ne sait pas
 * de quoi le navigateur est capable. Seul le comportement au clic change.
 */
export function ShareButton({ title, text }: ShareButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flash = (next: Status) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  };

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      flash("copied");
      return;
    } catch {
      // Presse-papiers indisponible : contexte non sécurisé, ou permission refusée.
    }

    try {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(field);
      flash(copied ? "copied" : "error");
    } catch {
      flash("error");
    }
  }

  async function share() {
    /**
     * Le lien partagé est reconstruit à partir du chemin seul : inutile de
     * transmettre au destinataire les paramètres de campagne de l'expéditeur.
     */
    const url = shareUrl(window.location.origin, window.location.pathname);

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (error) {
        // Annulation volontaire : ne rien faire, surtout pas copier.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyLink(url);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button
        type="button"
        onClick={share}
        className="inline-flex min-h-11 items-center gap-2.5 border-b border-hairline pb-1 text-ui font-medium tracking-[0.05em] transition-colors duration-200 hover:border-or"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 15V3.5M12 3.5 8.5 7M12 3.5 15.5 7" />
          <path d="M5 13v6a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6" />
        </svg>
        Partager ce modèle
      </button>

      <span aria-live="polite" className="text-ui font-light text-taupe">
        {status === "copied" ? "Lien copié" : null}
        {status === "error" ? "Copie impossible — copiez l’adresse du navigateur" : null}
      </span>
    </div>
  );
}
