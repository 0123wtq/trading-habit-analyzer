/**
 * 투자 계산기 — 순수 계산 로직.
 *
 * 외부 API 없이 프론트엔드에서 단순 수식으로만 처리하는 추정 도구입니다.
 * 모든 결과는 투자 참고용이며 종목 추천/수익 보장이 아닙니다.
 */

/* ------------------------------------------------------------------ */
/* 1. 수익률 착시 교정기                                                */
/* ------------------------------------------------------------------ */

export type AssetType = "domestic" | "overseas" | "crypto";

export interface RealReturnInput {
  assetType: AssetType;
  buyAmount: number;
  sellAmount: number;
  /** 선택 입력. null이면 미입력 */
  benchmarkPct: number | null;
}

export interface RealReturnResult {
  nominalProfit: number;
  nominalReturnPct: number;
  estimatedFee: number;
  estimatedTax: number;
  netProfit: number;
  realReturnPct: number;
  /** 벤치마크 미입력 시 null */
  excessReturnPct: number | null;
}

/** 수수료율: 매수+매도 합계의 0.015% */
const FEE_RATE = 0.00015;
/** 국내주식 거래세: 매도 금액의 0.18% */
const DOMESTIC_TAX_RATE = 0.0018;
/** 해외주식 양도세 단순 추정: 수익의 22% */
const OVERSEAS_TAX_RATE = 0.22;

export function calcRealReturn(input: RealReturnInput): RealReturnResult {
  const { assetType, buyAmount, sellAmount, benchmarkPct } = input;

  const nominalProfit = sellAmount - buyAmount;
  const nominalReturnPct =
    buyAmount > 0 ? (nominalProfit / buyAmount) * 100 : 0;

  const estimatedFee = (buyAmount + sellAmount) * FEE_RATE;

  let estimatedTax = 0;
  if (assetType === "domestic") {
    estimatedTax = sellAmount * DOMESTIC_TAX_RATE;
  } else if (assetType === "overseas") {
    estimatedTax = nominalProfit > 0 ? nominalProfit * OVERSEAS_TAX_RATE : 0;
  } else {
    // crypto: MVP에서는 0
    estimatedTax = 0;
  }

  const netProfit = nominalProfit - estimatedFee - estimatedTax;
  const realReturnPct = buyAmount > 0 ? (netProfit / buyAmount) * 100 : 0;

  const excessReturnPct =
    benchmarkPct !== null ? realReturnPct - benchmarkPct : null;

  return {
    nominalProfit,
    nominalReturnPct,
    estimatedFee,
    estimatedTax,
    netProfit,
    realReturnPct,
    excessReturnPct,
  };
}

/* ------------------------------------------------------------------ */
/* 2. 실시간 청산가 계산기                                              */
/* ------------------------------------------------------------------ */

export type PositionSide = "long" | "short";

export interface LiquidationInput {
  side: PositionSide;
  entryPrice: number;
  leverage: number;
  /** 지정 증거금 */
  margin: number;
  /** 방어용 추가 증거금 */
  extraMargin: number;
}

export type RiskGrade = "낮음" | "주의" | "위험" | "매우 위험";

export interface LiquidationResult {
  totalMargin: number;
  positionSize: number;
  /** 위험 변동률(%) */
  riskMovePct: number;
  liquidationPrice: number;
  riskGrade: RiskGrade;
}

/** 레버리지 기준 리스크 경보 등급 */
export function leverageRiskGrade(leverage: number): RiskGrade {
  if (leverage <= 3) return "낮음";
  if (leverage <= 10) return "주의";
  if (leverage <= 20) return "위험";
  return "매우 위험";
}

export function calcLiquidation(input: LiquidationInput): LiquidationResult {
  const { side, entryPrice, leverage, margin, extraMargin } = input;

  const totalMargin = margin + extraMargin;
  const positionSize = margin * leverage;
  const riskMovePct =
    positionSize > 0 ? (totalMargin / positionSize) * 100 : 0;

  const liquidationPrice =
    side === "long"
      ? entryPrice * (1 - riskMovePct / 100)
      : entryPrice * (1 + riskMovePct / 100);

  return {
    totalMargin,
    positionSize,
    riskMovePct,
    liquidationPrice,
    riskGrade: leverageRiskGrade(leverage),
  };
}

/* ------------------------------------------------------------------ */
/* 3. 펀딩피 누적 계산기                                                */
/* ------------------------------------------------------------------ */

export interface FundingInput {
  side: PositionSide;
  positionSize: number;
  /** 현재 펀딩비율(%) */
  fundingRatePct: number;
  /** 보유 예정 기간(일) */
  holdDays: number;
}

export interface FundingResult {
  /** 1회 펀딩 비용 */
  perFundingCost: number;
  totalFundings: number;
  cumulativeCost: number;
  dailyCost: number;
  weeklyCost: number;
  /** 본전 탈출 요구 변동폭(%) */
  breakevenMovePct: number;
  /** 연환산 펀딩 수수료율(%) */
  annualizedRatePct: number;
}

/** 하루 펀딩 횟수 (8시간 단위) */
const FUNDINGS_PER_DAY = 3;

export function calcFunding(input: FundingInput): FundingResult {
  const { positionSize, fundingRatePct, holdDays } = input;

  const totalFundings = holdDays * FUNDINGS_PER_DAY;
  const perFundingCost = (positionSize * fundingRatePct) / 100;
  const cumulativeCost = perFundingCost * totalFundings;
  const dailyCost = perFundingCost * FUNDINGS_PER_DAY;
  const weeklyCost = dailyCost * 7;
  const breakevenMovePct =
    positionSize > 0 ? (cumulativeCost / positionSize) * 100 : 0;
  const annualizedRatePct = fundingRatePct * FUNDINGS_PER_DAY * 365;

  return {
    perFundingCost,
    totalFundings,
    cumulativeCost,
    dailyCost,
    weeklyCost,
    breakevenMovePct,
    annualizedRatePct,
  };
}

/* ------------------------------------------------------------------ */
/* 포맷 헬퍼                                                            */
/* ------------------------------------------------------------------ */

/** 원화 표기: 소수점 반올림 후 천단위 콤마 */
export function formatWon(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return `${Math.round(n).toLocaleString("ko-KR")}원`;
}

/** 퍼센트 표기: 부호 포함, 소수 둘째 자리 */
export function formatPct(n: number, withSign = false): string {
  if (!Number.isFinite(n)) return "-";
  const sign = withSign && n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

/** 가격 표기: 소수 둘째 자리까지, 천단위 콤마 */
export function formatPrice(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
