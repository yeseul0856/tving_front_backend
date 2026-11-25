import Image from "next/image";
import SiteChrome from "./_components/SiteChrome";
import HeroCarousel from "./_components/HeroCarousel";
import RoomSlider from "./_components/RoomSlider";
import Footer from "./_components/Footer";
import BookingBar from "./_components/BookingBar";
import Icon from "./_components/Icon";
import { facilityImages, img } from "./_components/images";
import Link from "next/link";
import { BRAND, facilities, stayInfo } from "./_components/data";
import NoticeList from "./notices/NoticeList";
import FaqList from "./faq/FaqList";

function SectionTitle({ en, ko, className = "" }: { en: string; ko: string; className?: string }) {
  return (
    <div className={className}>
      <h2 className="font-serif text-6xl leading-[0.85] text-accent sm:text-8xl lg:text-[9rem]">{en}</h2>
      <p className="mt-4 pl-1 text-sm tracking-wide text-muted">{ko}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteChrome />
      <main className="flex-1">
        <HeroCarousel />

        {/* About */}
        <section id="about" className="px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-serif text-3xl leading-snug text-accent lg:text-5xl">
              For a slow morning
              <br />
              and a quiet night in the forest
            </p>
            <div className="mt-12 space-y-6 font-serif text-lg leading-relaxed text-ink/80 lg:text-2xl">
              <p>
                {BRAND} is a small house hidden among pine trees, two hours from the city.
                <br className="hidden lg:block" /> Wide windows open onto the forest, and the light changes the room all day long.
              </p>
            </div>
            <p className="mt-12 leading-loose text-muted">
              도시에서 두 시간, 소나무 숲 사이에 숨어 있는 작은 집.
              <br />
              큰 창 너머로 숲이 들어오고, 하루 종일 빛이 방 안을 바꿔 놓습니다.
              <br />
              아무것도 하지 않아도 괜찮은 하루를 보내세요.
            </p>
          </div>

          {/* staggered photos */}
          <div className="mx-auto mt-24 grid max-w-7xl gap-6 sm:grid-cols-12 lg:mt-32">
            <div className="relative aspect-[4/5] sm:col-span-5">
              <Image src={img.heroLiving} alt="큰 창이 있는 밝은 거실" fill placeholder="blur" sizes="(min-width:640px) 42vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col justify-end gap-6 sm:col-span-7">
              <div className="relative aspect-[3/2]">
                <Image src={img.kitchen} alt="큰 창이 있는 오픈 키친" fill placeholder="blur" sizes="(min-width:640px) 58vw, 100vw" className="object-cover" />
              </div>
              <p className="font-serif text-xl italic text-muted lg:text-2xl">— light, wood, and the sound of the forest.</p>
            </div>
          </div>
        </section>

        {/* Rooms */}
        <section id="rooms" className="scroll-mt-0">
          <div className="flex flex-col gap-6 px-6 pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-10">
            <SectionTitle en="rooms" ko="객실 안내 — 서로 다른 세 가지 쉼의 방식" />
            <p className="max-w-sm text-sm leading-relaxed text-muted lg:text-right">
              모든 객실은 독채로 운영되며, 개별 테라스와 주차 공간이 함께 제공됩니다.
            </p>
          </div>
          <RoomSlider />
        </section>

        {/* Full-bleed quote */}
        <section className="relative h-svh min-h-[520px] overflow-hidden">
          <Image src={img.lake} alt="단풍 든 숲속 호숫가의 작은 오두막" fill placeholder="blur" sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <p className="font-serif text-4xl italic leading-tight lg:text-7xl">
              stay a little longer,
              <br />
              rest a little deeper.
            </p>
            <p className="mt-8 text-sm text-white/80">조금 느리게, 조금 더 오래 머물러도 괜찮아요</p>
          </div>
        </section>

        {/* Facilities */}
        <section id="facilities" className="px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <SectionTitle en="facilities" ko="부대시설 — 모든 객실에서 무료로 이용하실 수 있습니다" />
            <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
              {facilities.map((f, i) => (
                <div key={f.name} className={i % 2 === 1 ? "lg:mt-16" : ""}>
                  <div className="group relative aspect-[3/4] overflow-hidden">
                    <Image src={facilityImages[i]} alt={f.name} fill placeholder="blur" sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                  </div>
                  <p className="mt-5 font-serif text-2xl text-accent lg:text-3xl">{f.en.toLowerCase()}</p>
                  <p className="mt-1 font-medium">{f.name}</p>
                  <p className="mt-1 text-sm text-muted">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reservation */}
        <section id="reservation" className="bg-sand px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <SectionTitle en="reservation" ko="예약 — 날짜와 인원을 선택해 주세요" />
            <div className="mt-14">
              <BookingBar />
            </div>
            <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ink/20 pt-10 sm:grid-cols-3 lg:grid-cols-6">
              {stayInfo.map((s) => (
                <div key={s.name}>
                  <dt className="text-xs text-muted">{s.name}</dt>
                  <dd className="mt-2 text-lg font-medium tabular-nums lg:text-xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Notice + FAQ */}
        <section className="px-6 py-28 lg:px-10 lg:py-40">
          <div className="mx-auto grid max-w-7xl gap-20 lg:grid-cols-2">
            <div>
              <div className="flex items-end justify-between">
                <SectionTitle en="notice" ko="공지사항" />
                <Link href="/notices" className="pb-8 font-serif text-xl text-accent underline-offset-4 hover:underline">
                  view all
                </Link>
              </div>
              <div className="mt-12">
                <NoticeList limit={4} />
              </div>
            </div>
            <div>
              <div className="flex items-end justify-between">
                <SectionTitle en="faq" ko="자주 묻는 질문" />
                <Link href="/faq" className="pb-8 font-serif text-xl text-accent underline-offset-4 hover:underline">
                  view all
                </Link>
              </div>
              <div className="mt-12">
                <FaqList limit={4} />
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section id="location" className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px]">
            <Image src={img.heroCabin} alt="숲속의 목조 캐빈" fill placeholder="blur" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col justify-center bg-ink px-6 py-20 text-white lg:px-16">
            <h2 className="font-serif text-6xl leading-[0.85] text-accent sm:text-8xl">location</h2>
            <p className="mt-4 text-sm text-white/60">오시는 길</p>
            <ul className="mt-12 space-y-5 text-sm text-white/85">
              <li className="flex gap-4">
                <Icon name="pin" className="h-5 w-5 shrink-0 text-accent" />
                <span>○○도 ○○군 ○○면 숲속길 19</span>
              </li>
              <li className="flex gap-4">
                <Icon name="phone" className="h-5 w-5 shrink-0 text-accent" />
                <span>000-0000-0000 (10:00 – 19:00)</span>
              </li>
              <li className="flex gap-4">
                <Icon name="clock" className="h-5 w-5 shrink-0 text-accent" />
                <span>서울에서 자동차로 약 2시간 · ○○터미널에서 택시 15분</span>
              </li>
            </ul>
            <a href="#" className="mt-12 w-fit border-b border-accent pb-1 font-serif text-2xl text-accent hover:text-white">
              open in map
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
