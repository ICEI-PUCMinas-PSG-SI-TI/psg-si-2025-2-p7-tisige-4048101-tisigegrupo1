import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Table, Customer, OrderItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

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

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export const useTablesContext = () => {
  const context = useContext(TablesContext);
  if (!context) {
    throw new Error('useTablesContext must be used within a TablesProvider');
  }
  return context;
};

interface TablesProviderProps {
  children: ReactNode;
}

export const TablesProvider: React.FC<TablesProviderProps> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>([]);
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Camafeu de Camarão', price: 15.90 },
    { id: '2', name: 'Fritas c/ Catupiry', price: 12.90 },
    { id: '3', name: 'Maçã de Peito e Batata', price: 18.90 },
    { id: '4', name: 'Chopp', price: 8.90 },
    { id: '5', name: 'Xeque Mate', price: 10.90 },
  ]);
  const [registeredCustomers, setRegisteredCustomers] = useState<RegisteredCustomer[]>([]);
  const { toast } = useToast();

  const createTable = (number: number) => {
    const existingTable = tables.find(table => table.number === number && table.isOpen);
    if (existingTable) {
      toast({
        title: "Mesa já existe",
        description: `A mesa ${number} já está aberta.`,
        variant: "destructive",
      });
      return;
    }

    const newTable: Table = {
      id: Date.now().toString(),
      number,
      customers: [],
      orders: [],
      isOpen: true,
      openedAt: new Date(),
    };

    setTables(prev => [...prev, newTable]);
    toast({
      title: "Mesa criada",
      description: `Mesa ${number} aberta com sucesso!`,
    });
  };

  const addCustomerToTable = (tableId: string, customerData: Omit<Customer, 'id'>) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        const newCustomer: Customer = {
          ...customerData,
          id: Date.now().toString(),
        };
        return {
          ...table,
          customers: [...table.customers, newCustomer],
        };
      }
      return table;
    }));

    toast({
      title: "Cliente adicionado",
      description: `${customerData.name} foi adicionado à mesa.`,
    });
  };

  const addOrderToTable = (tableId: string, orderData: Omit<OrderItem, 'id' | 'served'>) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        const newOrder: OrderItem = {
          ...orderData,
          id: Date.now().toString(),
          served: false,
        };
        return {
          ...table,
          orders: [...table.orders, newOrder],
        };
      }
      return table;
    }));

    const customerDescription = orderData.isForAll ? 
      'todos os clientes' : 
      `cliente(s) selecionado(s)`;

    toast({
      title: "Pedido adicionado",
      description: `${orderData.product} adicionado para ${customerDescription}.`,
    });
  };

  const toggleOrderServed = (tableId: string, orderId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          orders: table.orders.map(order =>
            order.id === orderId ? { ...order, served: !order.served } : order
          ),
        };
      }
      return table;
    }));
  };

  const closeTable = (tableId: string) => {
    setTables(prev => prev.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          isOpen: false,
          closedAt: new Date(),
        };
      }
      return table;
    }));

    toast({
      title: "Mesa fechada",
      description: "Conta fechada com sucesso!",
    });
  };

  const getTableTotal = (tableId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return 0;
    
    return table.orders.reduce((total, order) => {
      return total + (order.quantity * order.unitPrice);
    }, 0);
  };

  const getTableById = (tableId: string) => {
    return tables.find(table => table.id === tableId);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
    };
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: "Produto cadastrado",
      description: `${productData.name} foi cadastrado com sucesso!`,
    });
  };

  const addRegisteredCustomer = (customerData: Omit<RegisteredCustomer, 'id'>) => {
    const newCustomer: RegisteredCustomer = {
      ...customerData,
      id: Date.now().toString(),
    };
    setRegisteredCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Cliente cadastrado",
      description: `${customerData.name} foi cadastrado com sucesso!`,
    });
  };

  const value: TablesContextType = {
    tables,
    products,
    registeredCustomers,
    createTable,
    addCustomerToTable,
    addOrderToTable,
    toggleOrderServed,
    closeTable,
    getTableTotal,
    getTableById,
    addProduct,
    addRegisteredCustomer,
  };

  return (
    <TablesContext.Provider value={value}>
      {children}
    </TablesContext.Provider>
  );
};