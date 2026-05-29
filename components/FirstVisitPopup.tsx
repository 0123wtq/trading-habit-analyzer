"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { ROUTES } from "@/lib/routes";

/** 팝업을 이미 닫았는지 저장하는 localStorage 키 */
const VISITED_KEY = "tha_first_visit_dismissed";
/** 리드(상담 신청) 제출 내역을 저장하는 localStorage 키 */
const LEAD_KEY = "lead_submissions";

interface LeadSubmission {
  name: string;
  phone: string;
  email: string;
  experience: string;
  struggle: string;
  capital: string;
  contactMethod: string;
  agree: boolean;
  submittedAt: string;
}

const EXPERIENCE_OPTIONS = [
  "1년 미만",
  "1~3년",
  "3~5년",
  "5년 이상",
];

const CAPITAL_OPTIONS = [
  "1,000만원 미만",
  "1,000~5,000만원",
  "5,000만원~1억",
  "1억 이상",
];

const CONTACT_OPTIONS = ["이메일", "문자(SMS)", "카카오톡"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function loadLeads(): LeadSubmission[] {
  try {
    const raw = window.localStorage.getItem(LEAD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LeadSubmission[]) : [];
  } catch {
    return [];
  }
}

export default function FirstVisitPopup() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  // 입력 상태
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [struggle, setStruggle] = useState("");
  const [capital, setCapital] = useState("");
  const [contactMethod, setContactMethod] = useState("이메일");
  const [agree, setAgree] = useState(false);
  /** 제출 시도 후에만 오류 문구를 노출 */
  const [submitted, setSubmitted] = useState(false);

  // 최초 방문이면 팝업을 표시한다. (SSR 후 클라이언트에서만 판단)
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(VISITED_KEY) === "true";
    } catch {
      // localStorage 접근 불가(시크릿 모드 등)인 경우엔 그냥 표시
    }
    if (!dismissed) setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(VISITED_KEY, "true");
    } catch {
      // 저장 실패는 무시 — 다음 방문 때 다시 보일 수 있음
    }
  }, []);

  // 유효성 검사
  const phoneError = submitted && phone.trim() === "";
  const emailError =
    submitted && email.trim() !== "" && !EMAIL_RE.test(email.trim());
  const emailEmptyError = submitted && email.trim() === "";
  const agreeError = submitted && !agree;

  const canSubmit = useMemo(
    () =>
      phone.trim() !== "" &&
      email.trim() !== "" &&
      EMAIL_RE.test(email.trim()) &&
      agree,
    [phone, email, agree]
  );

  const handleSubmit = () => {
    setSubmitted(true);
    if (!canSubmit) return;

    const entry: LeadSubmission = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      experience,
      struggle: struggle.trim(),
      capital,
      contactMethod,
      agree,
      submittedAt: new Date().toISOString(),
    };

    try {
      const prev = loadLeads();
      window.localStorage.setItem(LEAD_KEY, JSON.stringify([...prev, entry]));
    } catch {
      // 저장 실패해도 완료 화면은 보여준다
    }

    setDone(true);
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";
  const errorClass = "border-rose-400 focus:border-rose-400 focus:ring-rose-100";

  return (
    <Modal open={open} onClose={close} labelledBy="first-visit-title">
      {/* 닫기 버튼 */}
      <button
        type="button"
        onClick={close}
        aria-label="닫기"
        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {done ? (
        /* ----------------------- 완료 화면 ----------------------- */
        <div className="py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-3xl">
            ✅
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
            신청이 완료되었습니다
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            남겨주신 정보로 곧 안내드릴게요. 기다리는 동안 내 매매 습관을 먼저
            무료로 분석해 보세요.
          </p>
          <div className="mt-7 flex flex-col gap-2">
            <Link
              href={ROUTES.analyzer}
              onClick={close}
              className="rounded-xl bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              무료 분석 시작하기
            </Link>
            <button
              type="button"
              onClick={close}
              className="rounded-xl px-5 py-2.5 text-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              닫기
            </button>
          </div>
        </div>
      ) : (
        /* ----------------------- 입력 폼 ----------------------- */
        <div className="max-h-[80vh] overflow-y-auto pr-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            👋 처음 오셨네요
          </span>
          <h2
            id="first-visit-title"
            className="mt-3 text-2xl font-bold tracking-tight text-slate-900"
          >
            무료 매매 습관 진단 신청
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            간단한 정보를 남겨주시면, 반복되는 실수와 개선 방향을 정리해
            안내해 드릴게요.
          </p>

          <div className="mt-5 space-y-3.5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                이름
              </label>
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                연락처 <span className="text-rose-500">*</span>
              </label>
              <input
                className={`${inputClass} ${phoneError ? errorClass : ""}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                inputMode="tel"
              />
              {phoneError && (
                <p className="mt-1 text-xs text-rose-500">
                  연락처를 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                이메일 <span className="text-rose-500">*</span>
              </label>
              <input
                className={`${inputClass} ${
                  emailError || emailEmptyError ? errorClass : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                inputMode="email"
              />
              {emailEmptyError && (
                <p className="mt-1 text-xs text-rose-500">
                  이메일을 입력해 주세요.
                </p>
              )}
              {emailError && (
                <p className="mt-1 text-xs text-rose-500">
                  이메일 형식이 올바르지 않습니다.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                투자 경험
              </label>
              <select
                className={inputClass}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option value="">선택해 주세요</option>
                {EXPERIENCE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                막히는 부분
              </label>
              <textarea
                className={inputClass}
                rows={2}
                value={struggle}
                onChange={(e) => setStruggle(e.target.value)}
                placeholder="예: 손절을 못 해서 손실이 커집니다"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                투자금 규모
              </label>
              <select
                className={inputClass}
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
              >
                <option value="">선택해 주세요</option>
                {CAPITAL_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                희망 안내 방식
              </label>
              <div className="mt-1.5 flex gap-2">
                {CONTACT_OPTIONS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setContactMethod(o)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                      contactMethod === o
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* 개인정보 동의 */}
            <label className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-slate-300 text-brand-500 focus:ring-brand-400"
              />
              <span className="text-xs leading-relaxed text-slate-600">
                개인정보 수집 및 이용에 동의합니다. (상담 안내 목적으로만
                사용되며, 현재 MVP에서는 브라우저에만 저장됩니다.)
              </span>
            </label>
            {agreeError && (
              <p className="text-xs text-rose-500">
                진행하려면 개인정보 수집에 동의해 주세요.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              className="rounded-xl bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              신청하기
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-xl px-5 py-2.5 text-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
            >
              먼저 둘러볼게요
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
