"use client";

import Link from "next/link";
import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Toast from "@/components/Toast";
import { ROUTES } from "@/lib/routes";

/**
 * 요금제 / 구독 전환 페이지.
 *
 * 실제 결제는 아직 연결되어 있지 않습니다. 유료 플랜 버튼은 mock 처리되어
 * 토스트만 띄웁니다. 추후 멤버십/구독 상품으로 문구를 바꾸기 쉽도록 플랜
 * 데이터를 PLANS 배열로 분리한 범용 구조입니다.
 */

type PlanAction =
  | { type: "link"; href: string }
  | { type: "mock" };

interface Plan {
  id: string;
  name: string;
  priceMain: string;
  priceSub?: string;
  description: string;
  badges?: string[];
  features: string[];
  ctaLabel: string;
  action: PlanAction;
  /** 가장 강조할 플랜 여부 */
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    priceMain: "₩0",
    description: "처음 내 매매 습관을 확인하는 기본 플랜",
    features: [
      "매매일지 무료 기록",
      "하루 1회 기본 분석",
      "최근 7일 기본 요약 분석",
      "승률·종목별 손익·수익률",
      "청산가 계산기 기본 기능",
    ],
    ctaLabel: "무료로 시작하기",
    action: { type: "link", href: ROUTES.analyzer },
  },
  {
    id: "pro-annual",
    name: "Pro 연간",
    priceMain: "월 환산 ₩6,600",
    priceSub: "연 ₩79,200 청구",
    badges: ["가장 인기", "2개월 무료", "33% 할인"],
    description: "장기적으로 매매 습관을 교정하고 싶은 사용자를 위한 플랜",
    features: [
      "매매일지 무제한 등록",
      "매매패턴 무제한 분석",
      "전체 기간 분석",
      "감정·진입근거·자산·유형별 분석",
      "AI 매매 리포트",
      "연간 회고 가능",
    ],
    ctaLabel: "Pro 연간 시작하기",
    action: { type: "mock" },
    highlighted: true,
  },
  {
    id: "pro-monthly",
    name: "Pro 월간",
    priceMain: "월 ₩9,900",
    description: "부담 없이 한 달 단위로 분석 기능을 써보고 싶은 사용자를 위한 플랜",
    features: [
      "전체 기능 무제한",
      "매매일지 무제한 등록",
      "매매패턴 무제한 분석",
      "전체 기간 분석",
      "감정·진입근거·자산·유형별 분석",
      "AI 매매 리포트",
      "월 단위 결제",
    ],
    ctaLabel: "Pro 월간 시작하기",
    action: { type: "mock" },
  },
];

const FREE_FEATURES = [
  "매매 일지 기록",
  "기본 승률 / 손익 요약",
  "시간대별 승률 차트",
  "수익/손실 보유기간 비교",
  "요일별 성과",
  "청산가 계산기",
];

const PRO_FEATURES = [
  "진입 근거별 성과 분석",
  "감정 상태별 성과 분석",
  "원칙 준수 여부별 분석",
  "손절 기준 작성 여부 분석",
  "자산 유형별 상세 분석",
  "AI 매매 리포트",
  "수익률 착시 교정기",
  "펀딩피 계산기 전체 기능",
];

const FAQS = [
  {
    q: "7일 후 자동 결제 되나요?",
    a: "현재 MVP에서는 실제 결제 기능이 연결되어 있지 않아 자동 결제는 발생하지 않습니다. 추후 결제 기능을 연결할 경우, 결제 전 명확히 안내됩니다.",
  },
  {
    q: "해지는 언제든 가능한가요?",
    a: "실제 구독 기능이 연결된 이후에는 사용자가 직접 해지할 수 있는 구조로 설계할 예정입니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "현재는 결제 기능이 없는 MVP 단계입니다. 추후 유료 기능이 연결될 경우 별도 환불 정책을 고지할 예정입니다.",
  },
  {
    q: "이 서비스가 종목을 추천하나요?",
    a: "아닙니다. 본 서비스는 특정 종목의 매수·매도 추천을 제공하지 않습니다. 사용자의 매매 습관과 반복 실수를 점검하기 위한 분석 도구입니다.",
  },
  {
    q: "수익을 보장하나요?",
    a: "아닙니다. 본 서비스는 수익을 보장하지 않으며, 투자 판단과 결과에 대한 최종 책임은 본인에게 있습니다.",
  },
];

