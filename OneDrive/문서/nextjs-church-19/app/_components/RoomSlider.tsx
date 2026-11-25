"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { rooms, won } from "./data";
import { roomImages } from "./images";

export default function RoomSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 35 });
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

  return (
    <div className="relative" aria-roledescription="carousel" aria-label="객실 슬라이드">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {rooms.map((r, i) => {
            const active = selected === i;
            return (
              <article key={r.en} className="flex min-w-0 flex-[0_0_100%] flex-col lg:h-svh lg:min-h-[640px] lg:flex-row" aria-roledescription="slide" aria-label={`${r.name} ${r.en}`}>
                {/* photo (mobile: top) */}
                <div className="relative aspect-[4/3] lg:order-2 lg:aspect-auto lg:w-1/2">
                  <Image src={roomImages[i][0]} alt={`${r.name} ${r.en} 객실`} fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                </div>

                {/* panel */}
                <div className="relative flex flex-col bg-accent px-6 pb-28 pt-8 text-white lg:w-1/2 lg:px-10 lg:pb-10">
                  <p className="text-6xl font-extralight leading-none tracking-tight lg:text-[7rem]">{r.no}</p>

                  <div className={`flex flex-1 flex-col items-center justify-center py-10 text-center ${active ? "animate-fade-up" : "opacity-0"}`}>
                    <h3 className="font-serif text-6xl leading-none sm:text-8xl lg:text-[9rem]">{r.en.toLowerCase()}</h3>
                    <p className="mt-4 text-lg">{r.name}</p>
                  </div>

                  <div className={`grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end ${active ? "animate-fade-up [animation-delay:0.5s]" : "opacity-0"}`}>
                    <div>
                      <p className="max-w-md leading-relaxed text-white/90">{r.desc}</p>
                      <p className="mt-4 text-sm text-white/80">
                        기준 {r.base}인 · 최대 {r.max}인 <span className="mx-2 text-white/40">|</span> {r.size} <span className="mx-2 text-white/40">|</span> {r.bed}
                      </p>
                    </div>
                    <div className="lg:text-right">
                      <p className="text-2xl font-light tabular-nums">₩{won(r.price)}~</p>
                      <a href="#reservation" className="mt-3 inline-block border-b border-ink pb-0.5 font-serif text-xl text-ink hover:border-white hover:text-white">
                        reservation
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* controls */}
      <div className="absolute right-6 top-[calc(75vw+2rem)] flex gap-2 sm:top-[calc(75vw+2rem)] lg:left-[calc(50%-7.5rem)] lg:right-auto lg:top-10">
        <button onClick={() => emblaApi?.scrollPrev()} aria-label="이전 객실" className="grid h-12 w-12 place-items-center rounded-full border border-white/60 font-serif text-2xl text-white hover:bg-white hover:text-accent">
          ‹
        </button>
        <button onClick={() => emblaApi?.scrollNext()} aria-label="다음 객실" className="grid h-12 w-12 place-items-center rounded-full border border-white/60 font-serif text-2xl text-white hover:bg-white hover:text-accent">
          ›
        </button>
      </div>
    </div>
  );
}
