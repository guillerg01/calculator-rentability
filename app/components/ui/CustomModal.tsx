"use client";

import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  maxWidth?: string;
}

export default function CustomModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "max-w-lg",
}: CustomModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] ${maxWidth} mx-2 sm:mx-4 transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-4 sm:p-6 text-white">
          <div className="flex justify-between items-start sm:items-center">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold truncate">
                  {title}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm truncate">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30 flex-shrink-0 ml-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">{children}</div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl p-4 sm:p-6 border-t border-gray-100">
          {footer}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
