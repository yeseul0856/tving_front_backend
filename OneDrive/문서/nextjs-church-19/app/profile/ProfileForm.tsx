"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/supabase/env";
import {
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  AVATAR_TYPES,
  GENDER_LABEL,
  readProfileFromStorage,
  syncProfileToStorage,
  type Gender,
  type Profile,
} from "@/lib/profile";

const fmt = (d: Date) => d.toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" });
import { Alert } from "../(auth)/_components/auth-ui";

type DaumPostcodeData = { zonecode: string; roadAddress: string; jibunAddress: string; buildingName: string; userSelectedType: "R" | "J" };
declare global {
  interface Window {
    daum?: { Postcode: new (opts: { oncomplete: (d: DaumPostcodeData) => void }) => { open: () => void } };
  }
}
const POSTCODE_SRC = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

function loadPostcode(): Promise<void> {
  if (window.daum?.Postcode) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = POSTCODE_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("주소 검색을 불러오지 못했습니다."));
    document.head.appendChild(s);
  });
}

/** Storage path of a file in our avatars bucket, or null if the URL points elsewhere (e.g. Google/Kakao). */
function ownAvatarPath(url: string | null) {
  const marker = `/storage/v1/object/public/${AVATAR_BUCKET}/`;
  if (!url || !url.includes(marker)) return null;
  return decodeURIComponent(url.split(marker)[1].split("?")[0]);
}

const PROVIDER_LABEL: Record<string, string> = { email: "이메일", google: "Google", kakao: "카카오" };

const inputCls =
  "mt-2 block w-full border-0 border-b border-line bg-transparent px-0 py-3 text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-0";

