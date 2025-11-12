import React, { createContext, useContext, ReactNode } from 'react';
import { Table, Customer, OrderItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  useTables,
  useCreateTable,
  useAddCustomer,
  useAddOrder,
  useToggleOrderServed,
  useCloseTable,
} from '@/hooks/useSupabaseTables';
import { useProducts, useAddProduct, Product } from '@/hooks/useSupabaseProducts';
import {
  useRegisteredCustomers,
  useAddRegisteredCustomer,
  RegisteredCustomer,
} from '@/hooks/useSupabaseCustomers';

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
  const { toast } = useToast();

  // Fetch data
  const { data: tables = [] } = useTables();
  const { data: products = [] } = useProducts();
  const { data: registeredCustomers = [] } = useRegisteredCustomers();

  // Mutations
  const createTableMutation = useCreateTable();
  const addCustomerMutation = useAddCustomer();
  const addOrderMutation = useAddOrder();
  const toggleOrderMutation = useToggleOrderServed();
  const closeTableMutation = useCloseTable();
  const addProductMutation = useAddProduct();
  const addRegisteredCustomerMutation = useAddRegisteredCustomer();

  const createTable = async (number: number) => {
    const existingTable = tables.find(table => table.number === number && table.isOpen);
    if (existingTable) {
      toast({
        title: "Mesa já existe",
        description: `A mesa ${number} já está aberta.`,
        variant: "destructive",
      });
      return;
    }

    try {
      await createTableMutation.mutateAsync(number);
      toast({
        title: "Mesa criada",
        description: `Mesa ${number} aberta com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a mesa.",
        variant: "destructive",
      });
    }
  };

  const addCustomerToTable = async (tableId: string, customerData: Omit<Customer, 'id'>) => {
    try {
      await addCustomerMutation.mutateAsync({ tableId, customer: customerData });
      toast({
        title: "Cliente adicionado",
        description: `${customerData.name} foi adicionado à mesa.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o cliente.",
        variant: "destructive",
      });
    }
  };

  const addOrderToTable = async (tableId: string, orderData: Omit<OrderItem, 'id' | 'served'>) => {
    try {
      await addOrderMutation.mutateAsync({ tableId, order: orderData });
      
      const customerDescription = orderData.isForAll ? 
        'todos os clientes' : 
        `cliente(s) selecionado(s)`;

      toast({
        title: "Pedido adicionado",
        description: `${orderData.product} adicionado para ${customerDescription}.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o pedido.",
        variant: "destructive",
      });
    }
  };

  const toggleOrderServed = async (tableId: string, orderId: string) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    const order = table.orders.find(o => o.id === orderId);
    if (!order) return;

    try {
      await toggleOrderMutation.mutateAsync({ orderId, served: order.served });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o pedido.",
        variant: "destructive",
      });
    }
  };

  const closeTable = async (tableId: string) => {
    try {
      await closeTableMutation.mutateAsync(tableId);
      toast({
        title: "Mesa fechada",
        description: "Conta fechada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível fechar a mesa.",
        variant: "destructive",
      });
    }
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

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      await addProductMutation.mutateAsync(productData);
      toast({
        title: "Produto cadastrado",
        description: `${productData.name} foi cadastrado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o produto.",
        variant: "destructive",
      });
    }
  };

  const addRegisteredCustomer = async (customerData: Omit<RegisteredCustomer, 'id'>) => {
    try {
      await addRegisteredCustomerMutation.mutateAsync(customerData);
      toast({
        title: "Cliente cadastrado",
        description: `${customerData.name} foi cadastrado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o cliente.",
        variant: "destructive",
      });
    }
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

export type { Product, RegisteredCustomer };
