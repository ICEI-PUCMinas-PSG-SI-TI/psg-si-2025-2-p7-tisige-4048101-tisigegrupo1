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
    customerIds: string[];
    isForAll: boolean;
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
