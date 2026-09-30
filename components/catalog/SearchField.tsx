"use client";

import { useId } from "react";
import { CloseIcon } from "@/components/shared/icons";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Champ souligné plutôt qu'encadré : un rectangle arrondi de plus
 * casserait la ligne éditoriale du catalogue.
 */
export function SearchField({ value, onChange }: SearchFieldProps) {
  const id = useId();

  return (
    <div className="relative w-full lg:w-72">
      <label htmlFor={id} className="micro text-taupe">
        Rechercher
      </label>
      <div className="mt-1.5 flex items-center gap-2 border-b border-hairline focus-within:border-or">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="size-4 shrink-0 text-taupe"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Modèle, marque ou référence"
          autoComplete="off"
          className="min-h-11 w-full bg-transparent py-2 text-base font-light outline-none placeholder:text-taupe [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Effacer la recherche"
            className="grid size-11 shrink-0 place-items-center text-taupe"
          >
            <CloseIcon className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
