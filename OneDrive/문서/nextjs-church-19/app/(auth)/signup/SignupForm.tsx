"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/supabase/env";
import { Alert, Divider, Field, NOT_CONFIGURED, SocialButtons, SubmitButton, callbackUrl, toKoreanError } from "../_components/auth-ui";

export default function SignupForm() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    if (password !== String(form.get("confirm"))) return setError("비밀번호가 일치하지 않습니다.");
    if (!form.get("terms")) return setError("이용약관 및 개인정보 처리방침에 동의해 주세요.");

    const supabase = createClient();
    if (!supabase) return setError(NOT_CONFIGURED);

    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: callbackUrl(next) },
    });
    setLoading(false);

    if (error) return setError(toKoreanError(error.message));
    // Supabase returns a user with no identities when the email is already registered (and confirmation is on).
    if (data.user && data.user.identities?.length === 0) return setError("이미 가입된 이메일입니다.");

    if (data.session) {
      // Email confirmation is disabled in Supabase: user is signed in right away.
      router.replace(`/profile?welcome=1&next=${encodeURIComponent(safeNext(next))}`);
      router.refresh();
    } else {
      setSentTo(email);
    }
  };

  if (sentTo) {
    return (
      <div className="text-center">
        <p className="font-serif text-5xl leading-none text-accent">check your inbox</p>
        <h1 className="mt-5 text-2xl font-semibold">인증 메일을 보냈습니다</h1>
        <p className="mt-6 leading-relaxed text-muted">
          <b className="text-ink">{sentTo}</b>
          <br />
          으로 보낸 메일의 링크를 눌러 가입을 완료해 주세요.
        </p>
        <Link href="/login" className="mt-10 inline-flex h-12 w-full items-center justify-center bg-accent text-sm font-semibold text-white">
          로그인으로 이동
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="font-serif text-6xl leading-none text-accent">join us</p>
      <h1 className="mt-5 text-2xl font-semibold">회원가입</h1>
      <p className="mt-3 text-sm text-muted">rental house 회원이 되어 더 편하게 예약하세요.</p>

      <div className="mt-10">
        <SocialButtons next={next} onError={setError} />
      </div>

      <div className="my-8">
        <Divider>또는 이메일로 가입</Divider>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {error && <Alert>{error}</Alert>}
        <Field label="이름" name="name" autoComplete="name" placeholder="홍길동" required />
        <Field label="이메일" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <Field label="비밀번호" name="password" type="password" autoComplete="new-password" placeholder="6자 이상" required minLength={6} />
        <Field label="비밀번호 확인" name="confirm" type="password" autoComplete="new-password" placeholder="한 번 더 입력" required minLength={6} />
        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="terms" className="mt-0.5 h-4 w-4 accent-ink" />
          <span>
            <a href="/terms" target="_blank" rel="noopener" className="text-ink underline underline-offset-4">이용약관</a> 및{" "}
            <a href="/privacy" target="_blank" rel="noopener" className="text-ink underline underline-offset-4">개인정보 처리방침</a>에 동의합니다. (필수)
          </span>
        </label>
        <SubmitButton loading={loading}>가입하기</SubmitButton>
      </form>

      <p className="mt-10 text-center text-sm text-muted">
        이미 계정이 있으신가요?{" "}
        <Link href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-semibold text-accent underline underline-offset-4">
          로그인
        </Link>
      </p>
    </div>
  );
}
