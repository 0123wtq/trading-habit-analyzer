"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ROUTES } from "@/lib/routes";
import {
  RISK_QUESTIONS,
  RiskAnswers,
  evaluateRisk,
  saveRiskResult,
} from "@/lib/riskTest";

export default function RiskTestPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<RiskAnswers>({});

  const total = RISK_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === total;
  const progress = Math.round((answeredCount / total) * 100);

  const select = (qid: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: optIdx }));
  };

  const submit = () => {
    if (!allAnswered) return;
    const result = evaluateRisk(answers);
    saveRiskResult(result);
    router.push(ROUTES.riskResult);
  };

  // 첫 미응답 질문으로 안내하기 위한 인덱스
  const firstUnanswered = useMemo(
    () => RISK_QUESTIONS.find((q) => answers[q.id] == null)?.id ?? null,
    [answers]
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-warm-100 pb-20 text-ink">
        <div className="mx-auto max-w-2xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          {/* 헤더 */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-sm font-semibold tracking-wide text-accent-700 shadow-sm">
              <span aria-hidden>🔍</span> 3분 자가진단
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.15] tracking-tight text-ink md:text-5xl">
              계좌 위험도 테스트
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-[1.8] tracking-wide text-ink/75">
              3분만에 내 투자 습관과 계좌 위험도를 확인해보세요.
            </p>
          </div>

          {/* 진행률 */}
          <div className="sticky top-16 z-10 mt-8 rounded-xl border border-warm-300 bg-warm-50/95 p-3 backdrop-blur">
            <div className="flex items-center justify-between text-sm font-semibold text-ink/70">
              <span>진행률</span>
              <span>
                {answeredCount} / {total}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-warm-300">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 질문 카드들 */}
          <div className="mt-8 space-y-5">
            {RISK_QUESTIONS.map((q) => {
              const selected = answers[q.id];
              const isNext = q.id === firstUnanswered;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl border bg-white p-6 shadow-warm transition-colors ${
                    isNext ? "border-brand-300" : "border-warm-300"
                  }`}
                >
                  <h2 className="text-lg font-bold leading-snug text-ink">
                    <span className="mr-1.5 text-brand-500">Q{q.id}.</span>
                    {q.question}
                  </h2>
                  <div className="mt-4 space-y-2.5">
                    {q.options.map((opt, idx) => {
                      const active = selected === idx;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => select(q.id, idx)}
                          className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[15px] font-medium leading-relaxed tracking-wide transition-all duration-150 active:scale-[0.99] ${
                            active
                              ? "border-brand-400 bg-brand-50 text-brand-700"
                              : "border-warm-300 bg-white text-ink/80 hover:border-brand-200 hover:bg-brand-50/40"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                              active
                                ? "border-brand-500 bg-brand-500 text-white"
                                : "border-warm-400"
                            }`}
                          >
                            {active && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 제출 */}
          <div className="mt-8">
            <button
              type="button"
              onClick={submit}
              disabled={!allAnswered}
              className="w-full rounded-xl bg-accent-500 px-6 py-4 text-base font-bold tracking-wide text-white shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-warm-lg active:translate-y-0 disabled:cursor-not-allowed disabled:bg-warm-400 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {allAnswered
                ? "결과 보기 →"
                : `모든 질문에 답해 주세요 (${answeredCount}/${total})`}
            </button>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink/50">
              본 테스트는 투자 참고용 자가진단이며, 종목 추천이나 수익 보장이
              아닙니다.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