export default function ProfileForm() {
  const router = useRouter();
  const params = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const next = safeNext(params.get("next"));
  const supabase = useMemo(() => createClient(), []);
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(supabase ? null : "Supabase 설정이 필요합니다.");
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [backup, setBackup] = useState<{ ok: boolean; text: string } | null>(null);

  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return router.replace(`/login?next=${encodeURIComponent("/profile")}`);
      setUser(auth.user);
      const { data, error } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle<Profile>();
      if (error) setError(`프로필을 불러오지 못했습니다: ${error.message}`);
      const meta = auth.user.user_metadata ?? {};
      setFullName(data?.full_name ?? meta.full_name ?? meta.name ?? "");
      setAge(data?.age ? String(data.age) : "");
      setGender(data?.gender ?? "");
      setPostcode(data?.postcode ?? "");
      setAddress(data?.address ?? "");
      setAddressDetail(data?.address_detail ?? "");
      setAvatarUrl(data?.avatar_url ?? meta.avatar_url ?? meta.picture ?? null);
      setLoaded(true);
      const stored = await readProfileFromStorage(supabase, auth.user.id);
      setBackup(stored ? { ok: true, text: `마지막 Storage 백업 · ${fmt(new Date(stored.synced_at))}` } : { ok: false, text: "아직 Storage에 백업된 프로필이 없습니다." });
    })();
  }, [supabase, router]);

  /** Save to the profiles table (source of truth), then back up the row as JSON in Storage. */
  const save = async (patch: Partial<Profile>) => {
    if (!supabase || !user) return false;
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...patch });
    if (error) {
      setError(`저장하지 못했습니다: ${error.message}`);
      return false;
    }
    const sync = await syncProfileToStorage(supabase, user.id);
    if (sync.error) setBackup({ ok: false, text: `Storage 백업 실패: ${sync.error}` });
    else setBackup({ ok: true, text: `Storage 백업 완료 · ${fmt(sync.syncedAt!)}` });
    return true;
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !supabase || !user) return;
    if (!AVATAR_TYPES.includes(file.type)) return setError("JPG, PNG, WEBP, GIF 이미지만 올릴 수 있습니다.");
    if (file.size > AVATAR_MAX_BYTES) return setError("이미지는 2MB 이하만 올릴 수 있습니다.");

    setUploading(true);
    setError(null);
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(AVATAR_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "3600" });
    if (upErr) {
      setUploading(false);
      return setError(`업로드하지 못했습니다: ${upErr.message}`);
    }
    const url = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data.publicUrl;
    const old = ownAvatarPath(avatarUrl);
    if (await save({ avatar_url: url })) {
      setAvatarUrl(url);
      setNotice("프로필 사진을 변경했습니다.");
      if (old) await supabase.storage.from(AVATAR_BUCKET).remove([old]);
    } else {
      await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    }
    setUploading(false);
  };

  const removeAvatar = async () => {
    if (!supabase) return;
    const old = ownAvatarPath(avatarUrl);
    if (await save({ avatar_url: null })) {
      setAvatarUrl(null);
      setNotice("프로필 사진을 삭제했습니다.");
      if (old) await supabase.storage.from(AVATAR_BUCKET).remove([old]);
    }
  };

  const searchAddress = async () => {
    try {
      await loadPostcode();
      new window.daum!.Postcode({
        oncomplete: (d) => {
          const base = d.userSelectedType === "R" ? d.roadAddress : d.jibunAddress;
          setPostcode(d.zonecode);
          setAddress(d.buildingName && d.userSelectedType === "R" ? `${base} (${d.buildingName})` : base);
          setAddressDetail("");
        },
      }).open();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ageNum = age ? Number(age) : null;
    if (ageNum !== null && (!Number.isInteger(ageNum) || ageNum < 1 || ageNum > 120)) return setError("나이는 1~120 사이 숫자로 입력해 주세요.");

    setSaving(true);
    setError(null);
    setNotice(null);
    const ok = await save({
      full_name: fullName.trim() || null,
      age: ageNum,
      gender: gender || null,
      postcode: postcode || null,
      address: address || null,
      address_detail: addressDetail.trim() || null,
      onboarded: true,
    });
    setSaving(false);
    if (!ok) return;
    if (welcome) {
      router.replace(next);
      router.refresh();
    } else {
      setNotice("저장되었습니다.");
    }
  };

  const skip = async () => {
    if (await save({ onboarded: true })) {
      router.replace(next);
      router.refresh();
    }
  };

  const provider = (user?.app_metadata?.provider as string | undefined) ?? "email";
  const initial = (fullName || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <div>
      <h1 className="font-serif text-6xl leading-none text-accent sm:text-7xl">{welcome ? "welcome" : "my profile"}</h1>
      <p className="mt-4 text-xl font-semibold">{welcome ? "환영합니다! 프로필을 완성해 주세요" : "내 프로필"}</p>
      <p className="mt-2 text-sm text-muted">
        {welcome ? "아래 정보는 모두 선택 사항이에요. 지금 입력하지 않아도 언제든 다시 수정할 수 있습니다." : "프로필 사진과 개인정보를 관리하세요. 모든 항목은 선택 사항입니다."}
      </p>

      <div className="mt-8 space-y-3">
        {error && <Alert>{error}</Alert>}
        {notice && <Alert tone="success">{notice}</Alert>}
      </div>

      {!loaded ? (
        <p className="mt-16 text-center text-muted">{error ? "" : "불러오는 중…"}</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-10">
          {/* avatar */}
          <section className="flex items-center gap-6 border-b border-line pb-10">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-sand">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- avatar hosts vary (Supabase, Google, Kakao)
                <img src={avatarUrl} alt="프로필 사진" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="grid h-full w-full place-items-center font-serif text-5xl text-accent">{initial}</span>
              )}
              {uploading && <span className="absolute inset-0 grid place-items-center bg-black/40 text-xs text-white">업로드 중…</span>}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium">{user?.email}</p>
              <p className="mt-1 text-xs text-muted">{PROVIDER_LABEL[provider] ?? provider} 계정으로 로그인</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                  사진 변경
                </button>
                {avatarUrl && (
                  <button type="button" onClick={removeAvatar} disabled={uploading} className="border border-line px-4 py-2 text-sm hover:border-ink disabled:opacity-50">
                    삭제
                  </button>
                )}
              </div>
              <p className="mt-2 text-xs text-muted">JPG · PNG · WEBP · GIF, 2MB 이하</p>
              <input ref={fileRef} type="file" accept={AVATAR_TYPES.join(",")} onChange={onAvatarChange} className="hidden" />
            </div>
          </section>

          {/* personal info */}
          <section className="space-y-8 pt-10">
            <label className="block">
              <span className="text-sm font-medium">
                이름 <span className="font-normal text-muted">(선택)</span>
              </span>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={50} autoComplete="name" placeholder="홍길동" className={inputCls} />
            </label>

            <label className="block">
              <span className="text-sm font-medium">
                나이 <span className="font-normal text-muted">(선택)</span>
              </span>
              <input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 3))} inputMode="numeric" placeholder="예: 32" className={`${inputCls} max-w-32`} />
            </label>

            <fieldset>
              <legend className="text-sm font-medium">
                성별 <span className="font-normal text-muted">(선택)</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {([["", "선택 안 함"], ...Object.entries(GENDER_LABEL)] as [Gender | "", string][]).map(([v, label]) => (
                  <label key={v || "none"} className={`cursor-pointer border px-4 py-2 text-sm transition-colors ${gender === v ? "border-accent bg-accent text-white" : "border-line hover:border-ink"}`}>
                    <input type="radio" name="gender" value={v} checked={gender === v} onChange={() => setGender(v)} className="sr-only" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <p className="text-sm font-medium">
                주소 <span className="font-normal text-muted">(선택)</span>
              </p>
              <div className="mt-2 flex gap-2">
                <input value={postcode} readOnly placeholder="우편번호" className={`${inputCls} mt-0 max-w-28`} aria-label="우편번호" />
                <button type="button" onClick={searchAddress} className="shrink-0 self-end border border-ink px-4 py-2.5 text-sm hover:bg-ink hover:text-white">
                  주소 검색
                </button>
                {address && (
                  <button
                    type="button"
                    onClick={() => {
                      setPostcode("");
                      setAddress("");
                      setAddressDetail("");
                    }}
                    className="shrink-0 self-end px-2 py-2.5 text-sm text-muted underline underline-offset-4"
                  >
                    지우기
                  </button>
                )}
              </div>
              <input value={address} readOnly placeholder="주소 검색 버튼을 눌러 주소를 선택하세요" className={inputCls} aria-label="기본 주소" onClick={() => !address && searchAddress()} />
              <input value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} maxLength={100} disabled={!address} placeholder="상세 주소 (동·호수 등)" className={`${inputCls} disabled:opacity-50`} aria-label="상세 주소" />
            </div>
          </section>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={saving} className="flex h-12 flex-1 items-center justify-center bg-accent text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
              {saving ? "저장 중…" : welcome ? "저장하고 시작하기" : "저장하기"}
            </button>
            {welcome && (
              <button type="button" onClick={skip} className="h-12 border border-line px-6 text-sm text-muted hover:border-ink hover:text-ink">
                나중에 입력할게요
              </button>
            )}
          </div>
          {backup && (
            <p className={`mt-4 flex items-center gap-2 text-xs ${backup.ok ? "text-muted" : "text-red-700"}`} role="status">
              <span className={`h-1.5 w-1.5 rounded-full ${backup.ok ? "bg-emerald-600" : "bg-red-600"}`} />
              {backup.text}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
