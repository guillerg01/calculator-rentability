"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { Expense } from "../types";
import { StorageService } from "../services/storage";
import CustomModal from "./ui/CustomModal";
import FormInput from "./ui/FormInput";
import FormTextarea from "./ui/FormTextarea";
import Button from "./ui/Button";
import EmptyState from "./ui/EmptyState";
import StatCard from "./ui/StatCard";

interface ExpenseManagerProps {
  businessId: string;
  expenses: Expense[];
  onExpensesChange: () => void;
}

const EXPENSE_CATEGORIES = [
  "Alquiler",
  "Servicios",
  "Salarios",
  "Marketing",
  "Suministros",
  "Transporte",
  "Impuestos",
  "Otros",
];

export default function ExpenseManager({
  businessId,
  expenses,
  onExpensesChange,
}: ExpenseManagerProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    category: "",
    description: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: StorageService.generateId(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: selectedDate,
        timestamp: Date.now(),
        description: newExpense.description || undefined,
      };

      StorageService.addExpense(businessId, expense);
      setNewExpense({ name: "", amount: "", category: "", description: "" });
      setIsOpen(false);
      onExpensesChange();
    }
  };

  const getDailyExpenses = () => {
    return expenses.filter((expense) => expense.date === selectedDate);
  };

  const getDailyStats = () => {
    const dailyExpenses = getDailyExpenses();
    const totalExpenses = dailyExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const categoryBreakdown = dailyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses,
      categoryBreakdown,
      expensesCount: dailyExpenses.length,
    };
  };

  const dailyStats = getDailyStats();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Alquiler: "danger",
      Servicios: "warning",
      Salarios: "primary",
      Marketing: "secondary",
      Suministros: "success",
      Transporte: "default",
      Impuestos: "danger",
      Otros: "default",
    };
    return colors[category] || "default";
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Gastos
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Controla y gestiona los gastos del negocio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-40 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow-md"
          />
          <Button
            onClick={() => setIsOpen(true)}
            className="w-full sm:w-auto"
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
            <span className="hidden sm:inline">Registrar Gasto</span>
            <span className="sm:hidden">Registrar</span>
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <StatCard
          icon={
            <svg
              className="w-6 h-6 text-white"
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
          }
          title="Total Gastos"
          value={StorageService.formatCurrency(dailyStats.totalExpenses)}
          bgColor="bg-red-50"
          borderColor="border-red-100"
          textColor="text-red-600"
          valueColor="text-red-800"
        />

        <StatCard
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
          title="Cantidad de Gastos"
          value={dailyStats.expensesCount}
          bgColor="bg-orange-50"
          borderColor="border-orange-100"
          textColor="text-orange-600"
          valueColor="text-orange-800"
        />
      </div>

      {/* Category Breakdown */}
      {Object.keys(dailyStats.categoryBreakdown).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">
            Desglose por Categoría
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dailyStats.categoryBreakdown).map(
              ([category, amount]) => (
                <Chip
                  key={category}
                  color={getCategoryColor(category) as any}
                  variant="flat"
                  size="lg"
                  className="font-medium"
                >
                  {category}: {StorageService.formatCurrency(amount)}
                </Chip>
              )
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      {getDailyExpenses().length === 0 ? (
        <EmptyState
          icon={
            <svg
              className="w-10 h-10 text-white"
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
          }
          title="No hay gastos registrados para este día"
          description="Registra tu primer gasto para comenzar a controlar los costos"
          actionLabel="Registrar Primer Gasto"
          onAction={() => setIsOpen(true)}
          gradientFrom="red-50"
          gradientTo="orange-50"
          borderColor="red-100"
        />
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table
                aria-label="Expenses table"
                classNames={{
                  wrapper: "shadow-none min-w-full",
                  th: "bg-gray-50/80 text-gray-700 font-semibold border-b border-gray-200 focus:outline-none text-xs sm:text-sm",
                  td: "border-b border-gray-100 focus:outline-none text-xs sm:text-sm",
                }}
              >
                <TableHeader>
                  <TableColumn className="text-xs sm:text-sm">
                    Gasto
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm">
                    Categoría
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm">
                    Monto
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm hidden lg:table-cell">
                    Descripción
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm hidden sm:table-cell">
                    Hora
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {getDailyExpenses().map((expense) => (
                    <TableRow key={expense.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <p className="font-semibold text-gray-800">
                          {expense.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={getCategoryColor(expense.category) as any}
                          variant="flat"
                          size="sm"
                        >
                          {expense.category}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-red-600">
                          {StorageService.formatCurrency(expense.amount)}
                        </p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {expense.description || (
                          <span className="text-gray-400 text-sm">
                            Sin descripción
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm text-gray-600">
                          {expense.timestamp
                            ? new Date(expense.timestamp).toLocaleTimeString(
                                "es-ES",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Custom Modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Registrar Nuevo Gasto"
        subtitle="Controla y gestiona los gastos del negocio"
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
        maxWidth="max-w-2xl"
        footer={
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddExpense}
              disabled={
                !newExpense.name.trim() ||
                !newExpense.amount ||
                !newExpense.category
              }
              className="w-full sm:w-auto"
              startContent={
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
              }
            >
              <span className="hidden sm:inline">Registrar Gasto</span>
              <span className="sm:hidden">Registrar</span>
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Nombre del Gasto"
            placeholder="Ej: Pago de luz"
            value={newExpense.name}
            onChange={(e) =>
              setNewExpense({ ...newExpense, name: e.target.value })
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            iconPosition="left"
            required
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
              Categoría <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-base sm:text-lg appearance-none bg-white"
              >
                <option value="">Selecciona una categoría</option>
                {EXPENSE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <FormInput
            label="Monto"
            type="number"
            placeholder="0.00"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            icon={<span className="text-gray-400 font-medium">€</span>}
            iconPosition="left"
            required
          />

          <FormTextarea
            label="Descripción (opcional)"
            placeholder="Descripción del gasto..."
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
          />

          {/* Preview */}
          {newExpense.name && newExpense.amount && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {newExpense.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{newExpense.name}</p>
                  <p className="text-sm text-gray-600">
                    {newExpense.category || "Sin categoría"}
                  </p>
                  {newExpense.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {newExpense.description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    {newExpense.amount ? `€${newExpense.amount}` : "€0.00"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedDate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
