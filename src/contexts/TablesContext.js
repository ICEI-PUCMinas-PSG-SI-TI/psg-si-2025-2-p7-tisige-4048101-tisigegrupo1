import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
const TablesContext = createContext(undefined);
export const useTablesContext = () => {
    const context = useContext(TablesContext);
    if (!context) {
        throw new Error('useTablesContext must be used within a TablesProvider');
    }
    return context;
};
export const TablesProvider = ({ children }) => {
    const [tables, setTables] = useState([]);
    const [products, setProducts] = useState([
        { id: '1', name: 'Camafeu de Camarão', price: 15.90 },
        { id: '2', name: 'Fritas c/ Catupiry', price: 12.90 },
        { id: '3', name: 'Maçã de Peito e Batata', price: 18.90 },
        { id: '4', name: 'Chopp', price: 8.90 },
        { id: '5', name: 'Xeque Mate', price: 10.90 },
    ]);
    const [registeredCustomers, setRegisteredCustomers] = useState([]);
    const { toast } = useToast();
    const createTable = (number) => {
        const existingTable = tables.find(table => table.number === number && table.isOpen);
        if (existingTable) {
            toast({
                title: "Mesa já existe",
                description: `A mesa ${number} já está aberta.`,
                variant: "destructive",
            });
            return;
        }
        const newTable = {
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
    const addCustomerToTable = (tableId, customerData) => {
        setTables(prev => prev.map(table => {
            if (table.id === tableId) {
                const newCustomer = {
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
    const addOrderToTable = (tableId, orderData) => {
        setTables(prev => prev.map(table => {
            if (table.id === tableId) {
                const newOrder = {
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
    const toggleOrderServed = (tableId, orderId) => {
        setTables(prev => prev.map(table => {
            if (table.id === tableId) {
                return {
                    ...table,
                    orders: table.orders.map(order => order.id === orderId ? { ...order, served: !order.served } : order),
                };
            }
            return table;
        }));
    };
    const closeTable = (tableId) => {
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
    const getTableTotal = (tableId) => {
        const table = tables.find(t => t.id === tableId);
        if (!table)
            return 0;
        return table.orders.reduce((total, order) => {
            return total + (order.quantity * order.unitPrice);
        }, 0);
    };
    const getTableById = (tableId) => {
        return tables.find(table => table.id === tableId);
    };
    const addProduct = (productData) => {
        const newProduct = {
            ...productData,
            id: Date.now().toString(),
        };
        setProducts(prev => [...prev, newProduct]);
        toast({
            title: "Produto cadastrado",
            description: `${productData.name} foi cadastrado com sucesso!`,
        });
    };
    const addRegisteredCustomer = (customerData) => {
        const newCustomer = {
            ...customerData,
            id: Date.now().toString(),
        };
        setRegisteredCustomers(prev => [...prev, newCustomer]);
        toast({
            title: "Cliente cadastrado",
            description: `${customerData.name} foi cadastrado com sucesso!`,
        });
    };
    const value = {
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
    return (_jsx(TablesContext.Provider, { value: value, children: children }));
};
