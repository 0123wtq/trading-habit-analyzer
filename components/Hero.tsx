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
            매매 기록으로 시작하는 습관 개선
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            당신의 매매 습관을
            <br />
            <span className="text-brand-600">데이터로 분석</span>합니다
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            감정적 매매, 잦은 거래, 손절 지연. 수익을 갉아먹는 반복된 실수를
            자동으로 찾아내고, 무엇을 바꿔야 할지 명확하게 알려드립니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.analyzer}
              className="w-full rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-600 sm:w-auto"
            >
              무료로 분석 시작하기
            </Link>
            <Link
              href={ROUTES.dashboard}
              className="w-full rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
            >
              데모 둘러보기
            </Link>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            신용카드 없이 시작 · 1분이면 첫 분석 완료
          </p>
        </div>
      </div>
    </section>
  );
}
