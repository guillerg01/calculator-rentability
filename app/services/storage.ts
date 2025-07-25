import { Business, Product, Sale, Expense } from "../types";

const STORAGE_KEYS = {
  BUSINESSES: "profitability_calculator_businesses",
  CURRENT_BUSINESS: "profitability_calculator_current_business",
};

export class StorageService {
  // Business management
  static getBusinesses(): Business[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    return data ? JSON.parse(data) : [];
  }

  static saveBusinesses(businesses: Business[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses));
  }

  static addBusiness(business: Business): void {
    const businesses = this.getBusinesses();
    businesses.push(business);
    this.saveBusinesses(businesses);
  }

  static updateBusiness(updatedBusiness: Business): void {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex((b) => b.id === updatedBusiness.id);
    if (index !== -1) {
      businesses[index] = updatedBusiness;
      this.saveBusinesses(businesses);
    }
  }

  static deleteBusiness(businessId: string): void {
    const businesses = this.getBusinesses();
    const filtered = businesses.filter((b) => b.id !== businessId);
    this.saveBusinesses(filtered);
  }

  static getBusiness(businessId: string): Business | null {
    const businesses = this.getBusinesses();
    return businesses.find((b) => b.id === businessId) || null;
  }

  // Current business management
  static getCurrentBusinessId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.CURRENT_BUSINESS);
  }

  static setCurrentBusinessId(businessId: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_BUSINESS, businessId);
  }

  // Product management
  static addProduct(businessId: string, product: Product): void {
    const business = this.getBusiness(businessId);
    if (business) {
      business.products.push(product);
      this.updateBusiness(business);
    }
  }

  static updateProduct(
    businessId: string,
    productId: string,
    updatedProduct: Product
  ): void {
    const business = this.getBusiness(businessId);
    if (business) {
      const index = business.products.findIndex((p) => p.id === productId);
      if (index !== -1) {
        business.products[index] = updatedProduct;
        this.updateBusiness(business);
      }
    }
  }

  static deleteProduct(businessId: string, productId: string): void {
    const business = this.getBusiness(businessId);
    if (business) {
      business.products = business.products.filter((p) => p.id !== productId);
      this.updateBusiness(business);
    }
  }

  // Sale management
  static addSale(businessId: string, sale: Sale): void {
    const business = this.getBusiness(businessId);
    if (business) {
      business.sales.push(sale);

      // Update product stock
      const product = business.products.find((p) => p.id === sale.productId);
      if (product) {
        product.stock -= sale.quantity;
        if (product.stock < 0) product.stock = 0;
      }

      this.updateBusiness(business);
    }
  }

  static getSalesByDate(businessId: string, date: string): Sale[] {
    const business = this.getBusiness(businessId);
    if (!business) return [];
    return business.sales.filter((sale) => sale.date === date);
  }

  // Expense management
  static addExpense(businessId: string, expense: Expense): void {
    const business = this.getBusiness(businessId);
    if (business) {
      business.expenses.push(expense);
      this.updateBusiness(business);
    }
  }

  static getExpensesByDate(businessId: string, date: string): Expense[] {
    const business = this.getBusiness(businessId);
    if (!business) return [];
    return business.expenses.filter((expense) => expense.date === date);
  }

  // Utility functions
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString("es-ES");
  }
}
