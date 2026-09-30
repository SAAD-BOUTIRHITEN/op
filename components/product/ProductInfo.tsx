import type { Frame } from "@/lib/products/types";
import { availabilityLabels, categoryLabels } from "@/lib/products/types";
import { formatPrice } from "@/lib/products/format";
import { Button } from "@/components/shared/Button";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { ShareButton } from "@/components/shared/ShareButton";
import { frameEnquiryMessage, telHref } from "@/lib/whatsapp";
import { frameShareText, frameShareTitle } from "@/lib/share";
import { ColorSwatches } from "./ColorSwatches";

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-hairline py-3">
      <dt className="micro text-taupe">{label}</dt>
      <dd className="text-body-sm font-light">{value}</dd>
    </div>
  );
}

export function ProductInfo({ frame }: { frame: Frame }) {
  const phone = telHref();

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <p className="micro text-taupe">{frame.brand}</p>
      <h1 className="mt-2 font-serif text-[2rem] leading-tight lg:text-[2.6rem]">
        {frame.name}
      </h1>
      <p className="mt-3 font-serif text-[1.2rem]">{formatPrice(frame.price)}</p>


      <div className="mt-6">
        <WhatsAppButton
          message={frameEnquiryMessage(frame)}
          label="Demander ce modèle sur WhatsApp"
          variant="dark"
        />
        {phone ? (
          <div className="mt-3">
            <Button href={phone} variant="line">
              Appeler la boutique
            </Button>
          </div>
        ) : null}
        <div className="mt-5">
          <ShareButton
            title={frameShareTitle(frame)}
            text={frameShareText(frame)}
          />
        </div>
      </div>

      {/*
        Description et coloris APRÈS l'appel à l'action : sur mobile, le bouton
        « Demander ce modèle » doit tenir dans le premier écran. Placé sous une
        description de six lignes, il disparaissait derrière la barre du bas.
      */}
      <p className="measure mt-10 text-body font-light text-taupe">{frame.description}</p>

      {frame.colors.length > 0 ? (
        <div className="mt-7">
          <ColorSwatches colors={frame.colors} />
        </div>
      ) : null}

      <dl className="mt-10">
        <Spec label="Référence" value={frame.reference} />
        <Spec label="Catégorie" value={categoryLabels[frame.category]} />
        <Spec label="Disponibilité" value={availabilityLabels[frame.availability]} />
      </dl>

      <p className="mt-6 text-ui font-light text-taupe">
        Essayage et ajustage en boutique. Les verres sont proposés après mesure.
      </p>
      {/*
        Mention usuelle du commerce : le visuel présente le modèle, la monture
        est commandée ensuite. Elle protège le vendeur et évite au client
        d'attendre un objet strictement identique au pixel près.
      */}
      <p className="mt-2 text-ui font-light text-taupe">
        Visuel de présentation — photo non contractuelle.
      </p>
    </div>
  );
}
