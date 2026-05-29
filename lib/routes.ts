/**
 * 앱 전역 라우트 정의.
 *
 * 현재는 `/` 랜딩 페이지만 구현되어 있고, 아래 경로들은 추후 페이지가
 * 추가될 자리입니다. 랜딩 페이지의 버튼/링크는 이미 이 경로를 가리키도록
 * 연결되어 있으므로, 해당 페이지만 만들면 곧바로 동작합니다.
 */
export const ROUTES = {
  home: "/",
  analyze: "/analyze",
  dashboard: "/dashboard",
  journal: "/journal",
  pricing: "/pricing",
  login: "/login",
  signup: "/signup",
} as const;

export type RouteKey = keyof typeof ROUTES;
