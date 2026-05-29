import Link from "next/link";
import { ROUTES } from "@/lib/routes";

const FOOTER_LINKS = [
  {
    heading: "제품",
    links: [
      { label: "매매 패턴 분석기", href: ROUTES.analyzer },
      { label: "투자 계산기 모음", href: ROUTES.calculators },
      { label: "샘플 리포트", href: ROUTES.report },
      { label: "요금제", href: ROUTES.pricing },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
                TH
              </span>
              <span className="text-base font-bold text-slate-900">
                트레이딩 습관 분석기
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              매매 기록을 분석해 반복되는 실수를 찾고, 더 나은 투자 습관을
              만들어가는 것을 돕습니다.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h4 className="text-sm font-semibold text-slate-900">
                {group.heading}
              </h4>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-brand-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} 트레이딩 습관 분석기. All rights
            reserved.
          </p>
          <p className="text-xs text-slate-400">
            본 서비스는 투자 자문이 아니며, 모든 투자 판단의 책임은 이용자에게
            있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
