/**
 * 매매 패턴 분석 — mock 엔진.
 *
 * 실제 AI/서버 연동은 아직 없습니다. 입력된 거래내역에서 종목명, 매수/매도,
 * 수익률, 가격, 수량 정도를 간단히 파싱한 뒤, 파싱으로 계산 가능한 지표
 * (승률·평균 수익률·손익비·최대 수익/손실 거래 등)는 실제로 계산하고,
 * 시간대별 승률·보유기간·반복 실수·AI 코멘트 등 상세 항목은 mock 값으로
 * 채워 완전한 리포트 형태로 반환합니다.
 */

/** 분석 결과를 저장하는 localStorage 키 */
export const ANALYSIS_STORAGE_KEY = "tha_analysis_result";

/** /analyzer 샘플 데이터 불러오기 버튼에 사용되는 예시 거래내역 */
export const SAMPLE_DATA = `2026.04.10 09:12:05 삼성전자 매수 78,500원 100주
2026.05.10 09:45:00 삼성전자 매도 68,200원 100주 -13.12%
2026.05.11 14:05:00 현대차 매수 245,000원 10주
2026.05.12 11:20:00 현대차 매도 256,000원 10주 4.49%
2026.05.14 09:08:00 SK하이닉스 매수 185,000원 30주
2026.05.14 09:22:00 SK하이닉스 매도 176,000원 30주 -4.86%
2026.05.15 13:00:00 셀트리온 매수 191,000원 20주
2026.05.18 14:30:00 셀트리온 매도 196,500원 20주 2.88%
2026.05.19 14:50:00 삼성SDI 매수 380,000원 5주
2026.05.20 09:15:00 삼성SDI 매도 368,500원 5주 -3.03%`;

export type TradeSide = "매수" | "매도";

export interface ParsedTrade {
  /** 원본 줄 */
  raw: string;
  date: string | null;
  time: string | null;
  stock: string | null;
  side: TradeSide | null;
  price: number | null;
  shares: number | null;
  /** 수익률(%) — 보통 매도 줄에만 존재 */
  returnPct: number | null;
}

export interface TimeWinRate {
  hour: string;
  rate: number;
}

export interface AnalysisResult {
  /** 분석 시각(ISO 문자열) */
  analyzedAt: string;
  /** 입력이 비어 fallback 샘플 리포트를 보여주는 경우 true */
  isFallback: boolean;
  /** 파싱된 거래(원본) */
  trades: ParsedTrade[];

  /** 상단 종합 진단 문구 */
  diagnosis: string[];

  /** 핵심 성과 요약 */
  summary: {
    totalTrades: number;
    winTrades: number;
    lossTrades: number;
    totalPnl: number;
    avgReturnPct: number;
    profitFactor: number;
  };

  /** 차트 1. 시간대별 매매 승률 */
  timeWinRates: TimeWinRate[];
  weakestTimeNote: string;

  /** 차트 2. 수익 vs 손실 평균 보유 기간(일) */
  holdPeriod: {
    profitDays: number;
    lossDays: number;
    note: string;
  };

  /** 차트 3. 투자 승률 & 손익비 */
  winRate: {
    winRatePct: number;
    avgProfitPct: number;
    avgLossPct: number;
    profitFactor: number;
    warning: string;
  };

  /** 수익/손실 거래 상세 비교 */
  winDetail: {
    avgProfitPct: number;
    maxTradeLabel: string;
    count: number;
  };
  lossDetail: {
    avgLossPct: number;
    maxTradeLabel: string;
    count: number;
  };

  /** 반복 실수 TOP 3 */
  topMistakes: { title: string; points: string[] }[];

  /** AI 매매 리포트 */
  aiReport: {
    summary: string;
    good: string;
    problem: string;
    dataAnalysis: string;
    repeatedMistake: string;
  };

  /** 다음 거래에서 지켜야 할 규칙 */
  rules: string[];

  /** 공유문구 */
  shareText: string;
}

/** 숫자 문자열("78,500")을 number로 변환. 실패 시 null */
function toNumber(value: string | undefined | null): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/**
 * 거래내역 텍스트를 줄 단위로 파싱한다.
 * 예) "2026.04.10 09:12:05 삼성전자 매수 78,500원 100주 -13.12%"
 */
