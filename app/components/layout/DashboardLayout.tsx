"use client";

import { ReactNode } from "react";
import { Business } from "../../types";

interface DashboardLayoutProps {
  business: Business;
  children: ReactNode;
  onBusinessChange: () => void;
}

export default function DashboardLayout({
  business,
  children,
  onBusinessChange,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 relative">
      <div className="container mx-auto px-4 py-8 max-w-7xl relative">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {business.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {business.name}
                </h1>
                {business.description && (
                  <p className="text-gray-600 text-lg">
                    {business.description}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Productos
                    </p>
                    <p className="text-xl font-bold text-blue-800">
                      {business.products.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Ventas Hoy
                    </p>
                    <p className="text-xl font-bold text-green-800">
                      {
                        business.sales.filter(
                          (sale) =>
                            sale.date === new Date().toISOString().split("T")[0]
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Gastos Hoy
                    </p>
                    <p className="text-xl font-bold text-purple-800">
                      {
                        business.expenses.filter(
                          (expense) =>
                            expense.date ===
                            new Date().toISOString().split("T")[0]
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">
                      Rentabilidad
                    </p>
                    <p className="text-xl font-bold text-orange-800">
                      {(() => {
                        const todaySales = business.sales.filter(
                          (sale) =>
                            sale.date === new Date().toISOString().split("T")[0]
                        );
                        const todayExpenses = business.expenses.filter(
                          (expense) =>
                            expense.date ===
                            new Date().toISOString().split("T")[0]
                        );
                        const totalSales = todaySales.reduce(
                          (sum, sale) => sum + sale.totalPrice,
                          0
                        );
                        const totalExpenses = todayExpenses.reduce(
                          (sum, expense) => sum + expense.amount,
                          0
                        );
                        const profit = totalSales - totalExpenses;
                        const margin =
                          totalSales > 0 ? (profit / totalSales) * 100 : 0;
                        return `${margin.toFixed(1)}%`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {children}
      </div>
    </div>
  );
}
