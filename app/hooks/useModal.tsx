"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const renderModal = (modalContent: React.ReactNode) => {
    if (!mounted || !isOpen) return null;

    return createPortal(
      modalContent,
      document.body
    );
  };

  return {
    isOpen,
    openModal,
    closeModal,
    renderModal,
  };
} 