export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  product: string;
  quantity: number;
  unitPrice: number;
  served: boolean;
  customerIds: string[]; // Array of customer IDs or empty array for "todos"
  isForAll: boolean; // true when the order is for all customers
}

export interface Table {
  id: string;
  number: number;
  customers: Customer[];
  orders: OrderItem[];
  isOpen: boolean;
  openedAt: Date;
  closedAt?: Date;
}