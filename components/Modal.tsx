"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** 접근성 라벨로 쓰일 제목 id */
  labelledBy?: string;
  children: React.ReactNode;
  /** 카드 최대 폭 클래스 (기본 max-w-md) */
  maxWidthClass?: string;
}

/**
 * 공용 모달. 배경 오버레이 클릭/ESC로 닫히고, 열린 동안 배경 스크롤을 잠근다.
 */
export default function Modal({
  open,
  onClose,
  labelledBy,
  children,
  maxWidthClass = "max-w-md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    document.body.classList.add("overflow-locked");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("overflow-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidthClass} animate-scale-in rounded-2xl bg-white p-7 shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
}
