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
      children={{
        productos: (
          <ProductManager
            businessId={currentBusiness.id}
            products={currentBusiness.products}
            onProductsChange={refreshBusiness}
          />
        ),
        ventas: (
          <SalesManager
            businessId={currentBusiness.id}
            products={currentBusiness.products}
            sales={currentBusiness.sales}
            onSalesChange={refreshBusiness}
          />
        ),
        gastos: (
          <ExpenseManager
            businessId={currentBusiness.id}
            expenses={currentBusiness.expenses}
            onExpensesChange={refreshBusiness}
          />
        ),
        estadisticas: <Statistics business={currentBusiness} />,
      }}
    />
  );
}
