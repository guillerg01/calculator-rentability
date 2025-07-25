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
  Badge,
} from "@nextui-org/react";
import { Product } from "../../../types";
import { StorageService } from "../../../services/storage";
import CustomModal from "../../../components/ui/CustomModal";
import FormInput from "../../../components/ui/FormInput";
import FormTextarea from "../../../components/ui/FormTextarea";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";

interface ProductManagerProps {
  businessId: string;
  products: Product[];
  onProductsChange: () => void;
}

export default function ProductManager({
  businessId,
  products,
  onProductsChange,
}: ProductManagerProps) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    purchasePrice: "",
    sellingPrice: "",
    category: "",
    description: "",
    stock: "",
    minStock: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleAddProduct = () => {
    if (
      newProduct.name &&
      newProduct.purchasePrice &&
      newProduct.sellingPrice
    ) {
      const product: Product = {
        id: StorageService.generateId(),
        name: newProduct.name,
        purchasePrice: parseFloat(newProduct.purchasePrice),
        sellingPrice: parseFloat(newProduct.sellingPrice),
        category: newProduct.category || "General",
        description: newProduct.description,
        stock: parseInt(newProduct.stock) || 0,
        minStock: parseInt(newProduct.minStock) || 0,
      };

      StorageService.addProduct(businessId, product);
      setNewProduct({
        name: "",
        purchasePrice: "",
        sellingPrice: "",
        category: "",
        description: "",
        stock: "",
        minStock: "",
      });
      setIsOpen(false);
      onProductsChange();
    }
  };

  const handleDeleteProduct = (productId: string) => {
    StorageService.deleteProduct(businessId, productId);
    onProductsChange();
  };

  const getProfitMargin = (purchasePrice: number, sellingPrice: number) => {
    return ((sellingPrice - purchasePrice) / sellingPrice) * 100;
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { color: "danger", text: "Sin stock" };
    if (stock <= minStock) return { color: "warning", text: "Stock bajo" };
    return { color: "success", text: "En stock" };
  };

  const productIcon = (
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
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
            Productos
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Gestiona tu inventario y productos
          </p>
        </div>
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
          <span className="hidden sm:inline">Agregar Producto</span>
          <span className="sm:hidden">Agregar</span>
        </Button>
      </div>

      {/* Content Section */}
      {products.length === 0 ? (
        <EmptyState
          icon={emptyStateIcon}
          title="No hay productos registrados"
          description="Agrega tu primer producto para comenzar a gestionar tu inventario"
          actionLabel="Agregar Primer Producto"
          onAction={() => setIsOpen(true)}
          gradientFrom="blue-50"
          gradientTo="purple-50"
          borderColor="blue-100"
        />
      ) : (
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <Table
                aria-label="Products table"
                classNames={{
                  wrapper: "shadow-none min-w-full",
                  th: "bg-gray-50/80 text-gray-700 font-semibold border-b border-gray-200 focus:outline-none text-xs sm:text-sm",
                  td: "border-b border-gray-100 focus:outline-none text-xs sm:text-sm",
                }}
              >
                <TableHeader>
                  <TableColumn className="text-xs sm:text-sm">
                    Producto
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm hidden md:table-cell">
                    Precio Compra
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm">
                    Precio Venta
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm hidden sm:table-cell">
                    Margen
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm">
                    Stock
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm hidden lg:table-cell">
                    Categoría
                  </TableColumn>
                  <TableColumn className="text-xs sm:text-sm">
                    Acciones
                  </TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const profitMargin = getProfitMargin(
                      product.purchasePrice,
                      product.sellingPrice
                    );
                    const stockStatus = getStockStatus(
                      product.stock,
                      product.minStock
                    );

                    return (
                      <TableRow
                        key={product.id}
                        className="hover:bg-gray-50/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="font-medium text-gray-700">
                            {StorageService.formatCurrency(
                              product.purchasePrice
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-700">
                            {StorageService.formatCurrency(
                              product.sellingPrice
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Chip
                            color={
                              profitMargin > 20
                                ? "success"
                                : profitMargin > 10
                                ? "warning"
                                : "danger"
                            }
                            variant="flat"
                            className="font-medium"
                          >
                            {profitMargin.toFixed(1)}%
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                              {product.stock}
                            </span>
                            <Badge
                              color={
                                stockStatus.color as
                                  | "success"
                                  | "warning"
                                  | "danger"
                              }
                              variant="flat"
                              size="sm"
                            >
                              {stockStatus.text}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Chip variant="flat" color="primary" size="sm">
                            {product.category}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-xs"
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
        title="Agregar Nuevo Producto"
        subtitle="Gestiona tu inventario de productos"
        icon={productIcon}
        maxWidth="max-w-4xl"
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
              onClick={handleAddProduct}
              disabled={
                !newProduct.name.trim() ||
                !newProduct.purchasePrice ||
                !newProduct.sellingPrice
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
              <span className="hidden sm:inline">Agregar Producto</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nombre del Producto"
            placeholder="Ej: Camiseta"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
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
            label="Categoría"
            placeholder="Ej: Ropa"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            }
          />

          <FormInput
            label="Precio de Compra"
            type="number"
            placeholder="0.00"
            value={newProduct.purchasePrice}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                purchasePrice: e.target.value,
              })
            }
            icon={<span className="text-gray-400 font-medium">€</span>}
            iconPosition="left"
            required
          />

          <FormInput
            label="Precio de Venta"
            type="number"
            placeholder="0.00"
            value={newProduct.sellingPrice}
            onChange={(e) =>
              setNewProduct({ ...newProduct, sellingPrice: e.target.value })
            }
            icon={<span className="text-gray-400 font-medium">€</span>}
            iconPosition="left"
            required
          />

          <FormInput
            label="Stock Inicial"
            type="number"
            placeholder="0"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
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
          />

          <FormInput
            label="Stock Mínimo"
            type="number"
            placeholder="0"
            value={newProduct.minStock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, minStock: e.target.value })
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            }
          />
        </div>

        <FormTextarea
          label="Descripción (Opcional)"
          placeholder="Descripción del producto..."
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        {/* Preview */}
        {newProduct.name && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {newProduct.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{newProduct.name}</p>
                <p className="text-sm text-gray-600">
                  {newProduct.category || "Sin categoría"}
                </p>
                {newProduct.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {newProduct.description}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  {newProduct.sellingPrice
                    ? `€${newProduct.sellingPrice}`
                    : "€0.00"}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {newProduct.stock || "0"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
