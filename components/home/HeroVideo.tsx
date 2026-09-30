"use client";

import { useEffect, useRef, useState } from "react";
import type { HeroVideo as HeroVideoSources } from "@/content/media";
import { cn } from "@/lib/utils/cn";

/**
 * Vidéo d'arrière-plan du hero, en amélioration progressive.
 *
 * Elle ne se monte jamais si :
 * - l'utilisateur a demandé à réduire les animations ;
 * - le navigateur signale le mode économie de données.
 * Dans ces cas la photo reste, et c'est voulu.
 *
 * Elle ne se monte qu'après l'événement `load` : elle ne concurrence ni la
 * photo LCP ni les polices. Elle n'apparaît qu'une fois en lecture effective
 * — si l'autoplay est refusé (mode économie d'énergie de l'iPhone, par
 * exemple), la photo reste en place au lieu d'une image figée.
 *
 * La source est choisie en JavaScript plutôt qu'avec l'attribut `media` des
 * balises <source>, que d'anciens navigateurs ignorent : ils serviraient la
 * vidéo portrait à un écran de bureau.
 */
export function HeroVideo({ sources }: { sources: HeroVideoSources }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [variant, setVariant] = useState<"mobile" | "desktop" | null>(null);
  const [playing, setPlaying] = useState(false);
  // A-t-elle joué au moins une fois ? Le bouton ne doit exister qu'après.
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (reduce || connection?.saveData) return;

    const start = () =>
      setVariant(window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop");

    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  if (!variant) return null;
  const source = sources[variant];

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  };

  return (
    <>
      <video
        ref={ref}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => {
          setPlaying(true);
          setStarted(true);
        }}
        onPause={() => setPlaying(false)}
        className={cn(
          // Entre la photo (-z-20) et le voile de lisibilité (-z-10) : le
          // contraste du texte reste garanti sur chaque image de la vidéo.
          "absolute inset-0 -z-[15] size-full object-cover transition-opacity duration-700",
          playing ? "opacity-100" : "opacity-0",
        )}
      >
        {source.webm ? <source src={source.webm} type="video/webm" /> : null}
        <source src={source.mp4} type="video/mp4" />
      </video>

      {/*
        Contrôle de pause : exigé par WCAG 2.2.2 pour tout mouvement
        automatique de plus de cinq secondes. N'apparaît qu'une fois la
        vidéo réellement en lecture.
      */}
      {started ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}
          className="absolute right-5 bottom-5 z-10 grid size-11 place-items-center rounded-full border border-creme-faint text-creme transition-colors hover:bg-creme hover:text-noir lg:right-10 lg:bottom-8"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
            {playing ? (
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            ) : (
              <path d="M8 5.5v13l11-6.5z" />
            )}
          </svg>
        </button>
      ) : null}
    </>
  );
}
