// All photos: Unsplash (https://unsplash.com/license) — free to use.
import heroDusk from "@/public/images/hero-dusk.jpg"; // Michael Brown
import heroCabin from "@/public/images/hero-cabin.jpg"; // Olivier Guillard
import heroAframe from "@/public/images/hero-aframe.jpg"; // Clay Banks
import heroLiving from "@/public/images/hero-living.jpg"; // Minh Pham
import night from "@/public/images/night.jpg"; // Arthur Baudry
import bedModern from "@/public/images/bed-modern.jpg"; // Puscas Adryan
import bedWhite from "@/public/images/bed-white.jpg"; // ONNO
import bedPlant from "@/public/images/bed-plant.jpg"; // Juliana Morales Ramírez
import bathTub from "@/public/images/bath-tub.jpg"; // Jean-Philippe Delberghe
import bathSink from "@/public/images/bath-sink.jpg"; // Patrick Langwallner
import kitchen from "@/public/images/kitchen.jpg"; // Cat Han
import patio from "@/public/images/patio.jpg"; // Caroline Badran
import lake from "@/public/images/lake.jpg"; // Nenad Radojčić
import sofa from "@/public/images/sofa.jpg"; // Katja Rooke
import towel from "@/public/images/towel.jpg"; // Sven Brandsma
import { heroCopy } from "./data";

export const img = { heroDusk, heroCabin, heroAframe, heroLiving, night, bedModern, bedWhite, bedPlant, bathTub, bathSink, kitchen, patio, lake, sofa, towel };

const heroImages = [
  { src: heroDusk, alt: "해 질 녘 큰 창으로 불빛이 새어 나오는 모던 하우스" },
  { src: heroCabin, alt: "숲속에 자리한 목조 캐빈" },
  { src: heroAframe, alt: "삼각 창 너머로 숲이 보이는 A형 하우스 거실" },
  { src: night, alt: "밤에 조명이 켜진 모던 하우스 외관" },
];

export const heroSlides = heroImages.map((h, i) => ({ ...h, ...heroCopy[i] }));

export const roomImages = [
  [bedPlant, heroAframe],
  [bedWhite, sofa],
  [bedModern, bathTub],
];

export const facilityImages = [bathTub, kitchen, patio, towel];
