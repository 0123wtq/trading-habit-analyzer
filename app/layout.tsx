import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "돈길 | 당신의 매매 습관을 데이터로",
  description:
    "감정적 매매, 과도한 거래, 손절 지연 같은 나쁜 습관을 자동으로 찾아내고 개선 방향을 제시하는 매매 습관 분석 서비스 돈길입니다.",
  keywords: [
    "트레이딩",
    "매매일지",
    "투자 습관",
    "매매 습관 분석",
    "주식",
    "트레이딩 저널",
  ],
  openGraph: {
    title: "돈길",
    description:
      "당신의 매매 기록을 분석해 반복되는 실수와 나쁜 습관을 찾아드립니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
