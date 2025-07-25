"use client";

import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  bgColor: string;
  borderColor: string;
  textColor: string;
  valueColor: string;
}

export default function StatCard({
  icon,
  title,
  value,
  bgColor,
  borderColor,
  textColor,
  valueColor,
}: StatCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 border ${borderColor}`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 ${bgColor
            .replace("bg-", "bg-")
            .replace(
              "-50",
              "-500"
            )} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <p className={`text-sm ${textColor} font-medium`}>{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
