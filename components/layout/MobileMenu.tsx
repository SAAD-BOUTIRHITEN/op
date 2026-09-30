"use client";

import { IS_DEV } from "@/lib/env";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { NavItem } from "@/config/navigation";
import { Logo } from "@/components/shared/Logo";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils/cn";

interface MobileMenuProps {
  items: readonly NavItem[];
  whatsappHref: string | null;
}

/**
 * Seul îlot client de l'en-tête.
 *
 * <dialog showModal()> fournit le piège de focus, la fermeture par Échap et
 * l'inertie de l'arrière-plan — inutile de les réécrire à la main.
 *
 * En revanche l'AFFICHAGE ne dépend pas de lui. Auparavant la visibilité
 * reposait sur une variante CSS conditionnée à l'attribut `[open]`
 * posé par le navigateur. Trois maillons devaient donc réussir pour que le
 * menu apparaisse : showModal() ne devait pas lever d'exception, le navigateur
 * devait poser l'attribut, et la règle CSS devait l'emporter. Si l'un cédait,
 * le clic ne produisait rien — sans erreur, sans indice.
 *
 * Désormais React est seul maître de l'affichage, et showModal() n'est plus
 * qu'une amélioration : s'il échoue, le menu s'ouvre quand même.
 *
 * Et si JavaScript lui-même ne s'exécute pas — ancien déploiement, extension
 * de navigateur, Safari capricieux — le menu s'ouvre encore. Le burger est un
 * lien vers `#menu-mobile` et le CSS affiche le dialogue ciblé (`:target`).
 * Quand JavaScript tourne, il intercepte le clic et prend la main. Deux
 * chemins indépendants mènent au même menu.
 */
export function MobileMenu({ items, whatsappHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        // showModal() indisponible ou refusé : ouverture non modale. On perd
        // le piège de focus natif, pas le menu.
        dialog.open = true;
      }
    }
    if (!open && dialog.open) dialog.close();

    // showModal() ne verrouille pas le défilement de l'arrière-plan sur iOS.
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Échap : natif quand le dialogue est modal, repli manuel sinon.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Menu ouvert sans JavaScript puis JavaScript chargé : React reprend la main
  // et retire l'ancre de l'adresse.
  useEffect(() => {
    if (window.location.hash !== "#menu-mobile") return;
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    // Synchronisation ponctuelle avec l'état laissé par le navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true);
  }, []);

  const openMenu = (event: ReactMouseEvent | ReactKeyboardEvent) => {
    event.preventDefault();
    setOpen(true);
  };
  const closeMenu = (event: ReactMouseEvent | ReactKeyboardEvent) => {
    event.preventDefault();
    setOpen(false);
  };
  // Un lien au rôle de bouton doit aussi répondre à la barre d'espace.
  const onSpace =
    (handler: (event: ReactKeyboardEvent) => void) => (event: ReactKeyboardEvent) => {
    if (event.key === " ") handler(event);
  };

  // Le menu est masqué au-delà de `lg`. Sans cela, un redimensionnement
  // laisserait un dialogue ouvert mais invisible.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open]);

  return (
    <>
      <a
        href="#menu-mobile"
        onClick={openMenu}
        onKeyDown={onSpace(openMenu)}
        aria-label="Ouvrir le menu"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="menu-mobile"
        className="grid size-11 place-items-center lg:hidden"
      >
        <MenuIcon className="size-5" />
      </a>

      <dialog
        ref={dialogRef}
        id="menu-mobile"
        aria-label="Menu principal"
        onClose={() => setOpen(false)}
        data-open={open ? "true" : "false"}
        className={cn(
          // `fixed inset-0` est posé explicitement : sans mode modal, le
          // navigateur laisserait le dialogue en `position: absolute`, ancré
          // dans l'en-tête sticky au lieu de couvrir l'écran.
          "fixed inset-0 z-70 h-full max-h-none w-full max-w-none flex-col border-0 bg-creme p-0 text-noir backdrop:bg-noir/40",
          // Masqué par défaut ; affiché soit par React (data-open), soit par
          // le navigateur seul quand l'ancre #menu-mobile est ciblée. Les deux
          // variantes pèsent plus lourd que `hidden` : aucun conflit d'ordre.
          // Jamais au-delà de `lg`, où la navigation de bureau prend le relais.
          "hidden max-lg:target:flex max-lg:data-[open=true]:flex",
        )}
      >
        <div className="flex flex-col px-5 pb-10" style={{ minHeight: "100%" }}>
          {/*
            Même géométrie que l'en-tête fermé — grille 44px / 1fr / 44px, même
            marge, même filet. La croix apparaît exactement où était le burger
            et le logo ne bouge pas. Auparavant le logo sautait du centre vers
            la gauche et l'icône changeait de côté : il fallait chercher où
            refermer.
          */}
          <div className="-mx-5 grid grid-cols-[44px_1fr_44px] items-center gap-2 border-b border-hairline px-5 py-3.5">
            <a
              // Fragment sans élément correspondant : referme le dialogue via
              // :target sans le saut en haut de page qu'un simple "#"
              // provoquerait (comportement spécifié du navigateur).
              href="#_menu-mobile-ferme"
              onClick={closeMenu}
              onKeyDown={onSpace(closeMenu)}
              aria-label="Fermer le menu"
              className="grid size-11 place-items-center"
            >
              <CloseIcon className="size-5" />
            </a>
            <div className="flex justify-center">
              <Logo href={null} />
            </div>
            <span aria-hidden="true" />
          </div>

          <nav aria-label="Navigation mobile" className="mt-[8vh] flex flex-col gap-1.5">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={
                  (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
                    ? "page"
                    : undefined
                }
                className="font-serif text-[2.5rem] leading-tight"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto border-t border-hairline pt-8">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-3 text-body-sm"
              >
                <WhatsAppIcon className="size-4" />
                Écrire sur WhatsApp
              </a>
            ) : (
              IS_DEV ? (
                <span className="text-body-sm text-taupe">
                  Numéro WhatsApp à renseigner dans config/site.ts
                </span>
              ) : null
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
