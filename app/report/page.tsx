"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";
import { ROUTES } from "@/lib/routes";
import {
  AnalysisResult,
  getFallbackAnalysis,
  loadAnalysis,
} from "@/lib/analysis";

/** 통화 포맷: -979092 → "-979,092원" */
function formatWon(n: number): string {
  return `${n.toLocaleString("ko-KR")}원`;
}

/** 수익률 포맷: 부호 포함 */
function formatPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n}%`;
}

/** ISO 시각 → "2026. 5. 29. 오전 11:20" */
function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ReportPage() {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // localStorage에서 분석 결과를 읽고, 없으면 fallback 샘플 리포트를 사용
  useEffect(() => {
    setData(loadAnalysis() ?? getFallbackAnalysis());
  }, []);

  const copyShareText = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.shareText);
      setToast("공유문구가 복사되었습니다.");
    } catch {
      // 클립보드 API 미지원 시 폴백
      try {
        const ta = document.createElement("textarea");
        ta.value = data.shareText;
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

  const saveImage = () => {
    setToast("이미지 저장 기능은 곧 제공 예정입니다.");
  };

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">리포트를 불러오는 중…</p>
      </main>
    );
  }

  const maxHold = Math.max(data.holdPeriod.profitDays, data.holdPeriod.lossDays);

  return (
    <main className="min-h-screen bg-slate-100 pb-16">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 상단 헤더 */}
        <header className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
                TraderMirror Style REPORT
              </p>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
                나의 매매 습관 분석 리포트
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                분석 시간: {formatDateTime(data.analyzedAt)}
                {data.isFallback && (
                  <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">
                    샘플 데이터
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={ROUTES.analyzer}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                다른 데이터 분석하기
              </Link>
              <button
                type="button"
                onClick={copyShareText}
                className="rounded-lg bg-brand-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600"
              >
                공유문구 복사
              </button>
              <button
                type="button"
                onClick={saveImage}
                className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
              >
                이미지로 저장
              </button>
            </div>
          </div>

          {/* 종합 진단 */}
          <div className="mt-6 rounded-xl bg-white/5 p-5">
            <h2 className="text-sm font-semibold text-brand-300">종합 진단</h2>
            <ul className="mt-3 space-y-1.5">
              {data.diagnosis.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-sm leading-relaxed text-slate-100"
                >
                  <span className="mt-0.5 text-brand-400">▸</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* 핵심 성과 요약 */}
        <section className="mt-6">
          <h2 className="text-lg font-bold text-slate-900">핵심 성과 요약</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <SummaryCard label="총 거래 수" value={`${data.summary.totalTrades}건`} />
            <SummaryCard
              label="수익 거래 수"
              value={`${data.summary.winTrades}건`}
              tone="up"
            />
            <SummaryCard
              label="손실 거래 수"
              value={`${data.summary.lossTrades}건`}
              tone="down"
            />
            <SummaryCard
              label="총 손익"
              value={formatWon(data.summary.totalPnl)}
              tone={data.summary.totalPnl < 0 ? "down" : "up"}
            />
            <SummaryCard
              label="평균 수익률"
              value={formatPct(data.summary.avgReturnPct)}
              tone={data.summary.avgReturnPct < 0 ? "down" : "up"}
            />
            <SummaryCard
              label="손익비"
              value={data.summary.profitFactor.toFixed(2)}
              tone={data.summary.profitFactor < 1 ? "down" : "up"}
            />
          </div>
        </section>

        {/* 차트 1. 시간대별 매매 승률 */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">
            시간대별 매매 승률
          </h2>
          <div className="mt-5 flex items-end justify-between gap-2 sm:gap-4">
            {data.timeWinRates.map((t) => {
              const weakest = t.rate === 0;
              return (
                <div
                  key={t.hour}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <span className="text-xs font-semibold text-slate-700">
                    {t.rate}%
                  </span>
                  <div className="flex h-40 w-full items-end">
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        weakest
                          ? "bg-rose-400"
                          : t.rate >= 60
                            ? "bg-brand-500"
                            : "bg-brand-300"
                      }`}
                      style={{ height: `${Math.max(t.rate, 3)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{t.hour}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            ⚠ {data.weakestTimeNote}
          </div>
        </section>

        {/* 차트 2. 수익 vs 손실 평균 보유 기간 */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">
            수익 vs 손실 평균 보유 기간
          </h2>
          <div className="mt-5 space-y-4">
            <HBar
              label="수익 평균 보유기간"
              valueLabel={`${data.holdPeriod.profitDays}일`}
              pct={(data.holdPeriod.profitDays / maxHold) * 100}
              color="bg-brand-500"
            />
            <HBar
              label="손실 평균 보유기간"
              valueLabel={`${data.holdPeriod.lossDays}일`}
              pct={(data.holdPeriod.lossDays / maxHold) * 100}
              color="bg-rose-400"
            />
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
            💬 {data.holdPeriod.note}
          </div>
        </section>

        {/* 차트 3. 투자 승률 & 손익비 */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">투자 승률 & 손익비</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatBlock
              label="승률"
              value={`${data.winRate.winRatePct}%`}
              tone="neutral"
            />
            <StatBlock
              label="평균 수익률"
              value={formatPct(data.winRate.avgProfitPct)}
              tone="up"
            />
            <StatBlock
              label="평균 손실률"
              value={formatPct(data.winRate.avgLossPct)}
              tone="down"
            />
            <StatBlock
              label="손익비"
              value={data.winRate.profitFactor.toFixed(2)}
              tone={data.winRate.profitFactor < 1 ? "down" : "up"}
            />
          </div>
          {/* 승률 게이지 */}
          <div className="mt-5">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>승률</span>
              <span>{data.winRate.winRatePct}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${data.winRate.winRatePct}%` }}
              />
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            ⚠ {data.winRate.warning}
          </div>
        </section>

        {/* 수익/손실 거래 상세 비교 */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
            <h3 className="text-base font-bold text-brand-800">수익 거래</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow
                label="평균 수익률"
                value={formatPct(data.winDetail.avgProfitPct)}
              />
              <DetailRow
                label="최대 수익 거래"
                value={data.winDetail.maxTradeLabel}
              />
              <DetailRow label="수익 거래 수" value={`${data.winDetail.count}건`} />
            </dl>
          </div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
            <h3 className="text-base font-bold text-rose-800">손실 거래</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow
                label="평균 손실률"
                value={formatPct(data.lossDetail.avgLossPct)}
              />
              <DetailRow
                label="최대 손실 거래"
                value={data.lossDetail.maxTradeLabel}
              />
              <DetailRow
                label="손실 거래 수"
                value={`${data.lossDetail.count}건`}
              />
            </dl>
          </div>
        </section>

        {/* 반복 실수 TOP 3 */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">반복 실수 TOP 3</h2>
          <div className="mt-4 space-y-4">
            {data.topMistakes.map((m, i) => (
              <div
                key={m.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {m.title}
                </h3>
                <ul className="mt-3 space-y-1.5 pl-9">
                  {m.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
                    >
                      <span className="mt-0.5 text-slate-400">-</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* AI 매매 리포트 */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span>🤖</span> AI 매매 리포트
          </h2>
          <div className="mt-4 space-y-4">
            <AiBlock label="한 줄 요약" text={data.aiReport.summary} />
            <AiBlock label="잘한 점" text={data.aiReport.good} />
            <AiBlock label="가장 큰 문제점" text={data.aiReport.problem} />
            <AiBlock label="수치 기반 분석" text={data.aiReport.dataAnalysis} />
            <AiBlock
              label="반복되는 실수"
              text={data.aiReport.repeatedMistake}
            />
          </div>
        </section>

        {/* 다음 거래에서 지켜야 할 규칙 */}
        <section className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <h2 className="text-lg font-bold text-brand-900">
            다음 거래에서 지켜야 할 규칙
          </h2>
          <ul className="mt-4 space-y-3">
            {data.rules.map((r, i) => (
              <li
                key={r}
                className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm font-medium text-slate-800"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* 하단 CTA */}
        <section className="mt-8 overflow-hidden rounded-3xl bg-slate-900 p-8 text-center text-white">
          <h2 className="text-xl font-bold sm:text-2xl">
            분석은 끝이 아니라, 다음 매매 규칙으로 이어져야 합니다.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
            반복되는 실수를 줄이려면 기록, 복기, 기준 설정이 함께 필요합니다.
          </p>
          <Link
            href={ROUTES.pricing}
            className="mt-6 inline-block rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600"
          >
            다음 단계 확인하기
          </Link>
        </section>
      </div>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </main>
  );
}

/* ---------------------------------------------------------------- */
/* 보조 컴포넌트                                                      */
/* ---------------------------------------------------------------- */

function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
}) {
  const valueColor =
    tone === "up"
      ? "text-brand-600"
      : tone === "down"
        ? "text-rose-600"
        : "text-slate-900";
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function HBar({
  label,
  valueLabel,
  pct,
  color,
}: {
  label: string;
  valueLabel: string;
  pct: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{valueLabel}</span>
      </div>
      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(Math.max(pct, 3), 100)}%` }}
        />
      </div>
    </div>
  );
}

function StatBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "up" | "down" | "neutral";
}) {
  const valueColor =
    tone === "up"
      ? "text-brand-600"
      : tone === "down"
        ? "text-rose-600"
        : "text-slate-900";
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

function AiBlock({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}
