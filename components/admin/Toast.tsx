"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  show,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-full bg-km-wood px-4 py-2 text-xs font-semibold text-white shadow-soft">
      {message}
    </div>
  );
}

