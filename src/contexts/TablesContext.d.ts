import React, { ReactNode } from 'react';
import { Table, Customer, OrderItem } from '@/types';
export interface Product {
    id: string;
    name: string;
    price: number;
}
export interface RegisteredCustomer {
    id: string;
    name: string;
    phone: string;
}
interface TablesContextType {
    tables: Table[];
    products: Product[];
    registeredCustomers: RegisteredCustomer[];
    createTable: (number: number) => void;
    addCustomerToTable: (tableId: string, customer: Omit<Customer, 'id'>) => void;
    addOrderToTable: (tableId: string, order: Omit<OrderItem, 'id' | 'served'>) => void;
    toggleOrderServed: (tableId: string, orderId: string) => void;
    closeTable: (tableId: string) => void;
    getTableTotal: (tableId: string) => number;
    getTableById: (tableId: string) => Table | undefined;
    addProduct: (product: Omit<Product, 'id'>) => void;
    addRegisteredCustomer: (customer: Omit<RegisteredCustomer, 'id'>) => void;
}
export declare const useTablesContext: () => TablesContextType;
interface TablesProviderProps {
    children: ReactNode;
}
export declare const TablesProvider: React.FC<TablesProviderProps>;
export {};
