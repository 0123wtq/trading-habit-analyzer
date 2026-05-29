/**
 * 계좌 위험도 테스트 — 설문 데이터 + 유형/위험도 산출 로직.
 *
 * 외부 API/DB 없이 프론트엔드에서만 계산합니다. 결과는 투자 참고용이며
 * 종목 추천·수익 보장이 아닙니다.
 */

/** 결과를 저장하는 localStorage 키 */
export const RISK_RESULT_KEY = "risk_test_result";

/** 결과 유형 키 */
export type RiskTypeKey =
  | "loss-delay" // 손절 지연형
  | "chase" // 추격매수 위험형
  | "emotional" // 기준 없는 감정매매형
  | "anxious"; // 초보 불안형

/** 위험도 등급 */
export type RiskLevel = "낮음" | "중간" | "높음" | "매우 높음";

export interface RiskOption {
  label: string;
  /** 위험 점수(0~2): 클수록 위험 */
  score: number;
  /** 가중되는 유형 (없을 수 있음) */
  type?: RiskTypeKey;
}

export interface RiskQuestion {
  id: number;
  question: string;
  options: RiskOption[];
  /** 복수 유형에 영향을 주는 선택형(Q8: 필요 도움)은 별도 처리 */
  multi?: boolean;
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: 1,
    question: "수익이 나면 보통 어떻게 하나요?",
    options: [
      { label: "조금만 올라도 바로 판다", score: 1, type: "anxious" },
      { label: "목표가까지 기다린다", score: 0 },
      { label: "더 오를까 봐 못 판다", score: 2, type: "chase" },
    ],
  },
  {
    id: 2,
    question: "손실이 나면 보통 어떻게 하나요?",
    options: [
      { label: "손절 기준대로 자른다", score: 0 },
      { label: "본전까지 기다린다", score: 2, type: "loss-delay" },
      { label: "물타기로 버틴다", score: 2, type: "loss-delay" },
    ],
  },
  {
    id: 3,
    question: "매수 전에 손절가를 정하나요?",
    options: [
      { label: "항상 정한다", score: 0 },
      { label: "가끔 정한다", score: 1, type: "emotional" },
      { label: "거의 정하지 않는다", score: 2, type: "emotional" },
    ],
  },
  {
    id: 4,
    question: "장 초반 급등주를 보면 어떤가요?",
    options: [
      { label: "거의 안 따라간다", score: 0 },
      { label: "가끔 따라간다", score: 1, type: "chase" },
      { label: "자주 못 참고 들어간다", score: 2, type: "chase" },
    ],
  },
  {
    id: 5,
    question: "투자 결정을 주로 어떻게 하나요?",
    options: [
      { label: "내 기준과 계획", score: 0 },
      { label: "유튜브/뉴스 참고", score: 1, type: "emotional" },
      { label: "단톡방/주변 말/급등 분위기", score: 2, type: "emotional" },
    ],
  },
  {
    id: 6,
    question: "하루 매매 횟수는 어느 정도인가요?",
    options: [
      { label: "거의 안 한다", score: 0 },
      { label: "1~3회", score: 1 },
      { label: "4회 이상", score: 2, type: "chase" },
    ],
  },
  {
    id: 7,
    question: "내 계좌가 왜 줄었는지 설명할 수 있나요?",
    options: [
      { label: "어느 정도 설명 가능", score: 0 },
      { label: "대충은 안다", score: 1, type: "anxious" },
      { label: "잘 모르겠다", score: 2, type: "anxious" },
    ],
  },
  {
    id: 8,
    question: "지금 가장 필요한 도움은 무엇인가요?",
    multi: false,
    options: [
      { label: "시장 흐름 정리", score: 0, type: "anxious" },
      { label: "분할매수 기준", score: 0, type: "chase" },
      { label: "손절/익절 기준", score: 0, type: "loss-delay" },
      { label: "계좌 복기", score: 0, type: "emotional" },
      { label: "혼자 매매하지 않는 환경", score: 0, type: "anxious" },
    ],
  },
];

export interface RiskTypeInfo {
  key: RiskTypeKey;
  name: string;
  oneLiner: string;
  mistakes: string[];
  rules: string[];
}

