"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ROUTES } from "@/lib/routes";

/** 방문 여부를 저장하는 localStorage 키 */
const VISITED_KEY = "tha_first_visit_dismissed";

export default function FirstVisitPopup() {
  const [open, setOpen] = useState(false);

  // 최초 방문이면 팝업을 표시한다. (SSR 후 클라이언트에서만 판단)
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(VISITED_KEY) === "true";
    } catch {
      // localStorage 접근 불가(시크릿 모드 등)인 경우엔 그냥 표시
    }
    if (!dismissed) setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(VISITED_KEY, "true");
    } catch {
      // 저장 실패는 무시 — 다음 방문 때 다시 보일 수 있음
    }
  }, []);

  // 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!open) return;

    document.body.classList.add("overflow-locked");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("overflow-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-visit-title"
    >
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* 팝업 카드 */}
      <div className="relative w-full max-w-md animate-scale-in rounded-2xl bg-white p-7 shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="닫기"
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          👋 처음 오셨네요
        </span>

        <h2
          id="first-visit-title"
          className="mt-4 text-2xl font-bold tracking-tight text-slate-900"
        >
          트레이딩 습관 분석기에
          <br />
          오신 걸 환영합니다
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          지난 매매 내역만 있으면 됩니다. 반복되는 실수와 나쁜 습관을
          찾아내고, 다음 거래에서 무엇을 바꿔야 할지 알려드릴게요.
        </p>

        <ul className="mt-5 space-y-2.5">
          {[
            "감정적 매매·과매매 자동 탐지",
            "시간대·종목별 손익 패턴 리포트",
            "맞춤형 습관 개선 가이드",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-col gap-2">
          <Link
            href={ROUTES.analyze}
            onClick={close}
            className="rounded-xl bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            무료로 분석 시작하기
          </Link>
          <button
            type="button"
            onClick={close}
            className="rounded-xl px-5 py-2.5 text-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            먼저 둘러볼게요
          </button>
        </div>
      </div>
    </div>
  );
}
