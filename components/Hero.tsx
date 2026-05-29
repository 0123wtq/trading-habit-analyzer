import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* 배경 그라데이션 */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white" />
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            3분 자가진단으로 시작하는 습관 개선
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            내 계좌가 위험한 이유,
            <br />
            <span className="text-brand-600">3분 만에 확인</span>하세요
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            수익은 짧게, 손실은 길게 가져가는 습관부터 장 초반 추격매수까지.
            내 투자 습관을 먼저 확인해보세요.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.riskTest}
              className="w-full rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:w-auto"
            >
              계좌 위험도 무료 테스트
            </Link>
            <Link
              href={ROUTES.report}
              className="w-full rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
            >
              샘플 리포트 보기
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            신용카드 없이 시작 · 3분이면 진단 완료
          </p>
        </div>
      </div>
    </section>
  );
}