export function parseTrades(raw: string): ParsedTrade[] {
  if (!raw) return [];

  const dateRe = /\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/;
  const timeRe = /\d{1,2}:\d{2}(?::\d{2})?/;
  const sideRe = /(매수|매도|BUY|SELL|buy|sell)/;
  const priceRe = /([\d,]+)\s*원/;
  const sharesRe = /([\d,]+)\s*주/;
  const pctRe = /(-?\d+(?:\.\d+)?)\s*%/;

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map<ParsedTrade>((line) => {
      const sideMatch = line.match(sideRe);
      let side: TradeSide | null = null;
      if (sideMatch) {
        const s = sideMatch[1].toLowerCase();
        side = s === "매수" || s === "buy" ? "매수" : "매도";
      }

      // 종목명: 시각 토큰 뒤 ~ 매수/매도 토큰 앞 구간을 추출
      let stock: string | null = null;
      const timeMatch = line.match(timeRe);
      if (sideMatch && sideMatch.index !== undefined) {
        const start =
          timeMatch && timeMatch.index !== undefined
            ? timeMatch.index + timeMatch[0].length
            : 0;
        stock = line.slice(start, sideMatch.index).trim() || null;
      }

      const priceMatch = line.match(priceRe);
      const sharesMatch = line.match(sharesRe);
      const pctMatch = line.match(pctRe);

      return {
        raw: line,
        date: line.match(dateRe)?.[0] ?? null,
        time: timeMatch?.[0] ?? null,
        stock,
        side,
        price: priceMatch ? toNumber(priceMatch[1]) : null,
        shares: sharesMatch ? toNumber(sharesMatch[1]) : null,
        returnPct: pctMatch ? toNumber(pctMatch[1]) : null,
      };
    });
}

