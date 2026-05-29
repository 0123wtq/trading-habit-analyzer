# 트레이딩 습관 분석기 (Trading Habit Analyzer)

매매 기록을 분석해 반복되는 실수와 나쁜 습관을 찾아내고, 개선 방향을 제시하는 웹 서비스입니다.

## 기술 스택

- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/)

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 현재 구현 범위

- `/` — 메인 랜딩 페이지
- 최초 방문자 환영 팝업 (localStorage 기반, 한 번 닫으면 다시 표시되지 않음)

## 라우팅 (연결 준비 완료, 페이지는 추후 구현)

모든 라우트는 `lib/routes.ts` 에 정의되어 있으며, 랜딩 페이지의 버튼/링크가
이미 아래 경로를 가리키도록 연결되어 있습니다. 해당 페이지 파일만 추가하면
바로 동작합니다.

| 경로          | 설명               | 상태       |
| ------------- | ------------------ | ---------- |
| `/`           | 메인 랜딩 페이지   | ✅ 구현됨  |
| `/analyze`    | 분석 시작          | ⏳ 예정    |
| `/dashboard`  | 대시보드 / 데모    | ⏳ 예정    |
| `/journal`    | 매매일지           | ⏳ 예정    |
| `/pricing`    | 요금제             | ⏳ 예정    |
| `/login`      | 로그인             | ⏳ 예정    |
| `/signup`     | 회원가입           | ⏳ 예정    |

## 프로젝트 구조

```
app/
  layout.tsx        # 루트 레이아웃 + 메타데이터
  page.tsx          # 메인 랜딩 페이지
  globals.css       # 전역 스타일 / Tailwind
components/
  SiteHeader.tsx    # 상단 내비게이션 (모바일 메뉴 포함)
  Hero.tsx          # 히어로 섹션
  Features.tsx      # 기능 소개
  HowItWorks.tsx    # 이용 방법 3단계
  CtaSection.tsx    # 하단 CTA
  SiteFooter.tsx    # 푸터
  FirstVisitPopup.tsx # 최초 방문자 팝업
lib/
  routes.ts         # 전역 라우트 정의
```
