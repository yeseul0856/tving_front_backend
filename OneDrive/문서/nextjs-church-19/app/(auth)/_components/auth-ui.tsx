"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/supabase/env";

export const NOT_CONFIGURED = "Supabase 설정이 필요합니다. .env.local에 URL과 키를 입력해 주세요.";

/** Map common Supabase auth errors to Korean. */
export function toKoreanError(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("email not confirmed")) return "이메일 인증이 완료되지 않았습니다. 받은 메일함을 확인해 주세요.";
  if (m.includes("user already registered")) return "이미 가입된 이메일입니다.";
  if (m.includes("password should be at least")) return "비밀번호는 최소 6자 이상이어야 합니다.";
  if (m.includes("rate limit")) return "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.";
  if (m.includes("provider is not enabled")) return "해당 소셜 로그인이 아직 활성화되지 않았습니다.";
  if (m.includes("invalid email") || m.includes("unable to validate email")) return "올바른 이메일 주소를 입력해 주세요.";
  return message;
}

export function callbackUrl(next?: string | null) {
  const url = new URL("/auth/callback", window.location.origin);
  url.searchParams.set("next", safeNext(next));
  return url.toString();
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        {...props}
        className="mt-2 block w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-0"
      />
    </label>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success"; children: React.ReactNode }) {
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`px-4 py-3 text-sm ${tone === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
      {children}
    </p>
  );
}

export function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center bg-accent text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : children}
    </button>
  );
}

export function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

type Provider = "kakao" | "google";

export function SocialButtons({ next, onError }: { next?: string | null; onError: (msg: string) => void }) {
  const [pending, setPending] = useState<Provider | null>(null);

  const signIn = async (provider: Provider) => {
    const supabase = createClient();
    if (!supabase) return onError(NOT_CONFIGURED);
    setPending(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl(next),
        // Kakao: request only nickname/profile image by default (email needs a Kakao business app).
        ...(provider === "kakao" ? { scopes: "profile_nickname profile_image" } : {}),
      },
    });
    if (error) {
      setPending(null);
      onError(toKoreanError(error.message));
    }
    // On success the browser is redirected to the provider.
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => signIn("kakao")}
        disabled={pending !== null}
        className="relative flex h-12 w-full items-center justify-center bg-[#FEE500] text-sm font-semibold text-black/85 transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="absolute left-4 h-5 w-5" aria-hidden="true">
          <path fill="#000" d="M12 3C6.48 3 2 6.48 2 10.78c0 2.78 1.86 5.22 4.66 6.6l-.95 3.48c-.08.3.26.55.52.38l4.15-2.74c.53.06 1.06.1 1.62.1 5.52 0 10-3.48 10-7.82S17.52 3 12 3z" />
        </svg>
        {pending === "kakao" ? "카카오로 이동 중…" : "카카오로 계속하기"}
      </button>
      <button
        type="button"
        onClick={() => signIn("google")}
        disabled={pending !== null}
        className="relative flex h-12 w-full items-center justify-center border border-line bg-white text-sm font-semibold text-ink transition-colors hover:bg-cream disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="absolute left-4 h-5 w-5" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.56-5.17 3.56-8.73z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.29a12 12 0 0 0 0 10.8z" />
          <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.8l3.44-3.44A11.5 11.5 0 0 0 12 0 12 12 0 0 0 1.29 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75z" />
        </svg>
        {pending === "google" ? "Google로 이동 중…" : "Google로 계속하기"}
      </button>
    </div>
  );
}
