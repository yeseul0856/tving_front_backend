"use client";

import { useEffect } from "react";

export const inputCls = "mt-1.5 block w-full border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none disabled:bg-cream";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="max-h-[92svh] w-full max-w-xl overflow-y-auto bg-background p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-serif text-3xl text-accent">{title}</h3>
          <button onClick={onClose} aria-label="닫기" className="text-2xl leading-none text-muted hover:text-ink">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormActions({ busy, onCancel, submitLabel = "저장" }: { busy: boolean; onCancel: () => void; submitLabel?: string }) {
  return (
    <div className="mt-8 flex justify-end gap-2">
      <button type="button" onClick={onCancel} className="border border-line px-5 py-2.5 text-sm hover:border-ink">
        취소
      </button>
      <button type="submit" disabled={busy} className="bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? "저장 중…" : submitLabel}
      </button>
    </div>
  );
}

export function Toolbar({ children, onCreate, createLabel }: { children?: React.ReactNode; onCreate: () => void; createLabel: string }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <button onClick={onCreate} className="bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
        + {createLabel}
      </button>
    </div>
  );
}

export function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="mb-4 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>;
}

export function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <span className="flex justify-end gap-3 whitespace-nowrap text-xs">
      <button onClick={onEdit} className="text-ink underline-offset-4 hover:underline">
        수정
      </button>
      <button onClick={onDelete} className="text-red-700 underline-offset-4 hover:underline">
        삭제
      </button>
    </span>
  );
}
