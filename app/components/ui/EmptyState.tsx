"use client";

import { ReactNode } from "react";
import Button from "./Button";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  gradientFrom,
  gradientTo,
  borderColor,
}: EmptyStateProps) {
  return (
    <div
      className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-3xl p-12 text-center border border-${borderColor}`}
    >
      <div
        className={`w-20 h-20 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} rounded-2xl flex items-center justify-center mx-auto mb-6`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button
        onClick={onAction}
        className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white`}
        startContent={
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        }
      >
        {actionLabel}
      </Button>
    </div>
  );
}
