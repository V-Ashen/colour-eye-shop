import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel"
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl border border-[#E0DDD6] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">{title}</h2>
          <p className="text-sm text-slate-500">{message}</p>
        </div>
        <div className="flex border-t border-[#E0DDD6]">
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-slate-500 font-semibold hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <div className="w-px bg-[#E0DDD6]" />
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className="flex-1 py-4 text-red-500 font-bold hover:bg-red-50 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
