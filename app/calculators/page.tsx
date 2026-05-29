"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ROUTES } from "@/lib/routes";
import {
  AssetType,
  PositionSide,
  RealReturnResult,
  LiquidationResult,
  FundingResult,
  RiskGrade,
  calcRealReturn,
  calcLiquidation,
  calcFunding,
  formatWon,
  formatPct,
  formatPrice,
} from "@/lib/calculators";

type TabKey = "real-return" | "liquidation" | "funding";

const TABS: { key: TabKey; label: string }[] = [
  { key: "real-return", label: "수익률 착시 교정기" },
  { key: "liquidation", label: "실시간 청산가 계산기" },
  { key: "funding", label: "펀딩피 누적 계산기" },
];

const DISCLAIMER =
  "본 계산기는 입력값을 바탕으로 한 단순 추정 도구입니다. 실제 수수료, 세금, 청산 조건, 펀딩비는 거래소·증권사·시장 상황에 따라 달라질 수 있습니다. 본 서비스는 종목 추천이나 수익 보장을 제공하지 않으며, 투자 판단과 결과에 대한 최종 책임은 본인에게 있습니다.";

export default function CalculatorsPage() {
  const [tab, setTab] = useState<TabKey>("real-return");

  return (
    <>
      <SiteHeader />
      <main className="bg-slate-950 text-slate-100">
        {/* 상단 제목 */}
        <section className="mx-auto max-w-4xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16 lg:px-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            투자 계산기 종합 도구
          </h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            보이지 않는 투자 실상과 청산 리스크를 수학적으로 계산해 드립니다.
          </p>

          {/* 상단 안내 카드 */}
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left">
            <p className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
              <span className="text-lg">📊</span>
              수익률만 보면 좋아 보이는 투자도 수수료, 세금, 보유 비용, 레버리지
              위험을 반영하면 전혀 다른 결과가 나올 수 있습니다.
            </p>
          </div>
        </section>

        {/* 탭 */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:justify-center">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex-shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? "bg-brand-500 text-white"
                    : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* 탭 콘텐츠 */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {tab === "real-return" && <RealReturnCalculator />}
          {tab === "liquidation" && <LiquidationCalculator />}
          {tab === "funding" && <FundingCalculator />}
        </section>

        {/* 하단 공통 면책 */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-xs leading-relaxed text-slate-500">{DISCLAIMER}</p>
          </div>
        </section>

        {/* 하단 CTA */}
        <section className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              계산만으로 끝내지 말고, 내 매매 패턴도 확인해보세요.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">
              수익률, 청산 위험, 펀딩비를 계산했다면 이제 내 실제 매매 습관이
              어떤 구조인지 확인해볼 차례입니다.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.analyzer}
                className="w-full rounded-xl bg-brand-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-brand-600 sm:w-auto"
              >
                매매 패턴 분석하기
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
      </main>
      <SiteFooter />
    </>
  );
}

/* ================================================================== */
/* 공통 UI 보조 컴포넌트                                                */
/* ================================================================== */

function CalcCard({
  title,
  purpose,
  children,
}: {
  title: string;
  purpose: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{purpose}</p>
      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30";

function SegToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl bg-slate-800 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            value === o.value
              ? "bg-brand-500 text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

type ResultTone = "neutral" | "good" | "bad";

function ResultCard({
  label,
  value,
  tone = "neutral",
  emphasis = false,
}: {
  label: string;
  value: string;
  tone?: ResultTone;
  emphasis?: boolean;
}) {
  const valueColor =
    tone === "good"
      ? "text-emerald-400"
      : tone === "bad"
        ? "text-rose-400"
        : "text-white";
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`mt-1 font-bold ${valueColor} ${
          emphasis ? "text-2xl" : "text-lg"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Interpretation({ lines }: { lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <div className="mt-5 space-y-2 rounded-xl bg-slate-800/60 p-4">
      {lines.map((l) => (
        <p key={l} className="flex items-start gap-2 text-sm text-slate-200">
          <span className="mt-0.5 text-brand-400">💬</span>
          {l}
        </p>
      ))}
    </div>
  );
}

function CalcNote({ text }: { text: string }) {
  return <p className="mt-4 text-xs leading-relaxed text-slate-500">⚠ {text}</p>;
}

/** 입력값 부족 시 안내 문구 */
function InputError({ message }: { message: string }) {
  return (
    <p className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300">
      ⚠ {message}
    </p>
  );
}

/** 계산 / 초기화 버튼 행 */
function ActionRow({
  calcLabel,
  onCalc,
  onReset,
}: {
  calcLabel: string;
  onCalc: () => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={onCalc}
        className="flex-1 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
      >
        {calcLabel}
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700"
      >
        초기화
      </button>
    </div>
  );
}

/** 결과 하단 — 매매 패턴 분석 유도 CTA */
function ResultCta() {
  return (
    <Link
      href={ROUTES.analyzer}
      className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/10 px-5 py-3.5 text-center text-sm font-semibold text-brand-300 transition-colors hover:bg-brand-500/20"
    >
      이 결과를 바탕으로 내 매매 패턴도 분석하기 →
    </Link>
  );
}

/** 입력 문자열을 number로. 빈값/비정상은 0 */
function num(v: string): number {
  const n = Number(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** 결과 영역으로 부드럽게 스크롤 */
function scrollToResult(el: HTMLElement | null) {
  if (!el) return;
  // 렌더 후 위치가 잡히도록 다음 프레임에 스크롤
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* ================================================================== */
/* 1. 수익률 착시 교정기                                                */
/* ================================================================== */

function RealReturnCalculator() {
  const [assetType, setAssetType] = useState<AssetType>("domestic");
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [buyDate, setBuyDate] = useState("");
  const [sellDate, setSellDate] = useState("");
  const [benchmark, setBenchmark] = useState("");
  const [result, setResult] = useState<RealReturnResult | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const run = () => {
    if (num(buyAmount) <= 0 || num(sellAmount) <= 0) {
      setError("총 매수 금액과 매도 금액을 0보다 큰 값으로 입력해 주세요.");
      setResult(null);
      return;
    }
    setError("");
    setResult(
      calcRealReturn({
        assetType,
        buyAmount: num(buyAmount),
        sellAmount: num(sellAmount),
        benchmarkPct: benchmark.trim() === "" ? null : num(benchmark),
      })
    );
    scrollToResult(resultRef.current);
  };

  const reset = () => {
    setAssetType("domestic");
    setBuyAmount("");
    setSellAmount("");
    setBuyDate("");
    setSellDate("");
    setBenchmark("");
    setResult(null);
    setError("");
  };

  const interpretation: string[] = [];
  if (result) {
    if (result.realReturnPct < result.nominalReturnPct) {
      interpretation.push("수수료와 세금 반영 후 실제 성과가 줄었습니다.");
    }
    if (result.excessReturnPct !== null && result.excessReturnPct < 0) {
      interpretation.push("시장 평균보다 낮은 성과일 수 있습니다.");
    }
  }

  return (
    <CalcCard
      title="수익률 착시 교정기"
      purpose="명목 수익률 속의 세금, 수수료, 벤치마크 성과를 비교해 실제 성과를 계산합니다."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="투자 유형">
            <SegToggle<AssetType>
              value={assetType}
              onChange={setAssetType}
              options={[
                { value: "domestic", label: "국내주식" },
                { value: "overseas", label: "해외주식" },
                { value: "crypto", label: "가상자산" },
              ]}
            />
          </Field>
        </div>
        <Field label="총 매수 금액 (원)">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="예: 10,000,000"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
          />
        </Field>
        <Field label="총 매도 금액 (원)">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="예: 11,000,000"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
          />
        </Field>
        <Field label="매수일자">
          <input
            type="date"
            className={inputClass}
            value={buyDate}
            onChange={(e) => setBuyDate(e.target.value)}
          />
        </Field>
        <Field label="매도일자">
          <input
            type="date"
            className={inputClass}
            value={sellDate}
            onChange={(e) => setSellDate(e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="벤치마크 수익률 (%, 선택 입력)">
            <input
              className={inputClass}
              inputMode="decimal"
              placeholder="예: 5"
              value={benchmark}
              onChange={(e) => setBenchmark(e.target.value)}
            />
          </Field>
        </div>
      </div>

      <ActionRow calcLabel="실수익률 진단하기" onCalc={run} onReset={reset} />

      {error && <InputError message={error} />}

      {result && (
        <div ref={resultRef}>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <ResultCard
              label="명목 수익"
              value={formatWon(result.nominalProfit)}
              tone={result.nominalProfit >= 0 ? "good" : "bad"}
            />
            <ResultCard
              label="명목 수익률"
              value={formatPct(result.nominalReturnPct, true)}
              tone={result.nominalReturnPct >= 0 ? "good" : "bad"}
            />
            <ResultCard label="예상 수수료" value={formatWon(result.estimatedFee)} tone="bad" />
            <ResultCard label="예상 세금" value={formatWon(result.estimatedTax)} tone="bad" />
            <ResultCard
              label="실제 순수익"
              value={formatWon(result.netProfit)}
              tone={result.netProfit >= 0 ? "good" : "bad"}
              emphasis
            />
            <ResultCard
              label="실수익률"
              value={formatPct(result.realReturnPct, true)}
              tone={result.realReturnPct >= 0 ? "good" : "bad"}
              emphasis
            />
            {result.excessReturnPct !== null && (
              <ResultCard
                label="벤치마크 대비 초과수익률"
                value={formatPct(result.excessReturnPct, true)}
                tone={result.excessReturnPct >= 0 ? "good" : "bad"}
              />
            )}
          </div>
          <Interpretation lines={interpretation} />
          <ResultCta />
        </div>
      )}

      <CalcNote text="세금·수수료는 단순 추정치입니다. 실제 부과 기준은 거래소·증권사·과세 제도에 따라 달라질 수 있습니다." />
    </CalcCard>
  );
}

/* ================================================================== */
/* 2. 실시간 청산가 계산기                                              */
/* ================================================================== */

function gradeTone(grade: RiskGrade): ResultTone {
  return grade === "낮음" ? "good" : "bad";
}

function LiquidationCalculator() {
  const [side, setSide] = useState<PositionSide>("long");
  const [entryPrice, setEntryPrice] = useState("");
  const [leverage, setLeverage] = useState("");
  const [margin, setMargin] = useState("");
  const [extraMargin, setExtraMargin] = useState("");
  const [result, setResult] = useState<LiquidationResult | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const run = () => {
    if (num(entryPrice) <= 0 || num(leverage) <= 0 || num(margin) <= 0) {
      setError("진입 가격·레버리지·지정 증거금을 0보다 큰 값으로 입력해 주세요.");
      setResult(null);
      return;
    }
    setError("");
    setResult(
      calcLiquidation({
        side,
        entryPrice: num(entryPrice),
        leverage: num(leverage),
        margin: num(margin),
        extraMargin: num(extraMargin),
      })
    );
    scrollToResult(resultRef.current);
  };

  const reset = () => {
    setSide("long");
    setEntryPrice("");
    setLeverage("");
    setMargin("");
    setExtraMargin("");
    setResult(null);
    setError("");
  };

  return (
    <CalcCard
      title="실시간 청산가 계산기"
      purpose="레버리지 변동과 증거금 조건에 기반해 대략적인 청산 위험 지점을 확인합니다."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="포지션 방향">
            <SegToggle<PositionSide>
              value={side}
              onChange={setSide}
              options={[
                { value: "long", label: "롱 (Long)" },
                { value: "short", label: "숏 (Short)" },
              ]}
            />
          </Field>
        </div>
        <Field label="평균 진입 가격">
          <input
            className={inputClass}
            inputMode="decimal"
            placeholder="예: 50,000"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
          />
        </Field>
        <Field label="레버리지 비율 (배)">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="예: 10"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
          />
        </Field>
        <Field label="지정 증거금 (원)">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="예: 1,000,000"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
          />
        </Field>
        <Field label="방어용 추가 증거금 (원)">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="예: 500,000"
            value={extraMargin}
            onChange={(e) => setExtraMargin(e.target.value)}
          />
        </Field>
      </div>

      <ActionRow calcLabel="청산 위험 계산하기" onCalc={run} onReset={reset} />

      {error && <InputError message={error} />}

      {result && (
        <div ref={resultRef}>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <ResultCard
              label="추정 강제 청산가격"
              value={formatPrice(result.liquidationPrice)}
              tone="bad"
              emphasis
            />
            <ResultCard
              label="진입가 대비 위험 변동폭"
              value={formatPct(result.riskMovePct)}
              tone="bad"
            />
            <ResultCard label="총 증거금" value={formatWon(result.totalMargin)} />
            <ResultCard label="포지션 크기" value={formatWon(result.positionSize)} />
            <ResultCard
              label="리스크 경보 등급"
              value={result.riskGrade}
              tone={gradeTone(result.riskGrade)}
              emphasis
            />
          </div>
          <Interpretation
            lines={[
              "레버리지가 높을수록 작은 가격 변동에도 포지션이 크게 흔들릴 수 있습니다.",
            ]}
          />
          <ResultCta />
        </div>
      )}

      <CalcNote text="단순화된 MVP 공식입니다. 실제 청산가는 거래소의 유지증거금률, 수수료, 펀딩 등에 따라 달라집니다." />
    </CalcCard>
  );
}

/* ================================================================== */
/* 3. 펀딩피 누적 계산기                                                */
/* ================================================================== */

function FundingCalculator() {
  const [side, setSide] = useState<PositionSide>("long");
  const [positionSize, setPositionSize] = useState("");
  const [fundingRate, setFundingRate] = useState("");
  const [holdDays, setHoldDays] = useState("");
  const [result, setResult] = useState<FundingResult | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const run = () => {
    if (num(positionSize) <= 0 || num(fundingRate) <= 0 || num(holdDays) <= 0) {
      setError("포지션 크기·펀딩비율·보유 기간을 0보다 큰 값으로 입력해 주세요.");
      setResult(null);
      return;
    }
    setError("");
    setResult(
      calcFunding({
        side,
        positionSize: num(positionSize),
        fundingRatePct: num(fundingRate),
        holdDays: num(holdDays),
      })
    );
    scrollToResult(resultRef.current);
  };

  const reset = () => {
    setSide("long");
    setPositionSize("");
    setFundingRate("");
    setHoldDays("");
    setResult(null);
    setError("");
  };

  return (
    <CalcCard
      title="펀딩피 누적 계산기"
      purpose="가상자산 무기한 선물 보유 시 8시간 단위로 붙는 수수료/지불 비용을 계산합니다."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="포지션 방향">
            <SegToggle<PositionSide>
              value={side}
              onChange={setSide}
              options={[
                { value: "long", label: "롱 (Long)" },
                { value: "short", label: "숏 (Short)" },
              ]}
            />
          </Field>
        </div>
        <Field label="포지션 총 크기 (원)">
          <input
            className={inputClass}
            inputMode="numeric"
            placeholder="예: 10,000,000"
            value={positionSize}
            onChange={(e) => setPositionSize(e.target.value)}
          />
        </Field>
        <Field label="현재 펀딩비율 (%)">
          <input
            className={inputClass}
            inputMode="decimal"
            placeholder="예: 0.01"
            value={fundingRate}
            onChange={(e) => setFundingRate(e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="보유 예정 기간 (일)">
            <input
              className={inputClass}
              inputMode="numeric"
              placeholder="예: 30"
              value={holdDays}
              onChange={(e) => setHoldDays(e.target.value)}
            />
          </Field>
        </div>
      </div>

      <ActionRow calcLabel="펀딩피 계산하기" onCalc={run} onReset={reset} />

      {error && <InputError message={error} />}

      {result && (
        <div ref={resultRef}>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            <ResultCard
              label="누적 추정 펀딩 비용"
              value={formatWon(result.cumulativeCost)}
              tone="bad"
              emphasis
            />
            <ResultCard label="1일 평균 비용" value={formatWon(result.dailyCost)} tone="bad" />
            <ResultCard label="1주일 보유 시 비용" value={formatWon(result.weeklyCost)} tone="bad" />
            <ResultCard
              label="본전 탈출 요구 변동폭"
              value={formatPct(result.breakevenMovePct)}
              tone="bad"
            />
            <ResultCard
              label="연환산 펀딩 수수료율"
              value={formatPct(result.annualizedRatePct)}
              tone="bad"
            />
          </div>
          <Interpretation
            lines={[
              "포지션을 오래 보유할수록 방향을 맞혀도 펀딩 비용이 수익을 갉아먹을 수 있습니다.",
            ]}
          />
          <ResultCta />
        </div>
      )}

      <CalcNote text="펀딩비는 8시간마다 변동하며 방향(롱/숏)에 따라 수취가 될 수도 있습니다. 본 계산은 지불 기준 단순 추정입니다." />
    </CalcCard>
  );
}
