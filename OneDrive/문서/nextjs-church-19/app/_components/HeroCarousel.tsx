"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { heroSlides } from "./images";

const DELAY = 6000;

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 45 }, [
    Fade(),
    Autoplay({ delay: DELAY, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const goTo = (i: number) => {
    emblaApi?.scrollTo(i);
    emblaApi?.plugins().autoplay?.reset();
  };

  const n = heroSlides.length;
  const s = heroSlides[selected];

  return (
    <section id="top" className="relative h-svh min-h-[600px] w-full overflow-hidden bg-ink" aria-roledescription="carousel" aria-label="rental house 숙소 슬라이드">
      {/* slides */}
      <div className="absolute inset-0" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {heroSlides.map((h, i) => (
            <div key={h.title} className="relative h-full min-w-0 flex-[0_0_100%]" aria-roledescription="slide" aria-label={`${i + 1} / ${n}`}>
              <Image
                src={h.src}
                alt={h.alt}
                fill
                priority={i === 0}
                placeholder="blur"
                sizes="100vw"
                className={`object-cover transition-transform duration-[8000ms] ease-out ${selected === i ? "scale-110" : "scale-100"}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/40" />

      {/* top-left: description */}
      <div className="pointer-events-none absolute left-5 top-6 max-w-xl text-accent lg:left-8 lg:top-8">
        <p className="font-serif text-2xl italic lg:text-4xl">A moment of rest in the forest</p>
        <div key={selected} className="mt-5 hidden animate-fade-up space-y-3 font-serif text-lg leading-snug text-white/90 sm:block lg:text-2xl">
          <p>{s.en}.</p>
          <p className="font-sans text-sm text-white/80 lg:text-base">{s.title}</p>
        </div>
      </div>

      {/* top-right: counter + progress */}
      <div className="absolute right-5 top-6 flex flex-col items-end gap-3 text-white lg:right-8 lg:top-8">
        <p className="text-3xl font-extralight tabular-nums lg:text-5xl">
          {String(selected + 1).padStart(2, "0")}
          <span className="mx-2 text-white/50">/</span>
          <span className="text-white/60">{String(n).padStart(2, "0")}</span>
        </p>
        <div className="flex gap-1.5">
          {heroSlides.map((h, i) => (
            <button key={h.title} onClick={() => goTo(i)} aria-label={`${i + 1}번 슬라이드`} className="relative h-0.5 w-8 overflow-hidden bg-white/30 lg:w-12">
              {i === selected && <span key={selected} className="absolute inset-y-0 left-0 bg-accent" style={{ animation: `hero-progress ${DELAY}ms linear forwards` }} />}
            </button>
          ))}
        </div>
      </div>

      {/* giant wordmark */}
      <h1 className="pointer-events-none absolute inset-x-0 bottom-24 select-none overflow-hidden whitespace-nowrap px-3 font-serif text-[18vw] leading-[0.8] text-accent sm:bottom-20 sm:text-[15.5vw] lg:bottom-6">
        <span className="block animate-fade-up">
          rental<span className="hidden sm:inline"> </span>
          <br className="sm:hidden" />
          house
        </span>
      </h1>
    </section>
  );
}
