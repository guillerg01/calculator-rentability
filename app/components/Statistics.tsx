"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Progress,
  Chip,
} from "@nextui-org/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Business,
  Product,
  Sale,
  Expense,
  DailyStats,
  ProductStats,
} from "../types";
import { StorageService } from "../services/storage";

interface StatisticsProps {
  business: Business;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

export default function Statistics({ business }: StatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const getDateRange = () => {
    const endDate = new Date(selectedDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - parseInt(selectedPeriod));
    return { startDate, endDate };
  };

  const getDailyStats = (): DailyStats[] => {
    const { startDate, endDate } = getDateRange();
    const stats: DailyStats[] = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const dailySales = business.sales.filter((sale) => sale.date === dateStr);
      const dailyExpenses = business.expenses.filter(
        (expense) => expense.date === dateStr
      );

      const totalSales = dailySales.reduce(
        (sum, sale) => sum + sale.totalPrice,
        0
      );
      const totalExpenses = dailyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const profit = totalSales - totalExpenses;
      const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

      const topProduct =
        dailySales.length > 0
          ? dailySales.reduce((top, sale) =>
              sale.totalPrice > top.totalPrice ? sale : top
            )
          : undefined;

      stats.push({
        date: dateStr,
        totalSales,
        totalExpenses,
        profit,
        profitMargin,
        productsSold: dailySales.reduce((sum, sale) => sum + sale.quantity, 0),
        topProduct: topProduct
          ? {
              name: topProduct.productName,
              quantity: topProduct.quantity,
              revenue: topProduct.totalPrice,
            }
          : undefined,
      });
    }

    return stats;
  };

  const getProductStats = (): ProductStats[] => {
    const { startDate, endDate } = getDateRange();
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const periodSales = business.sales.filter(
      (sale) => sale.date >= startDateStr && sale.date <= endDateStr
    );

    const productStats = business.products.map((product) => {
      const productSales = periodSales.filter(
        (sale) => sale.productId === product.id
      );
      const totalSold = productSales.reduce(
        (sum, sale) => sum + sale.quantity,
        0
      );
      const totalRevenue = productSales.reduce(
        (sum, sale) => sum + sale.totalPrice,
        0
      );
      const totalCost = totalSold * product.purchasePrice;
      const profit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      const daysInPeriod = parseInt(selectedPeriod);

      return {
        productId: product.id,
        productName: product.name,
        totalSold,
        totalRevenue,
        totalCost,
        profit,
        profitMargin,
        averageDailySales: daysInPeriod > 0 ? totalSold / daysInPeriod : 0,
      };
    });

    return productStats.sort((a, b) => b.totalRevenue - a.totalRevenue);
  };

  const getExpenseBreakdown = () => {
    const { startDate, endDate } = getDateRange();
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const periodExpenses = business.expenses.filter(
      (expense) => expense.date >= startDateStr && expense.date <= endDateStr
    );

    const breakdown = periodExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(breakdown).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const dailyStats = getDailyStats();
  const productStats = getProductStats();
  const expenseBreakdown = getExpenseBreakdown();

  const totalRevenue = dailyStats.reduce(
    (sum, stat) => sum + stat.totalSales,
    0
  );
  const totalExpenses = dailyStats.reduce(
    (sum, stat) => sum + stat.totalExpenses,
    0
  );
  const totalProfit = totalRevenue - totalExpenses;
  const overallProfitMargin =
    totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Estadísticas</h3>
          <p className="text-gray-600 mt-1">
            Análisis detallado del rendimiento del negocio
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Select
            label="Período"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-40"
            classNames={{
              trigger:
                "border-2 border-gray-200 hover:border-purple-400 focus-within:border-purple-500",
            }}
          >
            <SelectItem key="7" value="7">
              Últimos 7 días
            </SelectItem>
            <SelectItem key="30" value="30">
              Últimos 30 días
            </SelectItem>
            <SelectItem key="90" value="90">
              Últimos 90 días
            </SelectItem>
          </Select>
          <Input
            type="date"
            label="Fecha final"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-40"
            classNames={{
              inputWrapper:
                "border-2 border-gray-200 hover:border-purple-400 focus-within:border-purple-500",
            }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
              <p className="text-sm text-blue-600 font-medium">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {StorageService.formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-red-600 font-medium">Gastos Totales</p>
              <p className="text-2xl font-bold text-red-800">
                {StorageService.formatCurrency(totalExpenses)}
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">
                Beneficio Neto
              </p>
              <p className="text-2xl font-bold text-green-800">
                {StorageService.formatCurrency(totalProfit)}
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Margen de Beneficio
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {overallProfitMargin.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue vs Expenses Chart */}
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Ingresos vs Gastos
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => StorageService.formatDate(value)}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    StorageService.formatCurrency(value),
                    "",
                  ]}
                  labelFormatter={(label) =>
                    StorageService.formatDate(label as string)
                  }
                />
                <Line
                  type="monotone"
                  dataKey="totalSales"
                  stroke="#0088FE"
                  name="Ingresos"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="totalExpenses"
                  stroke="#FF8042"
                  name="Gastos"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Profit Chart */}
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Beneficio Diario
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => StorageService.formatDate(value)}
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    StorageService.formatCurrency(value),
                    "",
                  ]}
                  labelFormatter={(label) =>
                    StorageService.formatDate(label as string)
                  }
                />
                <Bar dataKey="profit" fill="#00C49F" name="Beneficio" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Top Products */}
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Productos Más Vendidos
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {productStats.slice(0, 5).map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {product.totalSold} unidades vendidas
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {StorageService.formatCurrency(product.totalRevenue)}
                    </p>
                    <Chip
                      size="sm"
                      color={
                        product.profitMargin > 20
                          ? "success"
                          : product.profitMargin > 10
                          ? "warning"
                          : "danger"
                      }
                      variant="flat"
                      className="mt-1"
                    >
                      {product.profitMargin.toFixed(1)}%
                    </Chip>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Expense Breakdown */}
        <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Desglose de Gastos
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    StorageService.formatCurrency(value),
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Profit Margin Progress */}
      <Card className="bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader className="pb-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Margen de Beneficio por Producto
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {productStats.slice(0, 10).map((product) => (
              <div
                key={product.productId}
                className="flex items-center gap-4 p-3 bg-gray-50/30 rounded-lg"
              >
                <div className="w-32">
                  <p className="font-semibold text-gray-800 truncate">
                    {product.productName}
                  </p>
                </div>
                <div className="flex-1">
                  <Progress
                    value={Math.max(0, Math.min(100, product.profitMargin))}
                    color={
                      product.profitMargin > 20
                        ? "success"
                        : product.profitMargin > 10
                        ? "warning"
                        : "danger"
                    }
                    className="w-full"
                  />
                </div>
                <div className="w-20 text-right">
                  <p className="text-sm font-semibold text-gray-700">
                    {product.profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
