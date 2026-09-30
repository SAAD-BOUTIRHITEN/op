import Link from "next/link";
import { SmartLink } from "@/components/shared/SmartLink";
import {
  GlassesIcon,
  HomeIcon,
  InfoIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/shared/icons";
import { whatsappHref } from "@/lib/whatsapp";

const itemClass =
  "flex min-h-11 flex-col items-center justify-center gap-1 text-nano tracking-[0.06em] text-taupe";

/** Barre d'actions fixe, mobile uniquement. Reprend le parcours du moodboard. */
export function MobileActionBar() {
  const href = whatsappHref() ?? "/contact";

  return (
    <nav
      aria-label="Actions rapides"
      className="fixed inset-x-0 bottom-0 z-65 grid grid-cols-5 items-center border-t border-hairline bg-creme pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <Link href="/" className={itemClass}>
        <HomeIcon className="size-[1.1rem]" />
        Accueil
      </Link>
      <Link href="/montures" className={itemClass}>
        <GlassesIcon className="size-[1.1rem]" />
        Montures
      </Link>

      <SmartLink
        href={href}
        aria-label="Écrire sur WhatsApp"
        className="mx-auto -mt-[18px] grid size-12 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_6px_18px_rgb(17_17_17/0.18)]"
      >
        <WhatsAppIcon className="size-[1.45rem]" />
      </SmartLink>

      <Link href="/a-propos" className={itemClass}>
        <InfoIcon className="size-[1.1rem]" />
        À propos
      </Link>
      <Link href="/contact" className={itemClass}>
        <MapPinIcon className="size-[1.1rem]" />
        Contact
      </Link>
    </nav>
  );
}
