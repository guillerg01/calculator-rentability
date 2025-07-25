"use client";

import { useState, useEffect } from "react";
import { Business } from "./types";
import { StorageService } from "./services/storage";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import Welcome from "./components/Welcome";

export default function Home() {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current business on component mount
    const currentBusinessId = StorageService.getCurrentBusinessId();
    if (currentBusinessId) {
      const business = StorageService.getBusiness(currentBusinessId);
      if (business) {
        setCurrentBusiness(business);
      }
    }
    setLoading(false);
  }, []);

  const handleBusinessChange = (business: Business | null) => {
    setCurrentBusiness(business);
  };

  const handleBusinessCreated = (business: Business) => {
    setCurrentBusiness(business);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentBusiness={currentBusiness}
        onBusinessChange={handleBusinessChange}
      />

      {currentBusiness ? (
        <Dashboard
          business={currentBusiness}
          onBusinessChange={() => {
            const updatedBusiness = StorageService.getBusiness(
              currentBusiness.id
            );
            if (updatedBusiness) {
              setCurrentBusiness(updatedBusiness);
            }
          }}
        />
      ) : (
        <Welcome onBusinessCreated={handleBusinessCreated} />
      )}
    </div>
  );
}
