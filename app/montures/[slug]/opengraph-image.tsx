import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { getFrameBySlug, listFrameSlugs } from "@/lib/products/repository";
import { categoryLabels } from "@/lib/products/types";
import { brandFonts } from "@/lib/og/fonts";
import { ogImageSource } from "@/lib/og/image-source";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Monture — ${site.BUSINESS_NAME}`;

/**
 * Prérendu à la compilation : les robots de WhatsApp et Facebook récupèrent un
 * PNG statique au lieu de déclencher un rendu à chaque partage.
 */
export async function generateStaticParams() {
  const slugs = await listFrameSlugs();
  return slugs.map((slug) => ({ slug }));
}

const CREME = "#F8F6F2";
const CREME_DEEP = "#EFEAE2";
const NOIR = "#111111";
const TAUPE = "#6B5E52";
const OR = "#D4AF7C";

/** Verrou de marque, repris du site. */
function Lockup() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          fontFamily: "Playfair Display",
          fontSize: 30,
          letterSpacing: 9,
          color: NOIR,
        }}
      >
        LUNÉA
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 22, height: 1, backgroundColor: OR }} />
        <div style={{ fontFamily: "Montserrat", fontSize: 12, letterSpacing: 6, color: TAUPE }}>
          OPTIQUE
        </div>
        <div style={{ width: 22, height: 1, backgroundColor: OR }} />
      </div>
    </div>
  );
}

/** Silhouette de repli quand la monture n'a pas encore de photographie. */
function FrameOutline() {
  return (
    <svg width="440" height="160" viewBox="0 0 220 80" fill="none">
      <circle cx="62" cy="42" r="27" stroke={TAUPE} strokeWidth="1.4" />
      <circle cx="158" cy="42" r="27" stroke={TAUPE} strokeWidth="1.4" />
      <path
        d="M89 38c12-6 30-6 42 0M35 36 12 28M185 36l23-8"
        stroke={TAUPE}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const frame = await getFrameBySlug(slug);
  const fonts = await brandFonts();

  if (!frame) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: CREME,
          }}
        >
          <Lockup />
        </div>
      ),
      { ...size, fonts },
    );
  }

  const photo = await ogImageSource(frame.images[0]?.url);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: CREME }}>
        <div
          style={{
            width: 540,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
          }}
        >
          <Lockup />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Montserrat",
                fontSize: 15,
                letterSpacing: 4,
                color: TAUPE,
                textTransform: "uppercase",
              }}
            >
              {frame.brand}
            </div>
            <div
              style={{
                fontFamily: "Playfair Display",
                fontSize: 58,
                lineHeight: 1.08,
                color: NOIR,
                marginTop: 14,
              }}
            >
              {frame.name}
            </div>
            <div style={{ width: 56, height: 1, backgroundColor: OR, marginTop: 26 }} />
            <div
              style={{
                fontFamily: "Montserrat",
                fontSize: 19,
                color: TAUPE,
                marginTop: 26,
                lineHeight: 1.5,
              }}
            >
              {`${categoryLabels[frame.category]} · Réf. ${frame.reference}`}
            </div>
          </div>

          <div style={{ fontFamily: "Montserrat", fontSize: 16, color: TAUPE }}>
            {`À essayer en boutique à ${site.CITY}`}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: CREME_DEEP,
          }}
        >
          {photo ? (
            <img
              src={photo}
              alt=""
              width={660}
              height={630}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <FrameOutline />
          )}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
