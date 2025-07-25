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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from "@nextui-org/react";
import { Business } from "../types";
import { StorageService } from "../services/storage";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      onClose();
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
      height="4rem"
    >
      <NavbarBrand className="gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
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
          <div>
            <p className="font-bold text-white text-xl">
              Calculadora de Rentabilidad
            </p>
            <p className="text-xs text-gray-300">
              Gestión Empresarial Inteligente
            </p>
          </div>
        </div>
      </NavbarBrand>

      <NavbarContent justify="center" className="hidden sm:flex">
        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
                endContent={
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                }
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {currentBusiness
                    ? currentBusiness.name
                    : "Seleccionar Negocio"}
                </div>
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Business selection"
              className="w-80"
              onAction={(key) => {
                const business = businesses.find((b) => b.id === key);
                if (business) handleBusinessSelect(business);
              }}
            >
              {businesses.map((business) => (
                <DropdownItem key={business.id} className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {business.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{business.name}</p>
                      {business.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {business.description}
                        </p>
                      )}
                    </div>
                  </div>
                </DropdownItem>
              ))}
              <DropdownItem
                key="new"
                onPress={onOpen}
                className="text-blue-600 font-semibold"
              >
                <div className="flex items-center gap-2">
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Crear nuevo negocio
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            color="primary"
            variant="flat"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            onPress={onOpen}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            }
          >
            Nuevo Negocio
          </Button>
        </NavbarItem>
      </NavbarContent>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        classNames={{
          backdrop: "bg-black/50 backdrop-blur-sm",
          base: "border-0 shadow-2xl",
          header:
            "border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50",
          body: "py-6",
          footer:
            "border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-2xl font-bold text-gray-800">
            Crear Nuevo Negocio
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <Input
                label="Nombre del Negocio"
                placeholder="Ej: Mi Tienda Online"
                value={newBusiness.name}
                onChange={(e) =>
                  setNewBusiness({ ...newBusiness, name: e.target.value })
                }
                classNames={{
                  label: "text-gray-700 font-medium",
                  input: "text-lg",
                  inputWrapper:
                    "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
                }}
              />
              <Textarea
                label="Descripción"
                placeholder="Describe tu negocio, productos principales, mercado objetivo..."
                value={newBusiness.description}
                onChange={(e) =>
                  setNewBusiness({
                    ...newBusiness,
                    description: e.target.value,
                  })
                }
                classNames={{
                  label: "text-gray-700 font-medium",
                  input: "text-base",
                  inputWrapper:
                    "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="font-medium"
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleCreateBusiness}
              isDisabled={!newBusiness.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 font-medium px-6"
            >
              Crear Negocio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Navbar>
  );
}
