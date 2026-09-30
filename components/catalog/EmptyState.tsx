export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="border-t border-hairline py-16 text-center">
      <p className="font-serif text-[1.5rem]">Aucune monture ne correspond</p>
      <p className="measure mx-auto mt-3 text-body font-light text-taupe">
        Essayez un autre mot-clé, ou parcourez l&rsquo;ensemble de la collection. Notre
        sélection en boutique est plus large que celle présentée ici.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 min-h-11 border-b border-hairline pb-1.5 text-ui font-medium tracking-[0.05em] transition-colors duration-200 hover:border-or"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
