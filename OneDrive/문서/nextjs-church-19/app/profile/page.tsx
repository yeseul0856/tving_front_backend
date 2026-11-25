import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import SiteChrome from "../_components/SiteChrome";
import ProfileForm from "./ProfileForm";
import MyReservations from "./MyReservations";

export const metadata: Metadata = { title: "내 프로필 | rental house" };

export default function ProfilePage() {
  return (
    <>
      <SiteChrome />
      <header className="px-6 pt-8 lg:px-10">
        <Link href="/" className="font-serif text-3xl text-accent">
          rental house
        </Link>
      </header>
      <main className="flex-1 px-6 pb-40 pt-12 lg:px-10 lg:pt-20">
        <div className="mx-auto max-w-2xl">
          <Suspense fallback={<p className="text-center text-muted">불러오는 중…</p>}>
            <ProfileForm />
            <MyReservations />
          </Suspense>
        </div>
      </main>
    </>
  );
}
