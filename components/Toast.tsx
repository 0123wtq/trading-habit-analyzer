"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string | null;
  onDismiss: () => void;
  /** 자동 종료 시간(ms) */
  duration?: number;
}

/** 화면 하단 중앙에 잠깐 떠오르는 간단한 토스트 */
export default function Toast({
  message,
  onDismiss,
  duration = 2400,
}: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(id);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-in"
    >
      <div className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
