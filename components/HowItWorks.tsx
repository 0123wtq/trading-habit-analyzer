const STEPS = [
  {
    step: "01",
    title: "거래 내역 업로드",
    description:
      "증권사에서 내려받은 거래 내역 파일을 업로드하거나 직접 입력합니다. 몇 초면 충분합니다.",
  },
  {
    step: "02",
    title: "습관 자동 분석",
    description:
      "분석 엔진이 매매 패턴을 살펴 반복되는 실수와 강점을 항목별로 정리합니다.",
  },
  {
    step: "03",
    title: "리포트 확인 & 개선",
    description:
      "개선이 필요한 습관과 구체적인 행동 규칙을 받아보고, 다음 거래에 바로 적용합니다.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-16 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            3단계로 끝나는 습관 분석
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            복잡한 설정 없이, 업로드부터 개선까지 한 번에.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-7"
            >
              <span className="text-4xl font-extrabold text-brand-200">
                {item.step}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
