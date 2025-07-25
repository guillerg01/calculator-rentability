"use client";

import { ReactNode } from "react";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  required?: boolean;
  disabled?: boolean;
}

export default function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
  iconPosition = "right",
  required = false,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-lg ${
            iconPosition === "left" ? "pl-12" : "pr-12"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
        />
        {icon && (
          <div
            className={`absolute ${
              iconPosition === "left" ? "left-4" : "right-4"
            } top-1/2 transform -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
