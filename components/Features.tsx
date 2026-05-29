const FEATURES = [
  {
    title: "습관 자동 진단",
    description:
      "거래 내역을 업로드하면 과매매, 추격매수, 손절 지연 등 반복되는 패턴을 자동으로 찾아냅니다.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    title: "감정 매매 탐지",
    description:
      "급등·급락 구간에서의 충동적 거래를 표시해, 감정에 휘둘린 의사결정을 한눈에 확인할 수 있습니다.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
  },
  {
    title: "손익 패턴 리포트",
    description:
      "시간대·종목·보유기간별 손익을 분해해 어떤 상황에서 돈을 벌고 잃는지 명확하게 보여줍니다.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    ),
  },
  {
    title: "맞춤 개선 가이드",
    description:
      "발견된 습관을 토대로 다음 거래에서 적용할 수 있는 구체적인 행동 규칙을 제안합니다.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "매매일지 연동",
    description:
      "거래마다 메모와 근거를 남기고, 분석 결과와 함께 복기하며 같은 실수를 줄여나갑니다.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    ),
  },
  {
    title: "주간 성장 트래킹",
    description:
      "습관 점수의 변화를 주 단위로 추적해, 노력이 실제 개선으로 이어지고 있는지 확인합니다.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5"
      />
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="scroll-mt-16 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            돈을 잃게 만드는 습관, 데이터가 말해줍니다
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            느낌이 아니라 기록을 근거로, 무엇을 바꿔야 하는지 알려드립니다.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  {feature.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
