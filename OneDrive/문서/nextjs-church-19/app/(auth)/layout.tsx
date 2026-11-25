import Image from "next/image";
import Link from "next/link";
import Badge from "../_components/Badge";
import { img } from "../_components/images";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image src={img.heroAframe} alt="삼각 창 너머로 숲이 보이는 거실" fill priority placeholder="blur" sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <p className="font-serif text-3xl italic text-white">A moment of rest in the forest</p>
          <Link href="/" className="font-serif text-[9vw] leading-[0.8] text-accent">
            rental
            <br />
            house
          </Link>
        </div>
        <Link href="/" aria-label="홈으로" className="absolute right-10 top-10 h-28 w-28 text-[18px]">
          <Badge tone="white" />
        </Link>
      </aside>

      <main className="flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-serif text-3xl text-accent lg:invisible">
            rental house
          </Link>
          <Link href="/" className="font-serif text-lg text-muted hover:text-accent">
            ← home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center font-serif text-base text-accent">© rental house all rights reserved.</p>
      </main>
    </div>
  );
}
