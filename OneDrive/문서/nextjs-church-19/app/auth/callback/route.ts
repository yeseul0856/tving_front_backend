import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, safeNext } from "@/lib/supabase/env";
import { postLoginPath } from "@/lib/profile";

/**
 * OAuth (Kakao/Google) and email-confirmation links land here with a `code`.
 * Exchange it for a session cookie, then send the user on.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const providerError = searchParams.get("error_description") ?? searchParams.get("error");

  const fail = (msg: string) => NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(msg)}`);

  if (!isSupabaseConfigured) return fail("Supabase 환경변수가 설정되지 않았습니다.");
  if (providerError) return fail(providerError);
  if (!code) return fail("인증 코드가 없습니다. 다시 시도해 주세요.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return fail(error.message);

  // First sign-in → profile page to fill in personal info.
  const dest = await postLoginPath(supabase, data.user.id, next);
  return NextResponse.redirect(`${origin}${dest}`);
}
