"use client";

import { useEffect, useId, useMemo, useState } from "react";
import type { Frame } from "@/lib/products/types";
import {
  type CatalogFilters,
  type FacetKey,
  filtersToQuery,
  mergeFiltersIntoSearch,
  parseCatalogFilters,
  toURLSearchParams,
} from "@/lib/products/catalog-params";
import { applyQuery } from "@/lib/products/filter";
import { FacetBar } from "./FacetBar";
import { SearchField } from "./SearchField";
import { ProductGrid } from "./ProductGrid";
import { EmptyState } from "./EmptyState";

interface CatalogViewProps {
  /** Catalogue complet : le filtrage se fait en mémoire, sans aller-retour serveur. */
  frames: Frame[];
  brands: string[];
  /** Onglet de la page courante : il vient de l'URL, pas d'un état local. */
  facetKey: FacetKey;
  initialFilters: CatalogFilters;
}

const SEARCH_DEBOUNCE_MS = 250;

export function CatalogView({ frames, brands, facetKey, initialFilters }: CatalogViewProps) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const brandSelectId = useId();

  /**
   * Relit marque et recherche dans l'URL au chargement. Sans effet quand le
   * serveur les a déjà lues (elles sont alors identiques) ; indispensable en
   * export statique, où la page est fabriquée sans connaître l'URL demandée.
   * Déclaré AVANT l'effet qui écrit l'URL : il lit l'adresse d'origine.
   */
  useEffect(() => {
    const fromUrl = parseCatalogFilters(
      toURLSearchParams(Object.fromEntries(new URLSearchParams(window.location.search))),
    );
    if (fromUrl.brand === null && fromUrl.search === "") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique de l'URL au montage
    setFilters((current) => ({ ...current, brand: fromUrl.brand, search: fromUrl.search }));
    setSearchInput(fromUrl.search);
  }, []);

  // La frappe met à jour le champ immédiatement, les filtres après une pause.
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) =>
        current.search === searchInput ? current : { ...current, search: searchInput },
      );
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  /**
   * La marque et la recherche suivent dans l'URL pour rester partageables,
   * via replaceState : instantané, sans aller-retour serveur. L'onglet, lui,
   * est dans le chemin et se change par un vrai lien.
   */
  useEffect(() => {
    const search = mergeFiltersIntoSearch(window.location.search, filters);
    if (search !== window.location.search) {
      window.history.replaceState(null, "", `${window.location.pathname}${search}`);
    }
  }, [filters]);

  const results = useMemo(
    () => applyQuery(frames, filtersToQuery(filters)),
    [frames, filters],
  );

  // « Tout afficher » : on retire marque et recherche. L'onglet est la page
  // elle-même ; pour tout voir, le lien « Toutes » est là.
  const refined = filters.brand !== null || filters.search.length > 0;
  const reset = () => {
    setFilters((current) => ({ ...current, brand: null, search: "" }));
    setSearchInput("");
  };

  return (
    <>
      <div className="border-y border-hairline py-5">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <FacetBar active={facetKey} filters={filters} />

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-8">
            {brands.length > 1 ? (
              <div className="w-full sm:w-48">
                <label htmlFor={brandSelectId} className="micro text-taupe">
                  Marque
                </label>
                <select
                  id={brandSelectId}
                  value={filters.brand ?? ""}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      brand: event.target.value === "" ? null : event.target.value,
                    }))
                  }
                  className="mt-1.5 min-h-11 w-full border-b border-hairline bg-transparent py-2 text-base font-light outline-none focus:border-or-deep"
                >
                  <option value="">Toutes les marques</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <SearchField value={searchInput} onChange={setSearchInput} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <p aria-live="polite" className="text-ui font-light text-taupe">
          {results.length === 0
            ? "Aucun modèle"
            : `${results.length} modèle${results.length > 1 ? "s" : ""}`}
        </p>

        {refined ? (
          <button
            type="button"
            onClick={reset}
            className="min-h-11 border-b border-hairline pb-1 text-ui font-medium tracking-[0.05em] transition-colors duration-200 hover:border-or"
          >
            Tout afficher
          </button>
        ) : null}
      </div>

      {results.length > 0 ? <ProductGrid frames={results} /> : <EmptyState onReset={reset} />}
    </>
  );
}
