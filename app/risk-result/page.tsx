"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Toast from "@/components/Toast";
import { ROUTES } from "@/lib/routes";
import {
  RiskLevel,
  RiskTestResult,
  buildRiskShareText,
  loadRiskResult,
} from "@/lib/riskTest";

/** 위험도 등급별 색상 토큰 */
function levelStyle(level: RiskLevel): { text: string; bar: string; pct: number } {
  switch (level) {
    case "낮음":
      return { text: "text-emerald-600", bar: "bg-emerald-500", pct: 20 };
    case "중간":
      return { text: "text-amber-600", bar: "bg-amber-500", pct: 50 };
    case "높음":
      return { text: "text-orange-600", bar: "bg-orange-500", pct: 75 };
    case "매우 높음":
      return { text: "text-rose-600", bar: "bg-rose-500", pct: 95 };
  }
}

export default function RiskResultPage() {
  const [result, setResult] = useState<RiskTestResult | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setResult(loadRiskResult());
    setLoaded(true);
  }, []);

  const copyShare = async () => {
    if (!result) return;
    const text = buildRiskShareText(result);
    try {
      await navigator.clipboard.writeText(text);
      setToast("공유문구가 복사되었습니다.");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setToast("공유문구가 복사되었습니다.");
      } catch {
        setToast("복사에 실패했습니다. 직접 복사해 주세요.");
      }
    }
  };

  // 아직 로딩 중
  if (!loaded) {
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-screen items-center justify-center bg-warm-100">
          <p className="text-sm text-ink/60">결과를 불러오는 중…</p>
        </main>
        <SiteFooter />
      </>
    );
  }

  // 결과가 없으면 테스트로 유도
  if (!result) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-screen bg-warm-100 text-ink">
          <div className="mx-auto max-w-xl px-4 pb-20 pt-28 text-center sm:px-6 sm:pt-32 lg:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-3xl">
              🧭
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight">
              아직 진단 결과가 없어요
            </h1>
            <p className="mt-4 text-[15px] leading-[1.8] text-ink/70">
              먼저 계좌 위험도 테스트를 완료하면 내 투자 유형과 위험도를 확인할
              수 있어요.
            </p>
            <Link
              href={ROUTES.riskTest}
              className="mt-7 inline-block rounded-xl bg-brand-500 px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-600"
            >
              계좌 위험도 테스트 하러 가기 →
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const lv = levelStyle(result.level);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-warm-100 pb-20 text-ink">
        <div className="mx-auto max-w-2xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          {/* 헤더 카드 */}
          <div className="rounded-2xl border border-warm-300 bg-white p-7 text-center shadow-warm">
            <span className="text-sm font-semibold tracking-wide text-ink/50">
              계좌 위험도 진단 결과
            </span>

            {/* 위험도 */}
            <div className="mt-4">
              <p className="text-sm font-semibold text-ink/60">계좌 위험도</p>
              <p className={`mt-1 text-4xl font-black ${lv.text}`}>
                {result.level}
              </p>
              <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-warm-200">
                <div
                  className={`h-full rounded-full ${lv.bar} transition-all duration-500`}
                  style={{ width: `${lv.pct}%` }}
                />
              </div>
            </div>

            {/* 유형 */}
            <div className="mt-6 rounded-xl bg-brand-50 p-5">
              <p className="text-sm font-semibold text-brand-600">내 투자 유형</p>
              <p className="mt-1 text-2xl font-black tracking-tight text-brand-700">
                {result.typeName}
              </p>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.8] text-ink/75">
                {result.oneLiner}
              </p>
            </div>
          </div>

          {/* 반복 실수 TOP 3 */}
          <section className="mt-6 rounded-2xl border border-warm-300 bg-white p-6 shadow-warm">
            <h2 className="text-lg font-bold text-ink">반복 실수 TOP 3</h2>
            <ul className="mt-4 space-y-3">
              {result.mistakes.map((m, i) => (
                <li
                  key={m}
                  className="flex items-start gap-3 text-[15px] leading-[1.7] text-ink/80"
                >
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100 text-xs font-bold text-rose-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m}
                </li>
              ))}
            </ul>
          </section>

          {/* 다음 매매 규칙 */}
          <section className="mt-6 rounded-2xl border border-brand-100 bg-brand-50/60 p-6">
            <h2 className="text-lg font-bold text-brand-900">
              다음 매매에서 지킬 규칙 3가지
            </h2>
            <ul className="mt-4 space-y-3">
              {result.rules.map((r, i) => (
                <li
                  key={r}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 text-[15px] font-medium leading-[1.6] text-ink/85"
                >
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          {/* 액션 */}
          <div className="mt-8 space-y-3">
            <Link
              href={ROUTES.analyzer}
              className="block w-full rounded-xl bg-accent-500 px-6 py-4 text-center text-base font-bold tracking-wide text-white shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-warm-lg active:translate-y-0"
            >
              거래내역으로 더 정확히 분석하기 →
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={ROUTES.pricing}
                className="w-full rounded-xl border-2 border-brand-200 bg-white px-6 py-3.5 text-center text-base font-bold tracking-wide text-brand-600 transition-all duration-200 hover:bg-brand-50 sm:flex-1"
              >
                요금제 확인하기
              </Link>
              <button
                type="button"
                onClick={copyShare}
                className="w-full rounded-xl border-2 border-warm-300 bg-white px-6 py-3.5 text-center text-base font-bold tracking-wide text-ink/70 transition-all duration-200 hover:bg-warm-50 sm:flex-1"
              >
                공유문구 복사
              </button>
            </div>
            <Link
              href={ROUTES.riskTest}
              className="block pt-1 text-center text-sm font-semibold text-ink/55 underline decoration-warm-400 underline-offset-4 hover:text-ink/80"
            >
              테스트 다시 하기
            </Link>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-ink/45">
            본 결과는 입력한 응답 기반의 자가진단이며, 투자 참고용입니다. 종목
            추천이나 수익 보장이 아니며, 투자 판단의 책임은 본인에게 있습니다.
          </p>
        </div>
      </main>
      <SiteFooter />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
