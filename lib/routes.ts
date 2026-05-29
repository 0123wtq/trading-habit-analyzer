/**
 * 앱 전역 라우트 정의.
 *
 * 구현 완료(사용자 메뉴/버튼에 노출): `/`(랜딩), `/analyzer`(매매 패턴 분석기),
 * `/report`(분석 리포트), `/calculators`(투자 계산기), `/pricing`(요금제).
 *
 * 아래 `dashboard`/`journal`/`login`/`signup`은 아직 페이지가 없으므로 상수만
 * 남겨두고 사용자가 클릭 가능한 메뉴·버튼에는 노출하지 않습니다. 해당 페이지를
 * 추가한 뒤 헤더/푸터 등에 링크를 다시 연결하세요.
 */
export const ROUTES = {
  home: "/",
  riskTest: "/risk-test",
  riskResult: "/risk-result",
  analyzer: "/analyzer",
  report: "/report",
  calculators: "/calculators",
  pricing: "/pricing",
  // 미구현 — 메뉴에 노출 금지
  dashboard: "/dashboard",
  journal: "/journal",
  login: "/login",
  signup: "/signup",
} as const;

export type RouteKey = keyof typeof ROUTES;