export const RISK_TYPES: Record<RiskTypeKey, RiskTypeInfo> = {
  "loss-delay": {
    key: "loss-delay",
    name: "손절 지연형",
    oneLiner:
      "수익은 짧게 끊지만 손실은 오래 끌고 가, 한 번의 큰 손실이 계좌를 갉아먹는 유형입니다.",
    mistakes: [
      "손절 기준을 정하지 않거나, 정해도 지키지 못합니다.",
      "본전 심리로 손실 종목을 끝까지 들고 갑니다.",
      "물타기로 평단을 낮추다 손실 규모를 키웁니다.",
    ],
    rules: [
      "매수 전 손절가를 먼저 정하고 주문과 함께 입력하기",
      "물타기 금지 — 추가 매수는 사전 계획에 있을 때만",
      "손실 -N%에 도달하면 감정과 무관하게 기계적으로 정리하기",
    ],
  },
  chase: {
    key: "chase",
    name: "추격매수 위험형",
    oneLiner:
      "장 초반 급등과 분위기에 휩쓸려 고점에서 따라 들어가는 충동적 진입이 잦은 유형입니다.",
    mistakes: [
      "급등주를 보면 못 참고 추격 매수합니다.",
      "더 오를까 봐 익절을 미루다 되돌림을 맞습니다.",
      "매매 횟수가 많아 수수료·세금이 누적됩니다.",
    ],
    rules: [
      "장 시작 후 10분 동안은 신규 진입 금지",
      "진입 전 목표가·손절가를 먼저 정하고 들어가기",
      "하루 거래 횟수를 최대 3회로 제한하기",
    ],
  },
  emotional: {
    key: "emotional",
    name: "기준 없는 감정매매형",
    oneLiner:
      "명확한 진입·청산 기준 없이 뉴스·단톡방·분위기에 따라 매매하는 유형입니다.",
    mistakes: [
      "매수·매도 기준이 그때그때 달라집니다.",
      "외부 정보(단톡방·급등 분위기)에 의존해 결정합니다.",
      "복기가 없어 같은 실수를 반복합니다.",
    ],
    rules: [
      "매매 전 진입 근거를 한 줄로 적고 시작하기",
      "외부 정보는 참고만, 최종 판단은 내 기준으로",
      "거래마다 메모를 남기고 주 1회 복기하기",
    ],
  },
  anxious: {
    key: "anxious",
    name: "초보 불안형",
    oneLiner:
      "아직 자신만의 기준이 자리 잡지 않아, 작은 변동에도 흔들리고 계좌 상황을 파악하기 어려운 유형입니다.",
    mistakes: [
      "조금만 올라도 불안해서 일찍 팔아버립니다.",
      "계좌가 왜 줄었는지 스스로 설명하기 어렵습니다.",
      "시장 흐름과 내 매매를 연결해 보지 못합니다.",
    ],
    rules: [
      "소액·소수 종목으로 매매를 단순하게 유지하기",
      "매매일지로 진입 이유와 결과를 기록하기",
      "시장 흐름을 매일 짧게라도 정리하는 습관 만들기",
    ],
  },
};

/** 사용자 응답: 각 질문 id → 선택한 옵션 인덱스 */
export type RiskAnswers = Record<number, number>;

export interface RiskTestResult {
  answers: RiskAnswers;
  typeKey: RiskTypeKey;
  typeName: string;
  level: RiskLevel;
  /** 0~100 정규화 위험 점수 */
  riskScore: number;
  oneLiner: string;
  mistakes: string[];
  rules: string[];
  createdAt: string;
}

/** 위험 점수를 4단계 등급으로 변환 */
function toLevel(scorePct: number): RiskLevel {
  if (scorePct < 25) return "낮음";
  if (scorePct < 50) return "중간";
  if (scorePct < 75) return "높음";
  return "매우 높음";
}

/**
 * 응답으로 유형/위험도를 계산한다.
 *
 * - 위험도: Q1~Q7의 위험 점수 합(최대 14)을 0~100으로 정규화.
 * - 유형: 각 선택지의 type 가중치를 합산해 최다 득표 유형 선정.
 *   동점이면 우선순위(손절 지연 → 추격 → 감정 → 불안)로 결정.
 *   Q8(필요 도움)은 유형 가중치에 +1로 반영(타이브레이커 역할).
 */
export function evaluateRisk(answers: RiskAnswers): RiskTestResult {
  let rawScore = 0;
  let maxScore = 0;
  const typeVotes: Record<RiskTypeKey, number> = {
    "loss-delay": 0,
    chase: 0,
    emotional: 0,
    anxious: 0,
  };

  for (const q of RISK_QUESTIONS) {
    const idx = answers[q.id];
    const opt = idx != null ? q.options[idx] : undefined;

    // Q8은 위험 점수에 넣지 않고(필요 도움 선택) 유형 가중치만 반영
    if (q.id !== 8) {
      maxScore += 2;
      if (opt) rawScore += opt.score;
    }
    if (opt?.type) {
      // 위험 점수가 높은 선택일수록 유형 가중치를 크게
      typeVotes[opt.type] += q.id === 8 ? 1 : opt.score || 0.5;
    }
  }

  const riskScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
  const level = toLevel(riskScore);

  // 최다 득표 유형 (동점 시 우선순위)
  const priority: RiskTypeKey[] = [
    "loss-delay",
    "chase",
    "emotional",
    "anxious",
  ];
  let best: RiskTypeKey = "anxious";
  let bestVotes = -1;
  for (const key of priority) {
    if (typeVotes[key] > bestVotes) {
      bestVotes = typeVotes[key];
      best = key;
    }
  }

  const info = RISK_TYPES[best];
  return {
    answers,
    typeKey: best,
    typeName: info.name,
    level,
    riskScore,
    oneLiner: info.oneLiner,
    mistakes: info.mistakes,
    rules: info.rules,
    createdAt: new Date().toISOString(),
  };
}

/** 결과를 localStorage에 저장 */
export function saveRiskResult(result: RiskTestResult): void {
  try {
    window.localStorage.setItem(RISK_RESULT_KEY, JSON.stringify(result));
  } catch {
    // 저장 실패는 무시
  }
}

/** 결과를 localStorage에서 로드. 없으면 null */
export function loadRiskResult(): RiskTestResult | null {
  try {
    const raw = window.localStorage.getItem(RISK_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RiskTestResult;
  } catch {
    return null;
  }
}

/** 공유문구 (현재 사이트 origin 포함) */
export function buildRiskShareText(result: RiskTestResult, origin?: string): string {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "") ||
    "https://trading-habit-analyzer.vercel.app";
  return `🔍 내 계좌 위험도: ${result.level} / 투자 유형: ${result.typeName}
3분 만에 내 매매 습관을 진단해봤어요.
나도 무료로 확인해보기:
${base}/risk-test`;
}
