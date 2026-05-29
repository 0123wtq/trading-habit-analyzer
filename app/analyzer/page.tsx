"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Toast from "@/components/Toast";
import { ROUTES } from "@/lib/routes";
import {
  SAMPLE_DATA,
  analyzeTrades,
  saveAnalysis,
  saveAnalysisHistory,
} from "@/lib/analysis";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineCount = useMemo(
    () => input.split(/\r?\n/).filter((l) => l.trim().length > 0).length,
    [input]
  );

  const loadSample = () => {
    setInput(SAMPLE_DATA);
    setTab("paste");
    setToast("샘플 데이터를 불러왔어요. 편하게 둘러보세요 🙂");
  };

  // CSV/TXT 파일을 읽어 textarea에 채운다.
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      if (text.trim() === "") {
        setToast("파일을 읽을 수 없습니다.");
      } else {
        setInput(text);
        setTab("paste");
        setToast("파일 내용을 불러왔습니다.");
      }
      // 같은 파일을 다시 선택해도 onChange가 발생하도록 초기화
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.onerror = () => {
      setToast("파일을 읽을 수 없습니다.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const runAnalysis = () => {
    // 입력이 없어도 fallback 샘플 리포트가 생성됩니다.
    const result = analyzeTrades(input);
    saveAnalysis(result);
    // 분석 기록(최근 5개) 저장 — 추후 대시보드용
    saveAnalysisHistory(result, input);
    router.push(ROUTES.report);
  };

  return (
    <>
      <SiteHeader />
      {/* 이 페이지만 따뜻한 오프화이트 톤으로 감쌈 (다른 페이지 영향 없음) */}
      <main className="relative min-h-screen bg-warm-100 leading-[1.8] text-ink">
        {/* 부드러운 배경 얼룩 — 손으로 칠한 느낌 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-brand-200/30 blur-3xl" />
          <div className="absolute -right-20 top-52 h-72 w-72 rounded-full bg-accent-200/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="overflow-visible text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-4 py-1.5 text-sm font-semibold tracking-wide text-accent-700 shadow-sm">
              <span aria-hidden>✍️</span>
              직접 적어 내려간 내 매매 기록
            </span>
            <h1 className="mt-6 transform-none text-4xl font-black not-italic leading-[1.15] tracking-tight text-ink md:text-6xl">
              매매 패턴 <span className="text-brand-600 underline decoration-accent-400 decoration-4 underline-offset-8">분석기</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-[1.8] tracking-wide text-ink/75">
              거래내역을 직접 붙여넣거나, 매일 기록한 매매일지를 불러와
              <br className="hidden sm:block" />
              나의 매매 습관을 찬찬히 들여다볼 수 있어요.
            </p>
          </div>

          {/* 상단 안내 카드 — 메모지 느낌 */}
          <div className="paper-tilt mt-10 rounded-xl border border-brand-100 bg-white p-6 shadow-warm">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                💡
              </span>
              <div className="leading-[1.8] tracking-wide">
                <p className="text-base font-bold text-ink">
                  분석은 약 <span className="marker-accent">1분</span>이면 끝나요.
                </p>
                <p className="mt-2 text-[15px] text-ink/70">
                  거래 시각·종목·매수/매도·수익률이 함께 있을수록 더 정확한 습관
                  리포트를 받아볼 수 있어요. 아직 기록이 없다면 아래{" "}
                  <span className="font-semibold text-brand-600">
                    샘플 데이터 불러오기
                  </span>
                  로 먼저 가볍게 체험해 보세요.
                </p>
              </div>
            </div>
          </div>

          {/* 분석 방식 탭 */}
          <div className="mt-12">
            <div className="flex gap-2 rounded-xl border border-warm-300 bg-warm-50 p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setTab("paste")}
                className={`flex-1 rounded-lg px-4 py-3 text-[15px] font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
                  tab === "paste"
                    ? "bg-brand-500 text-white shadow-warm"
                    : "text-ink/55 hover:bg-white hover:text-brand-600"
                }`}
              >
                거래내역 붙여넣기
              </button>
              <button
                type="button"
                onClick={() => setTab("journal")}
                className={`flex-1 rounded-lg px-4 py-3 text-[15px] font-bold tracking-wide transition-all duration-200 active:scale-[0.98] ${
                  tab === "journal"
                    ? "bg-brand-500 text-white shadow-warm"
                    : "text-ink/55 hover:bg-white hover:text-brand-600"
                }`}
              >
                내 매매일지 불러오기
              </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="mt-6">
              {tab === "paste" ? (
                <div className="animate-fade-in">
                  <label
                    htmlFor="trade-input"
                    className="block text-[15px] font-bold tracking-wide text-ink"
                  >
                    거래내역 입력
                  </label>
                  <textarea
                    id="trade-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={PLACEHOLDER}
                    rows={10}
                    className="mt-3 w-full resize-y rounded-xl border-2 border-warm-300 bg-white p-5 font-mono text-[15px] leading-[1.8] text-ink shadow-warm outline-none transition-all duration-200 placeholder:text-ink/35 hover:border-brand-200 focus:border-brand-400 focus:shadow-warm-lg focus:ring-4 focus:ring-brand-100"
                  />
                  <p className="mt-3 flex items-center gap-1.5 text-sm tracking-wide text-ink/55">
                    {lineCount > 0 ? (
                      <>
                        <span aria-hidden>📝</span>
                        <span className="font-semibold text-brand-600">
                          {lineCount}줄
                        </span>{" "}
                        입력됐어요.
                      </>
                    ) : (
                      <>
                        <span aria-hidden>🙂</span>
                        입력이 없어도 샘플 리포트로 먼저 체험할 수 있어요.
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <div className="cut-edge paper-tilt-r animate-fade-in rounded-xl border-2 border-warm-400 bg-white p-9 text-center shadow-warm">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-2xl">
                    📒
                  </div>
                  <span className="mt-4 inline-block rounded-full bg-warm-200 px-3 py-1 text-xs font-bold tracking-wide text-ink/60">
                    준비 중
                  </span>
                  <h3 className="mt-3 text-lg font-bold tracking-wide text-ink">
                    매매일지 연동은 준비 중이에요.
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-[15px] leading-[1.8] tracking-wide text-ink/65">
                    곧 저장해 둔 매매일지를 불러와 바로 분석할 수 있게 됩니다.
                    지금은 거래내역 붙여넣기, CSV 업로드, 샘플 데이터로 먼저
                    분석해보세요.
                  </p>
                  <button
                    type="button"
                    onClick={loadSample}
                    className="mt-6 rounded-xl border-2 border-brand-200 bg-white px-5 py-3 text-[15px] font-bold tracking-wide text-brand-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-warm active:translate-y-0"
                  >
                    샘플 일지 불러오기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 지원 형식 안내 카드 */}
          <div className="mt-10 rounded-xl border border-warm-300 bg-white p-6 shadow-warm">
            <h3 className="text-[15px] font-bold tracking-wide text-ink">
              이런 형식을 지원해요
            </h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {SUPPORTED_FORMATS.map((f) => (
                <span
                  key={f.name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50/60 px-3.5 py-2 text-sm font-medium tracking-wide text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <span aria-hidden>{f.icon}</span>
                  {f.name}
                </span>
              ))}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,text/csv,text/plain"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-2 border-brand-200 bg-white px-6 py-4 text-base font-bold tracking-wide text-brand-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-warm active:translate-y-0 sm:w-auto"
            >
              📎 CSV 파일 업로드
            </button>
            <button
              type="button"
              onClick={loadSample}
              className="w-full rounded-xl border-2 border-brand-200 bg-white px-6 py-4 text-base font-bold tracking-wide text-brand-600 transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-warm active:translate-y-0 sm:w-auto"
            >
              샘플 데이터 불러오기
            </button>
            <button
              type="button"
              onClick={runAnalysis}
              className="group w-full flex-1 rounded-xl bg-accent-500 px-6 py-4 text-base font-bold tracking-wide text-white shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-warm-lg active:translate-y-0"
            >
              분석 시작하기
              <span
                aria-hidden
                className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>

          {/* 주의사항 카드 — 손으로 오린 종이 느낌 */}
          <div className="cut-edge mt-10 rounded-xl border-2 border-accent-200 bg-accent-50/70 p-6">
            <h3 className="flex items-center gap-2 text-[15px] font-bold tracking-wide text-accent-800">
              <span aria-hidden>📌</span>
              알아두면 좋아요
            </h3>
            <ul className="mt-4 space-y-3">
              {CAUTIONS.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-2.5 text-[15px] leading-[1.8] tracking-wide text-accent-900/80"
                >
                  <span className="mt-0.5 flex-shrink-0 text-accent-500" aria-hidden>
                    ✓
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-center text-[15px] tracking-wide text-ink/60">
            바로 결과만 보고 싶으신가요?{" "}
            <Link
              href={ROUTES.report}
              className="font-bold text-brand-600 underline decoration-accent-300 decoration-2 underline-offset-4 transition-colors hover:text-brand-700"
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
