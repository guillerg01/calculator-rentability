"use client";

import { useState, useEffect } from "react";
import { Business } from "../types";
import { StorageService } from "../services/storage";
import Navigation from "../components/Navigation";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProductManager from "../features/products/components/ProductManager";
import SalesManager from "../features/sales/components/SalesManager";
import ExpenseManager from "../components/ExpenseManager";
import Statistics from "../components/Statistics";
import Welcome from "../components/Welcome";

export default function DashboardPage() {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const businesses = StorageService.getBusinesses();
    const currentId = StorageService.getCurrentBusinessId();

    if (currentId && businesses.length > 0) {
      const business = businesses.find((b) => b.id === currentId);
      if (business) {
        setCurrentBusiness(business);
      } else if (businesses.length > 0) {
        setCurrentBusiness(businesses[0]);
        StorageService.setCurrentBusinessId(businesses[0].id);
      }
    }
  }, []);

  const handleBusinessChange = (business: Business | null) => {
    setCurrentBusiness(business);
  };

  const handleBusinessCreated = (business: Business) => {
    setCurrentBusiness(business);
  };

  const loadBusinesses = () => {
    const businesses = StorageService.getBusinesses();
    const currentId = StorageService.getCurrentBusinessId();

    if (currentId) {
      const business = businesses.find((b) => b.id === currentId);
      if (business) {
        setCurrentBusiness(business);
      }
    }
  };

  // If no business exists, show welcome page
  if (!currentBusiness) {
    return <Welcome onBusinessCreated={handleBusinessCreated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navigation
        currentBusiness={currentBusiness}
        onBusinessChange={handleBusinessChange}
      />

      <DashboardLayout
        business={currentBusiness}
        onBusinessChange={() => loadBusinesses()}
        children={{
          productos: (
            <ProductManager
              businessId={currentBusiness.id}
              products={currentBusiness.products}
              onProductsChange={loadBusinesses}
            />
          ),
          ventas: (
            <SalesManager
              businessId={currentBusiness.id}
              sales={currentBusiness.sales}
              products={currentBusiness.products}
              onSalesChange={loadBusinesses}
            />
          ),
          gastos: (
            <ExpenseManager
              businessId={currentBusiness.id}
              expenses={currentBusiness.expenses}
              onExpensesChange={loadBusinesses}
            />
          ),
          estadisticas: <Statistics business={currentBusiness} />,
        }}
      />
    </div>
  );
}