/** 평균 계산 헬퍼 */
function mean(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** 소수점 둘째 자리 반올림 */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * 시간대별 승률 mock. (실제 계산이 아니라 데모용 고정값)
 */
const MOCK_TIME_WIN_RATES: TimeWinRate[] = [
  { hour: "9시", rate: 0 },
  { hour: "10시", rate: 30 },
  { hour: "11시", rate: 50 },
  { hour: "12시", rate: 60 },
  { hour: "13시", rate: 40 },
  { hour: "14시", rate: 70 },
  { hour: "15시", rate: 50 },
];

const MOCK_TOP_MISTAKES: { title: string; points: string[] }[] = [
  {
    title: "장 초반 뇌동매매와 충동적 진입",
    points: [
      "전체 거래 중 오전 9시~10시 사이 거래 비중이 높습니다.",
      "장이 열리자마자 변동성에 휩쓸린 흔적이 있습니다.",
      "급하게 추격 매수했다가 고점에 물리는 패턴이 반복됩니다.",
    ],
  },
  {
    title: "손실 방치 및 수익 조기 실현",
    points: [
      "수익은 빨리 확정하지만 손실 종목은 반등을 기대하며 오래 보유합니다.",
      "작은 수익금을 큰 손실이 삼키는 구조입니다.",
    ],
  },
  {
    title: "잦은 단타로 인한 누적 비용 증가",
    points: [
      "실제 매매 차익보다 거래 빈도가 높습니다.",
      "수수료와 세금이 누적되면 장기 성과를 갉아먹을 수 있습니다.",
    ],
  },
];

const MOCK_RULES: string[] = [
  "장 시작 후 10분 동안은 진입 금지",
  "진입 전 손절가와 목표가를 반드시 입력",
  "하루 거래 횟수를 최대 3회로 제한",
];

const SHARE_TEXT = `🔥 내 최대 투자 실수: [장 초반 뇌동매매와 충동적 진입] 😭
매매 기록을 분석해봤더니 충격적인 결과가 나왔습니다.
👉 지금 무료로 투자 유형과 반복되는 실수를 진단해 보세요!`;

const DIAGNOSIS = [
  "승률이 40%로 매우 저조합니다.",
  "타점이 정교하지 않거나 추격 매수가 몸에 배어 있습니다.",
  "매매 횟수를 줄이고 진입 기준을 먼저 세워야 합니다.",
];

const AI_REPORT = {
  summary:
    "승률보다 손익비가 발목을 잡는, 전형적인 '익절은 짧게 손절은 길게' 패턴입니다.",
  good:
    "현대차·셀트리온처럼 추세가 맞을 때는 짧은 보유로 수익을 확정한 점은 긍정적입니다.",
  problem:
    "가장 큰 문제는 손실 거래를 오래 들고 가 손실 폭을 키운 것입니다. 삼성전자에서 -13.12%까지 손실이 확대됐습니다.",
  dataAnalysis:
    "평균 수익률 +3.69% 대비 평균 손실률 -7%로 손익비가 0.53에 불과합니다. 승률 40%에서는 손익비 1.0 미만이면 계좌가 우하향합니다.",
  repeatedMistake:
    "오전 9시대 진입의 승률이 0%로, 장 초반 충동적 진입이 손실의 핵심 원인입니다.",
};

/**
 * 파싱된 거래 + mock 상세 분석을 합쳐 완전한 리포트를 만든다.
 */
function buildAnalysis(
  trades: ParsedTrade[],
  opts: { isFallback: boolean }
): AnalysisResult {
  // 수익률이 기록된 매도 거래를 한 라운드의 결과로 본다.
  const closed = trades.filter(
    (t) => t.side === "매도" && t.returnPct !== null
  );
  const returns = closed.map((t) => t.returnPct as number);

  const wins = returns.filter((r) => r > 0);
  const losses = returns.filter((r) => r < 0);

  const hasData = returns.length > 0;

  // 파싱으로 계산 가능한 지표는 실제 계산, 데이터가 없으면 spec 기준 mock 값.
  const totalTrades = hasData ? closed.length : 5;
  const winTrades = hasData ? wins.length : 2;
  const lossTrades = hasData ? losses.length : 3;
  const avgReturnPct = hasData ? round2(mean(returns)) : -2.73;
  const avgProfitPct = hasData && wins.length > 0 ? round2(mean(wins)) : 3.69;
  const avgLossPct = hasData && losses.length > 0 ? round2(mean(losses)) : -7;
  const winRatePct =
    totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 40;
  const profitFactor =
    avgLossPct !== 0 ? round2(avgProfitPct / Math.abs(avgLossPct)) : 0.53;

  // 최대 수익/손실 거래
  let maxWinLabel = "현대차 +4.49%";
  let maxLossLabel = "삼성전자 -13.12%";
  if (hasData) {
    const best = [...closed].sort(
      (a, b) => (b.returnPct as number) - (a.returnPct as number)
    )[0];
    const worst = [...closed].sort(
      (a, b) => (a.returnPct as number) - (b.returnPct as number)
    )[0];
    if (best) {
      const sign = (best.returnPct as number) >= 0 ? "+" : "";
      maxWinLabel = `${best.stock ?? "종목"} ${sign}${best.returnPct}%`;
    }
    if (worst) {
      const sign = (worst.returnPct as number) >= 0 ? "+" : "";
      maxLossLabel = `${worst.stock ?? "종목"} ${sign}${worst.returnPct}%`;
    }
  }

  // 총 손익: 신뢰도 있는 산출이 어려워 mock 고정값 사용
  const totalPnl = -979092;

  return {
    analyzedAt: new Date().toISOString(),
    isFallback: opts.isFallback,
    trades,

    diagnosis: DIAGNOSIS,

    summary: {
      totalTrades,
      winTrades,
      lossTrades,
      totalPnl,
      avgReturnPct,
      profitFactor,
    },

    timeWinRates: MOCK_TIME_WIN_RATES,
    weakestTimeNote: "9시 승률 0% - 가장 취약한 구간",

    holdPeriod: {
      profitDays: 2,
      lossDays: 10.3,
      note: "수익은 빨리 팔고, 손실은 오래 들고 있습니다.",
    },

    winRate: {
      winRatePct,
      avgProfitPct,
      avgLossPct,
      profitFactor,
      warning:
        "승률이 높아도 손익비가 1.0 미만이면 계좌는 장기적으로 우하향할 수 있습니다.",
    },

    winDetail: {
      avgProfitPct,
      maxTradeLabel: maxWinLabel,
      count: winTrades,
    },
    lossDetail: {
      avgLossPct,
      maxTradeLabel: maxLossLabel,
      count: lossTrades,
    },

    topMistakes: MOCK_TOP_MISTAKES,
    aiReport: AI_REPORT,
    rules: MOCK_RULES,
    shareText: SHARE_TEXT,
  };
}

/**
 * 입력 텍스트를 분석해 리포트를 생성한다.
 * 입력이 비어 있으면 샘플 데이터 기반 fallback 리포트를 반환한다.
 */
export function analyzeTrades(raw: string): AnalysisResult {
  const trimmed = (raw ?? "").trim();
  if (trimmed.length === 0) {
    return buildAnalysis(parseTrades(SAMPLE_DATA), { isFallback: true });
  }
  return buildAnalysis(parseTrades(trimmed), { isFallback: false });
}

/** 입력 없이 보여줄 fallback(샘플) 리포트 */
export function getFallbackAnalysis(): AnalysisResult {
  return buildAnalysis(parseTrades(SAMPLE_DATA), { isFallback: true });
}

/** 분석 결과를 localStorage에 저장 */
export function saveAnalysis(result: AnalysisResult): void {
  try {
    window.localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // 저장 실패는 무시 (시크릿 모드 등)
  }
}

/** localStorage에서 분석 결과를 읽음. 없으면 null */
export function loadAnalysis(): AnalysisResult | null {
  try {
    const raw = window.localStorage.getItem(ANALYSIS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AnalysisResult;
  } catch {
    return null;
  }
}
