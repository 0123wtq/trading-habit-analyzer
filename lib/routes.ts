/**
 * 앱 전역 라우트 정의.
 *
 * 구현 완료: `/`(랜딩), `/analyzer`(매매 패턴 분석기), `/report`(분석 리포트).
 * 나머지 경로는 추후 페이지가 추가될 자리이며, 버튼/링크는 이미 이 경로를
 * 가리키도록 연결되어 있어 해당 페이지만 만들면 곧바로 동작합니다.
 */
export const ROUTES = {
  home: "/",
  analyzer: "/analyzer",
  report: "/report",
  dashboard: "/dashboard",
  journal: "/journal",
  pricing: "/pricing",
  login: "/login",
  signup: "/signup",
} as const;

export type RouteKey = keyof typeof ROUTES;
