"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/lib/routes";

const NAV_LINKS = [
  { label: "홈", href: ROUTES.home },
  { label: "매매 분석기", href: ROUTES.analyzer },
  { label: "샘플 리포트", href: ROUTES.report },
  { label: "계산기", href: ROUTES.calculators },
  { label: "요금제", href: ROUTES.pricing },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  /** 현재 경로가 해당 메뉴인지 (홈은 정확히 일치, 나머지는 prefix 허용) */
  const isActive = (href: string) =>
    href === ROUTES.home ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
            돈길
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            돈길
          </span>
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm font-medium transition-colors ${
                  active
                    ? "font-semibold text-brand-600"
                    : "text-slate-600 hover:text-brand-600"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-[21px] left-0 h-0.5 w-full rounded-full bg-brand-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={ROUTES.analyzer}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
          >
            분석 시작하기
          </Link>
        </div>

        {/* 모바일 메뉴 토글 */}
        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href={ROUTES.analyzer}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-brand-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-brand-600"
            >
              분석 시작하기
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
