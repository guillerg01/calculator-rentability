"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Textarea,
  Chip,
} from "@nextui-org/react";
import { Expense } from "../types";
import { StorageService } from "../services/storage";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: StorageService.generateId(),
        name: newExpense.name,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: selectedDate,
        description: newExpense.description || undefined,
      };

      StorageService.addExpense(businessId, expense);
      setNewExpense({ name: "", amount: "", category: "", description: "" });
      onClose();
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Gastos</h3>
          <p className="text-gray-600 mt-1">
            Controla y gestiona los gastos del negocio
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
            classNames={{
              inputWrapper:
                "border-2 border-gray-200 hover:border-red-400 focus-within:border-red-500",
            }}
          />
          <Button
            color="primary"
            onPress={onOpen}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
            Registrar Gasto
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-red-50 rounded-xl p-6 border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
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
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Total Gastos</p>
              <p className="text-2xl font-bold text-red-800">
                {StorageService.formatCurrency(dailyStats.totalExpenses)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
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
            </div>
            <div>
              <p className="text-sm text-orange-600 font-medium">
                Cantidad de Gastos
              </p>
              <p className="text-2xl font-bold text-orange-800">
                {dailyStats.expensesCount}
              </p>
            </div>
          </div>
        </div>
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
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-12 text-center border border-red-100">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No hay gastos registrados para este día
          </h3>
          <p className="text-gray-600 mb-6">
            Registra tu primer gasto para comenzar a controlar los costos
          </p>
          <Button
            color="primary"
            onPress={onOpen}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white"
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
            Registrar Primer Gasto
          </Button>
        </div>
      ) : (
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardBody className="p-0">
            <Table
              aria-label="Expenses table"
              classNames={{
                wrapper: "shadow-none",
                th: "bg-gray-50/80 text-gray-700 font-semibold border-b border-gray-200",
                td: "border-b border-gray-100",
              }}
            >
              <TableHeader>
                <TableColumn>Gasto</TableColumn>
                <TableColumn>Categoría</TableColumn>
                <TableColumn>Monto</TableColumn>
                <TableColumn>Descripción</TableColumn>
                <TableColumn>Hora</TableColumn>
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
                    <TableCell>
                      {expense.description || (
                        <span className="text-gray-400 text-sm">
                          Sin descripción
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(expense.id).toLocaleTimeString("es-ES", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-gray-800">
            Registrar Nuevo Gasto
          </ModalHeader>
          <ModalBody>
            <Input
              label="Nombre del Gasto"
              placeholder="Ej: Pago de luz"
              value={newExpense.name}
              onChange={(e) =>
                setNewExpense({ ...newExpense, name: e.target.value })
              }
            />
            <Select
              label="Categoría"
              placeholder="Selecciona una categoría"
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({ ...newExpense, category: e.target.value })
              }
            >
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="Monto"
              type="number"
              placeholder="0.00"
              startContent={<span className="text-default-400">€</span>}
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
            />
            <Textarea
              label="Descripción (opcional)"
              placeholder="Descripción del gasto..."
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleAddExpense}
              isDisabled={
                !newExpense.name || !newExpense.amount || !newExpense.category
              }
              className="bg-gradient-to-r from-red-600 to-orange-600"
            >
              Registrar Gasto
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
