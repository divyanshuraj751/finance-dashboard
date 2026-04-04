import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

let toastListener: ((message: ToastMessage) => void) | null = null;
let toastIdCounter = 0;

export const showToast = (text: string, type: ToastType = "success") => {
  toastListener?.({ id: ++toastIdCounter, text, type });
};

const ICON_MAP = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const COLOR_MAP = {
  success: "bg-emerald-500 border-emerald-600",
  error: "bg-rose-500 border-rose-600",
  info: "bg-blue-500 border-blue-600",
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    toastListener = (message) => {
      setToasts((previous) => [...previous, message]);
      setTimeout(() => {
        setToasts((previous) => previous.filter((toast) => toast.id !== message.id));
      }, 3000);
    };
    return () => {
      toastListener = null;
    };
  }, []);

  const dismissToast = (id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  };

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = ICON_MAP[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-2xl border animate-slide-in-left ${COLOR_MAP[toast.type]}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{toast.text}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              className="ml-2 p-0.5 rounded hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
