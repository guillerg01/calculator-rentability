"use client";

import { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Business } from "../types";
import { StorageService } from "../services/storage";
import CustomModal from "./ui/CustomModal";
import FormInput from "./ui/FormInput";
import FormTextarea from "./ui/FormTextarea";

interface NavigationProps {
  currentBusiness: Business | null;
  onBusinessChange: (business: Business | null) => void;
}

export default function Navigation({
  currentBusiness,
  onBusinessChange,
}: NavigationProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [newBusiness, setNewBusiness] = useState({ name: "", description: "" });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = () => {
    const loadedBusinesses = StorageService.getBusinesses();
    setBusinesses(loadedBusinesses);

    // Set current business if none selected
    if (!currentBusiness && loadedBusinesses.length > 0) {
      const currentId = StorageService.getCurrentBusinessId();
      const business = currentId
        ? loadedBusinesses.find((b) => b.id === currentId)
        : loadedBusinesses[0];
      if (business) {
        onBusinessChange(business);
        StorageService.setCurrentBusinessId(business.id);
      }
    }
  };

  const handleCreateBusiness = () => {
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

      StorageService.addBusiness(business);
      setNewBusiness({ name: "", description: "" });
      setIsOpen(false);
      loadBusinesses();
      onBusinessChange(business);
      StorageService.setCurrentBusinessId(business.id);
    }
  };

  const handleBusinessSelect = (business: Business) => {
    onBusinessChange(business);
    StorageService.setCurrentBusinessId(business.id);
  };

  return (
    <Navbar
      className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-white/10 shadow-2xl"
      maxWidth="full"
      height="auto"
    >
      <NavbarBrand className="gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <svg
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
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
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-sm sm:text-xl truncate">
              Calculadora de Rentabilidad
            </p>
            <p className="text-xs text-gray-300 hidden sm:block">
              Gestión Empresarial Inteligente
            </p>
          </div>
        </div>
      </NavbarBrand>

      <NavbarContent justify="center">
        <NavbarItem>
          <Button
            color="default"
            variant="light"
            className="text-white hover:text-blue-200 font-medium"
            onPress={() => (window.location.href = "/")}
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
          >
            Inicio
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="center" className="hidden sm:flex">
        <NavbarItem>
          <div className="relative">
            <div className="relative">
              <select
                value={currentBusiness?.id || ""}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setIsOpen(true);
                  } else {
                    const business = businesses.find(
                      (b) => b.id === e.target.value
                    );
                    if (business) {
                      handleBusinessSelect(business);
                    }
                  }
                }}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm rounded-lg pl-8 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200 appearance-none cursor-pointer min-w-32 max-w-48 font-medium"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.25em 1.25em",
                }}
              >
                {businesses.length === 0 ? (
                  <option value="" disabled className="text-gray-500 bg-white">
                    Seleccionar Negocio
                  </option>
                ) : (
                  <>
                    <option
                      value=""
                      disabled
                      className="text-gray-500 bg-white"
                    >
                      Seleccionar Negocio
                    </option>
                    {businesses.map((business) => (
                      <option
                        key={business.id}
                        value={business.id}
                        className="text-gray-800 bg-white font-medium"
                      >
                        {business.name}
                      </option>
                    ))}
                    <option
                      value="new"
                      className="text-blue-600 font-semibold bg-white"
                    >
                      + Crear Nuevo Negocio
                    </option>
                  </>
                )}
              </select>
              {currentBusiness && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
                </div>
              )}
            </div>
          </div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end" className="flex-shrink-0">
        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-3 min-w-0"
            onPress={() => setIsOpen(true)}
            startContent={
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
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
            <span className="hidden sm:inline">Nuevo Negocio</span>
            <span className="sm:hidden">+</span>
          </Button>
        </NavbarItem>
      </NavbarContent>

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
        maxWidth="max-w-2xl"
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
        <div className="space-y-6">
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
            label="Descripción"
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
    </Navbar>
  );
}
