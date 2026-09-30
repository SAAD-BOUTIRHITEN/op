import { primaryNav } from "@/config/navigation";
import { Logo } from "@/components/shared/Logo";
import { SmartLink } from "@/components/shared/SmartLink";
import { WhatsAppIcon } from "@/components/shared/icons";
import { whatsappHref } from "@/lib/whatsapp";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Navbar() {
  const href = whatsappHref() ?? "/contact";

  return (
    <header className="sticky top-0 z-60 border-b border-hairline bg-creme">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-[44px_1fr_44px] items-center gap-2 px-5 py-3.5 lg:grid-cols-[auto_1fr_auto] lg:px-10 lg:py-5">
        <MobileMenu items={primaryNav} whatsappHref={whatsappHref()} />

        <div className="flex justify-center lg:justify-start">
          <Logo />
        </div>

        <NavLinks items={primaryNav} />

        <SmartLink
          href={href}
          className="hidden min-h-11 items-center gap-2.5 rounded-full bg-noir px-5 py-3 text-ui font-medium tracking-[0.06em] text-creme transition-colors duration-200 hover:bg-noir-soft lg:inline-flex"
        >
          <WhatsAppIcon className="size-4" />
          WhatsApp
        </SmartLink>

        {/*
          Pas d'entrée WhatsApp ici sur mobile : la barre d'actions fixe en
          propose déjà une, en permanence et à portée de pouce. Deux points
          d'entrée identiques dans le chrome persistant relèvent du bruit, et
          le moodboard ne place rien de tel dans l'en-tête mobile.
          Cette cellule vide conserve le logo centré.
        */}
        <span aria-hidden="true" className="lg:hidden" />
      </div>
    </header>
  );
}
