"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/supabase/env";
import { postLoginPath } from "@/lib/profile";
import { Alert, Divider, Field, NOT_CONFIGURED, SocialButtons, SubmitButton, toKoreanError } from "../_components/auth-ui";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [error, setError] = useState<string | null>(params.get("error"));
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    if (!supabase) return setError(NOT_CONFIGURED);

    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    if (error) {
      setLoading(false);
      return setError(toKoreanError(error.message));
    }
    // First sign-in → profile page to fill in personal info.
    router.replace(await postLoginPath(supabase, data.user.id, safeNext(next)));
    router.refresh();
  };

  return (
    <div>
      <p className="font-serif text-6xl leading-none text-accent">sign in</p>
      <h1 className="mt-5 text-2xl font-semibold">로그인</h1>
      <p className="mt-3 text-sm text-muted">rental house 계정으로 로그인하세요.</p>

      <div className="mt-10">
        <SocialButtons next={next} onError={setError} />
      </div>

      <div className="my-8">
        <Divider>또는 이메일로 로그인</Divider>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && <Alert>{error}</Alert>}
        <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field label="비밀번호" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required minLength={6} />
        <SubmitButton loading={loading}>로그인</SubmitButton>
      </form>

      <p className="mt-10 text-center text-sm text-muted">
        아직 회원이 아니신가요?{" "}
        <Link href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="font-semibold text-accent underline underline-offset-4">
          회원가입
        </Link>
      </p>
    </div>
  );
}
