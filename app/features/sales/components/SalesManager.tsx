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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Product, Sale } from "../../../types";
import { StorageService } from "../../../services/storage";
import CustomModal from "../../../components/ui/CustomModal";
import FormInput from "../../../components/ui/FormInput";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import StatCard from "../../../components/ui/StatCard";

interface SalesManagerProps {
  businessId: string;
  products: Product[];
  sales: Sale[];
  onSalesChange: () => void;
}

export default function SalesManager({
  businessId,
  products,
  sales,
  onSalesChange,
}: SalesManagerProps) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newSale, setNewSale] = useState({
    productId: "",
    quantity: "",
    customerName: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddSale = () => {
    if (newSale.productId && newSale.quantity) {
      const product = products.find((p) => p.id === newSale.productId);
      if (product && product.stock >= parseInt(newSale.quantity)) {
        const sale: Sale = {
          id: StorageService.generateId(),
          productId: newSale.productId,
          productName: product.name,
          quantity: parseInt(newSale.quantity),
          unitPrice: product.sellingPrice,
          totalPrice: product.sellingPrice * parseInt(newSale.quantity),
          date: selectedDate,
          customerName: newSale.customerName || undefined,
        };

        StorageService.addSale(businessId, sale);
        setNewSale({ productId: "", quantity: "", customerName: "" });
        setIsOpen(false);
        onSalesChange();
      }
    }
  };

  const getDailySales = () => {
    return sales.filter((sale) => sale.date === selectedDate);
  };

  const getDailyStats = () => {
    const dailySales = getDailySales();
    const totalSales = dailySales.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );
    const totalItems = dailySales.reduce((sum, sale) => sum + sale.quantity, 0);

    return { totalSales, totalItems, salesCount: dailySales.length };
  };

  const dailyStats = getDailyStats();

  const salesIcon = (
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  );

  const emptyStateIcon = (
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Ventas</h3>
          <p className="text-gray-600 mt-1">
            Gestiona las ventas y transacciones
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40 px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
          />
          <Button
            onClick={() => setIsOpen(true)}
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
            Registrar Venta
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          title="Total Ventas"
          value={StorageService.formatCurrency(dailyStats.totalSales)}
          bgColor="bg-blue-50"
          borderColor="border-blue-100"
          textColor="text-blue-600"
          valueColor="text-blue-800"
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          }
          title="Productos Vendidos"
          value={dailyStats.totalItems}
          bgColor="bg-green-50"
          borderColor="border-green-100"
          textColor="text-green-600"
          valueColor="text-green-800"
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
          title="Transacciones"
          value={dailyStats.salesCount}
          bgColor="bg-purple-50"
          borderColor="border-purple-100"
          textColor="text-purple-600"
          valueColor="text-purple-800"
        />
      </div>

      {/* Content Section */}
      {getDailySales().length === 0 ? (
        <EmptyState
          icon={emptyStateIcon}
          title="No hay ventas registradas para este día"
          description="Registra tu primera venta para comenzar a ver tus estadísticas"
          actionLabel="Registrar Primera Venta"
          onAction={() => setIsOpen(true)}
          gradientFrom="green-50"
          gradientTo="blue-50"
          borderColor="green-100"
        />
      ) : (
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardBody className="p-0">
            <Table
              aria-label="Sales table"
              classNames={{
                wrapper: "shadow-none",
                th: "bg-gray-50/80 text-gray-700 font-semibold border-b border-gray-200 focus:outline-none",
                td: "border-b border-gray-100 focus:outline-none",
              }}
            >
              <TableHeader>
                <TableColumn>Producto</TableColumn>
                <TableColumn>Cantidad</TableColumn>
                <TableColumn>Precio Unitario</TableColumn>
                <TableColumn>Total</TableColumn>
                <TableColumn>Cliente</TableColumn>
                <TableColumn>Hora</TableColumn>
              </TableHeader>
              <TableBody>
                {getDailySales().map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <p className="font-semibold text-gray-800">
                        {sale.productName}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Chip color="primary" variant="flat" size="sm">
                        {sale.quantity}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-700">
                        {StorageService.formatCurrency(sale.unitPrice)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-green-600">
                        {StorageService.formatCurrency(sale.totalPrice)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {sale.customerName || (
                        <span className="text-gray-400 text-sm">
                          Sin cliente
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {new Date(sale.id).toLocaleTimeString("es-ES", {
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

      {/* Custom Modal */}
      <CustomModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Registrar Nueva Venta"
        subtitle="Gestiona las ventas y transacciones"
        icon={salesIcon}
        maxWidth="max-w-2xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddSale}
              disabled={!newSale.productId || !newSale.quantity}
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
              Registrar Venta
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Producto"
            placeholder="Selecciona un producto"
            value={newSale.productId}
            onChange={(e) =>
              setNewSale({ ...newSale, productId: e.target.value })
            }
          >
            {products
              .filter((product) => product.stock > 0)
              .map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - Stock: {product.stock} -{" "}
                  {StorageService.formatCurrency(product.sellingPrice)}
                </SelectItem>
              ))}
          </Select>

          <FormInput
            label="Cantidad"
            type="number"
            placeholder="1"
            value={newSale.quantity}
            onChange={(e) =>
              setNewSale({ ...newSale, quantity: e.target.value })
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            }
            required
          />

          <FormInput
            label="Nombre del Cliente (opcional)"
            placeholder="Cliente"
            value={newSale.customerName}
            onChange={(e) =>
              setNewSale({ ...newSale, customerName: e.target.value })
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
          />

          {newSale.productId && newSale.quantity && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-600 font-medium mb-2">
                Resumen de la venta:
              </p>
              <p className="font-semibold text-lg text-gray-800">
                Total:{" "}
                {StorageService.formatCurrency(
                  (products.find((p) => p.id === newSale.productId)
                    ?.sellingPrice || 0) * parseInt(newSale.quantity || "0")
                )}
              </p>
            </div>
          )}
        </div>
      </CustomModal>
    </div>
  );
}
