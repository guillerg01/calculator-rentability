export interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  category: string;
  description?: string;
  stock: number;
  minStock: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
  customerName?: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  products: Product[];
  sales: Sale[];
  expenses: Expense[];
}

export interface DailyStats {
  date: string;
  totalSales: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
  productsSold: number;
  topProduct?: {
    name: string;
    quantity: number;
    revenue: number;
  };
}

export interface ProductStats {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
  totalCost: number;
  profit: number;
  profitMargin: number;
  averageDailySales: number;
}
