import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function CtaSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand-600 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-700/40 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              이번 거래부터, 습관을 바꿔보세요
            </h2>
            <p className="mt-4 text-lg text-brand-50">
              지난 매매 내역만 있으면 됩니다. 지금 바로 첫 분석을 받아보세요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.analyzer}
                className="w-full rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-brand-700 shadow-sm transition-colors hover:bg-brand-50 sm:w-auto"
              >
                무료로 분석 시작하기
              </Link>
              <Link
                href={ROUTES.pricing}
                className="w-full rounded-xl border border-white/40 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                요금제 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
