import type { SVGProps } from "react";
import type { FrameCategory } from "@/lib/products/types";

type ArtProps = SVGProps<SVGSVGElement>;

const shared = {
  viewBox: "0 0 220 80",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function Ronde(props: ArtProps) {
  return (
    <svg {...shared} {...props}>
      <circle cx="62" cy="42" r="27" />
      <circle cx="158" cy="42" r="27" />
      <path d="M89 38c12-6 30-6 42 0M35 36 12 28M185 36l23-8" />
    </svg>
  );
}

function Rectangle(props: ArtProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M30 34h64v6c0 14-10 22-26 22S30 54 30 40zM126 34h64v6c0 14-10 22-26 22s-38-8-38-22z" />
      <path d="M30 30c10-8 54-8 64 0M126 30c10-8 54-8 64 0M94 36h32" />
    </svg>
  );
}

function Papillon(props: ArtProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M34 32c6-10 46-10 52 0 2 18-6 26-26 26S32 50 34 32zM134 32c6-10 46-10 52 0 2 18-6 26-26 26s-28-8-26-26z" />
      <path d="M86 34c12-5 24-5 36 0M34 30 13 25M186 30l21-5" />
    </svg>
  );
}

function Pilote(props: ArtProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M34 30h56c0 20-8 30-26 30S34 50 34 30zM130 30h56c0 20-8 30-26 30s-30-10-30-30z" />
      <path d="M90 32c12-5 28-5 40 0M34 30 14 24M186 30l20-6" />
    </svg>
  );
}

function Browline(props: ArtProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M28 28h68c0 18-12 30-30 30S28 46 28 28z" />
      <path d="M124 28h68c0 18-12 30-30 30s-38-12-38-30z" />
      <path d="M28 28c12-9 56-9 68 0M124 28c12-9 56-9 68 0M96 33h28" />
    </svg>
  );
}

const optical = [Ronde, Rectangle, Papillon] as const;
const solar = [Pilote, Browline, Papillon] as const;

/** Sélection déterministe : la même monture reçoit toujours la même silhouette. */
export function FrameArt({
  seed,
  category,
  ...props
}: ArtProps & { seed: string; category: FrameCategory }) {
  const pool = category === "lunettes-de-soleil" ? solar : optical;
  const hash = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0);
  const Silhouette = pool[hash % pool.length] ?? pool[0];
  return <Silhouette {...props} />;
}
