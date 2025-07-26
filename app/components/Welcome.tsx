"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { Business } from "../types";
import { StorageService } from "../services/storage";
import CustomModal from "./ui/CustomModal";
import FormInput from "./ui/FormInput";
import FormTextarea from "./ui/FormTextarea";

interface WelcomeProps {
  onBusinessCreated: (business: Business) => void;
}

export default function Welcome({ onBusinessCreated }: WelcomeProps) {
  console.log("Welcome component rendered");
  const [newBusiness, setNewBusiness] = useState({ name: "", description: "" });
  const [isOpen, setIsOpen] = useState(false);
  const [existingBusinesses, setExistingBusinesses] = useState<Business[]>([]);

  // Load businesses on client side to avoid hydration mismatch
  useEffect(() => {
    const businesses = StorageService.getBusinesses();
    setExistingBusinesses(businesses);
  }, []);

  const handleOpenModal = () => {
    console.log("handleOpenModal called");
    setIsOpen(true);
  };

  const handleCreateBusiness = () => {
    console.log("handleCreateBusiness called", newBusiness);
    if (newBusiness.name.trim()) {
      const business: Business = {
        id: StorageService.generateId(),
        name: newBusiness.name,
        description: newBusiness.description,
        createdAt: new Date().toISOString(),
        products: [],
        sales: [],
        expenses: [],
      };

      console.log("Creating business:", business);
      StorageService.addBusiness(business);
      setNewBusiness({ name: "", description: "" });
      setIsOpen(false);

      // Update the existing businesses list
      const updatedBusinesses = StorageService.getBusinesses();
      setExistingBusinesses(updatedBusinesses);

      onBusinessCreated(business);
      StorageService.setCurrentBusinessId(business.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-8">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              Calculadora de Rentabilidad
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transforma tu negocio con análisis inteligente de rentabilidad,
              gestión de productos y control financiero avanzado
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Gestión de Productos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Administra tu inventario, precios de compra y venta, stock
                  mínimo y categorías de productos de forma eficiente
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Control de Ventas
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Registra ventas, calcula márgenes de beneficio y analiza el
                  rendimiento de tus productos en tiempo real
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Análisis Avanzado
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualiza estadísticas, gráficos interactivos y métricas de
                  rentabilidad para tomar decisiones informadas
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {existingBusinesses.length > 0 && (
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                    />
                  </svg>
                  Ir al Dashboard
                </button>
              )}

              <button
                onClick={handleOpenModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <svg
                  className="w-6 h-6 mr-2"
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
                {existingBusinesses.length > 0
                  ? "Crear Otro Negocio"
                  : "Crear Mi Primer Negocio"}
              </button>

              <button
                onClick={() => (window.location.href = "/calculadora-rapida")}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500/30"
              >
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Calculadora Rápida
              </button>
            </div>

            <p className="text-gray-500 text-lg">
              {existingBusinesses.length > 0
                ? "Gestiona tus negocios existentes o crea uno nuevo"
                : "Comienza tu viaje hacia el éxito empresarial en menos de 2 minutos"}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Crear Nuevo Negocio"
        subtitle="Comienza tu viaje empresarial"
        icon={
          <svg
            className="w-6 h-6"
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
        maxWidth="max-w-lg"
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-2xl hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateBusiness}
              disabled={!newBusiness.name.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-full sm:w-auto"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Crear Negocio
            </button>
          </div>
        }
      >
        <div className="space-y-4 sm:space-y-6">
          <FormInput
            label="Nombre del Negocio"
            placeholder="Ej: Mi Tienda Online"
            value={newBusiness.name}
            onChange={(e) =>
              setNewBusiness({ ...newBusiness, name: e.target.value })
            }
            icon={
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            }
            required
          />

          <FormTextarea
            label="Descripción (Opcional)"
            placeholder="Describe tu negocio, productos principales, mercado objetivo..."
            value={newBusiness.description}
            onChange={(e) =>
              setNewBusiness({
                ...newBusiness,
                description: e.target.value,
              })
            }
          />

          {/* Preview */}
          {newBusiness.name && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {newBusiness.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {newBusiness.name}
                  </p>
                  {newBusiness.description && (
                    <p className="text-sm text-gray-600">
                      {newBusiness.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
