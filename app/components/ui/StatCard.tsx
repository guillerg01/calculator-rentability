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
    <div className={`${bgColor} rounded-2xl p-4 sm:p-6 border ${borderColor} shadow-sm hover:shadow-md transition-shadow duration-200 backdrop-blur-sm`}>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor
            .replace("bg-", "bg-")
            .replace(
              "-50",
              "-500"
            )} rounded-xl flex items-center justify-center shadow-sm`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-xs sm:text-sm ${textColor} font-medium truncate`}>{title}</p>
          <p className={`text-lg sm:text-2xl font-bold ${valueColor} truncate`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
