"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Toast from "@/components/Toast";
import { ROUTES } from "@/lib/routes";
import { SAMPLE_DATA, analyzeTrades, saveAnalysis } from "@/lib/analysis";

type TabKey = "paste" | "journal";

const SUPPORTED_FORMATS = [
  { name: "키움증권 일지", icon: "📘" },
  { name: "미래에셋 거래원", icon: "📗" },
  { name: "삼성증권 내역", icon: "📙" },
  { name: "CSV 데이터", icon: "📄" },
  { name: "직접 입력", icon: "✍️" },
];

const CAUTIONS = [
  "시간대별 승률 분석을 위해 거래 시각 정보가 함께 입력되는 것이 좋습니다.",
  "정확한 포지션 보유 기간을 위해 동일 종목의 매수/매도 내역이 한 쌍으로 존재해야 합니다.",
  "본 분석은 투자 참고용이며 매수·매도 추천이 아닙니다.",
];

const PLACEHOLDER = `예시)
2026.04.10 09:12:05 삼성전자 매수 78,500원 100주
2026.05.10 09:45:00 삼성전자 매도 68,200원 100주 -13.12%`;

export default function AnalyzerPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("paste");
  const [input, setInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const lineCount = useMemo(
    () => input.split(/\r?\n/).filter((l) => l.trim().length > 0).length,
    [input]
  );

  const loadSample = () => {
    setInput(SAMPLE_DATA);
    setTab("paste");
    setToast("샘플 데이터를 불러왔습니다.");
  };

  const runAnalysis = () => {
    // 입력이 없어도 fallback 샘플 리포트가 생성됩니다.
    const result = analyzeTrades(input);
    saveAnalysis(result);
    router.push(ROUTES.report);
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              매매 패턴 분석기
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
              거래내역을 직접 붙여넣거나, 매일 기록한 매매일지를 불러와 나의
              매매 습관을 분석할 수 있습니다.
            </p>
          </div>

          {/* 상단 안내 카드 */}
          <div className="mt-8 rounded-2xl border border-brand-200 bg-brand-50 p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="text-sm leading-relaxed text-brand-800">
                <p className="font-semibold">분석은 약 1분이면 끝납니다.</p>
                <p className="mt-1 text-brand-700">
                  거래 시각·종목·매수/매도·수익률이 포함될수록 더 정확한 습관
                  리포트를 받아볼 수 있습니다. 데이터가 없다면 아래{" "}
                  <span className="font-semibold">샘플 데이터 불러오기</span>로
                  먼저 체험해 보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 분석 방식 탭 */}
          <div className="mt-8">
            <div className="flex gap-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setTab("paste")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === "paste"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                거래내역 붙여넣기
              </button>
              <button
                type="button"
                onClick={() => setTab("journal")}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === "journal"
                    ? "bg-white text-brand-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                내 매매일지 불러오기
              </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="mt-5">
              {tab === "paste" ? (
                <div>
                  <label
                    htmlFor="trade-input"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    거래내역 입력
                  </label>
                  <textarea
                    id="trade-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={PLACEHOLDER}
                    rows={10}
                    className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 font-mono text-sm leading-relaxed text-slate-800 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    {lineCount > 0
                      ? `${lineCount}줄 입력됨`
                      : "입력이 없어도 샘플 리포트로 분석을 체험할 수 있습니다."}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                    📒
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-800">
                    매매일지 연동은 준비 중입니다
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                    곧 저장된 매매일지를 바로 불러올 수 있게 됩니다. 지금은 샘플
                    일지를 불러와 분석을 체험해 보세요.
                  </p>
                  <button
                    type="button"
                    onClick={loadSample}
                    className="mt-5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    샘플 일지 불러오기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 지원 형식 안내 카드 */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-slate-700">지원 형식</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUPPORTED_FORMATS.map((f) => (
                <span
                  key={f.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  <span>{f.icon}</span>
                  {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={loadSample}
              className="w-full rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
            >
              샘플 데이터 불러오기
            </button>
            <button
              type="button"
              onClick={runAnalysis}
              className="w-full flex-1 rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-600"
            >
              분석 시작하기
            </button>
          </div>

          {/* 주의사항 카드 */}
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="text-sm font-semibold text-amber-800">주의사항</h3>
            <ul className="mt-3 space-y-2">
              {CAUTIONS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2 text-sm leading-relaxed text-amber-800"
                >
                  <span className="mt-0.5 text-amber-500">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            바로 결과만 보고 싶으신가요?{" "}
            <Link
              href={ROUTES.report}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              샘플 리포트 보기 →
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
      <Toast message={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
