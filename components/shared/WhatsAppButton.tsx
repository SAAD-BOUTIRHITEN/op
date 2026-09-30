import { Button, type ButtonVariant } from "./Button";
import { WhatsAppIcon } from "./icons";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappHref } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  /** Message pré-rempli. Sur une fiche produit, il contient le modèle et la référence. */
  message?: string;
  label?: string;
  variant?: ButtonVariant;
  className?: string;
  fullWidthOnMobile?: boolean;
}

/**
 * Tant que `WHATSAPP_NUMBER` n'est pas configuré, le bouton renvoie vers
 * la page contact plutôt que vers un lien invalide.
 */
export function WhatsAppButton({
  message = DEFAULT_WHATSAPP_MESSAGE,
  label = "Nous contacter sur WhatsApp",
  variant = "dark",
  className,
  fullWidthOnMobile = true,
}: WhatsAppButtonProps) {
  const href = whatsappHref(message);

  return (
    <Button
      href={href ?? "/contact"}
      variant={variant}
      className={className}
      fullWidthOnMobile={fullWidthOnMobile}
    >
      <WhatsAppIcon className="size-4 shrink-0" />
      {label}
    </Button>
  );
}
