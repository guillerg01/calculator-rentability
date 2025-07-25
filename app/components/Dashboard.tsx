"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab, Spinner } from "@nextui-org/react";
import { Business } from "../types";
import { StorageService } from "../services/storage";
import ProductManager from "../features/products/components/ProductManager";
import SalesManager from "../features/sales/components/SalesManager";
import ExpenseManager from "./ExpenseManager";
import Statistics from "./Statistics";
import DashboardLayout from "./layout/DashboardLayout";

interface DashboardProps {
  business: Business;
  onBusinessChange: () => void;
}

export default function Dashboard({
  business,
  onBusinessChange,
}: DashboardProps) {
  const [currentBusiness, setCurrentBusiness] = useState<Business>(business);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentBusiness(business);
  }, [business]);

  const refreshBusiness = () => {
    setLoading(true);
    const updatedBusiness = StorageService.getBusiness(business.id);
    if (updatedBusiness) {
      setCurrentBusiness(updatedBusiness);
    }
    onBusinessChange();
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-600">Actualizando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      business={currentBusiness}
      onBusinessChange={refreshBusiness}
    >
      {/* Tabs Section - Fixed Layout */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <Tabs
          aria-label="Business management tabs"
          className="w-full"
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-6 pb-0 border-b border-gray-200 bg-transparent",
            cursor: "w-full bg-gradient-to-r from-blue-600 to-purple-600",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-blue-600 font-medium",
          }}
        >
          <Tab
            key="products"
            title={
              <div className="flex items-center space-x-2">
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <span>Productos</span>
              </div>
            }
          >
            <div className="p-6">
              <ProductManager
                businessId={currentBusiness.id}
                products={currentBusiness.products}
                onProductsChange={refreshBusiness}
              />
            </div>
          </Tab>

          <Tab
            key="sales"
            title={
              <div className="flex items-center space-x-2">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span>Ventas</span>
              </div>
            }
          >
            <div className="p-6">
              <SalesManager
                businessId={currentBusiness.id}
                products={currentBusiness.products}
                sales={currentBusiness.sales}
                onSalesChange={refreshBusiness}
              />
            </div>
          </Tab>

          <Tab
            key="expenses"
            title={
              <div className="flex items-center space-x-2">
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>Gastos</span>
              </div>
            }
          >
            <div className="p-6">
              <ExpenseManager
                businessId={currentBusiness.id}
                expenses={currentBusiness.expenses}
                onExpensesChange={refreshBusiness}
              />
            </div>
          </Tab>

          <Tab
            key="statistics"
            title={
              <div className="flex items-center space-x-2">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Estadísticas</span>
              </div>
            }
          >
            <div className="p-6">
              <Statistics business={currentBusiness} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