const DISCLAIMER =
  "본 서비스에서 제공하는 모든 계산 결과 및 분석 진단 정보는 투자 참고용일 뿐이며, 어떠한 경우에도 투자 결과에 대한 법적 책임 소재의 증빙자료로 사용될 수 없습니다. 투자 결과에 대한 최종 책임은 본인에게 있습니다.";

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-4 flex-shrink-0 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PricingPage() {
  const [toast, setToast] = useState<string | null>(null);

  const handleMockCheckout = () => {
    setToast("결제 기능은 추후 연결 예정입니다.");
  };

  return (
    <>
      <SiteHeader />
      <main className="bg-slate-950 text-slate-100">
        {/* 상단 카피 */}
        <section className="mx-auto max-w-5xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            7일 무료로 시작하세요.
          </h1>
          <p className="mt-3 text-lg font-medium text-slate-300 sm:text-2xl">
            내 매매 패턴을 먼저 확인해보세요.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400">
            신용카드 없이 바로 시작할 수 있으며, 현재 MVP에서는 실제 결제가
            진행되지 않습니다.
          </p>
        </section>

        {/* 요금제 3단 카드 */}
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3">
            {PLANS.map((plan) => {
              const highlighted = plan.highlighted;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl border p-6 sm:p-7 ${
                    highlighted
                      ? "border-brand-400 bg-slate-900 shadow-2xl shadow-brand-500/20 ring-1 ring-brand-400 md:-mt-4 md:mb-4"
                      : "border-slate-800 bg-slate-900/60"
                  }`}
                >
                  {highlighted && plan.badges?.[0] && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-brand-500 px-4 py-1 text-xs font-bold text-white shadow-md">
                        {plan.badges[0]}
                      </span>
                    </div>
                  )}

                  <h2 className="text-lg font-bold text-white">{plan.name}</h2>

                  {/* 배지 묶음(연간의 보조 배지) */}
                  {plan.badges && plan.badges.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {plan.badges.slice(1).map((b) => (
                        <span
                          key={b}
                          className="rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-semibold text-brand-300"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 가격 */}
                  <div className="mt-5">
                    <p className="text-3xl font-extrabold text-white sm:text-4xl">
                      {plan.priceMain}
                    </p>
                    {plan.priceSub && (
                      <p className="mt-1 text-sm text-slate-400">
                        {plan.priceSub}
                      </p>
                    )}
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-slate-400">
                    {plan.description}
                  </p>

                  {/* 제공 내용 */}
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-slate-200"
                      >
                        <CheckIcon
                          className={
                            highlighted ? "mt-0.5 text-brand-400" : "mt-0.5 text-brand-500"
                          }
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-7">
                    {plan.action.type === "link" ? (
                      <Link
                        href={plan.action.href}
                        className={`block rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition-colors ${
                          highlighted
                            ? "bg-brand-500 text-white hover:bg-brand-600"
                            : "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                        }`}
                      >
                        {plan.ctaLabel}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMockCheckout}
                        className={`block w-full rounded-xl px-5 py-3.5 text-center text-sm font-semibold transition-colors ${
                          highlighted
                            ? "bg-brand-500 text-white hover:bg-brand-600"
                            : "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                        }`}
                      >
                        {plan.ctaLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 기능 비교표 */}
        <section className="border-t border-slate-800 bg-slate-900/40">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
              Free와 Pro 기능 비교
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="text-base font-bold text-slate-200">
                  Free 가능
                </h3>
                <ul className="mt-4 space-y-3">
                  {FREE_FEATURES.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <CheckIcon className="mt-0.5 text-slate-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-brand-500/40 bg-slate-900 p-6 ring-1 ring-brand-500/30">
                <h3 className="flex items-center gap-2 text-base font-bold text-brand-300">
                  Pro 가능
                  <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-300">
                    전체 기능
                  </span>
                </h3>
                <ul className="mt-4 space-y-3">
                  {PRO_FEATURES.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-200"
                    >
                      <CheckIcon className="mt-0.5 text-brand-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            자주 묻는 질문
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 [&_summary]:list-none"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-white">
                  <span>
                    Q{i + 1}. {faq.q}
                  </span>
                  <span className="text-slate-500 transition-transform group-open:rotate-180">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 하단 CTA */}
        <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              아직 내 매매 패턴을 분석하지 않았다면?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              샘플 데이터로 먼저 리포트를 확인하거나, 내 거래내역을 붙여넣고
              무료 분석을 시작해보세요.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.analyzer}
                className="w-full rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600 sm:w-auto"
              >
                무료 분석 시작하기
              </Link>
              <Link
                href={ROUTES.report}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-slate-700 sm:w-auto"
              >
                샘플 리포트 보기
              </Link>
            </div>
          </div>
        </section>

        {/* 면책 문구 */}
        <section className="bg-slate-950">
          <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
            <p className="text-xs leading-relaxed text-slate-500">{DISCLAIMER}</p>
          </div>
        </section>
      </main>
      <SiteFooter />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
