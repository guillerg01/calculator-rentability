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
  Chip,
} from "@nextui-org/react";
import { Product, Sale } from "../types";
import { StorageService } from "../services/storage";

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
  const { isOpen, onOpen, onClose } = useDisclosure();

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
        onClose();
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
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
            classNames={{
              inputWrapper:
                "border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500",
            }}
          />
          <Button
            color="primary"
            onPress={onOpen}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
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
              <p className="text-sm text-blue-600 font-medium">Total Ventas</p>
              <p className="text-2xl font-bold text-blue-800">
                {StorageService.formatCurrency(dailyStats.totalSales)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
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
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">
                Productos Vendidos
              </p>
              <p className="text-2xl font-bold text-green-800">
                {dailyStats.totalItems}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
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
              <p className="text-sm text-purple-600 font-medium">
                Transacciones
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {dailyStats.salesCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {getDailySales().length === 0 ? (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12 text-center border border-green-100">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No hay ventas registradas para este día
          </h3>
          <p className="text-gray-600 mb-6">
            Registra tu primera venta para comenzar a ver tus estadísticas
          </p>
          <Button
            color="primary"
            onPress={onOpen}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white"
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
            Registrar Primera Venta
          </Button>
        </div>
      ) : (
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardBody className="p-0">
            <Table
              aria-label="Sales table"
              classNames={{
                wrapper: "shadow-none",
                th: "bg-gray-50/80 text-gray-700 font-semibold border-b border-gray-200",
                td: "border-b border-gray-100",
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

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="text-xl font-bold text-gray-800">
            Registrar Nueva Venta
          </ModalHeader>
          <ModalBody>
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
            <Input
              label="Cantidad"
              type="number"
              placeholder="1"
              min="1"
              value={newSale.quantity}
              onChange={(e) =>
                setNewSale({ ...newSale, quantity: e.target.value })
              }
            />
            <Input
              label="Nombre del Cliente (opcional)"
              placeholder="Cliente"
              value={newSale.customerName}
              onChange={(e) =>
                setNewSale({ ...newSale, customerName: e.target.value })
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
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleAddSale}
              isDisabled={!newSale.productId || !newSale.quantity}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Registrar Venta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
