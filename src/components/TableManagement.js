import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, ShoppingCart, Receipt } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
import { AddCustomerDialog } from '@/components/AddCustomerDialog';
import { AddOrderDialog } from '@/components/AddOrderDialog';
import { OrderItem } from '@/components/OrderItem';
import { CustomerList } from '@/components/CustomerList';
import { BillSummary } from '@/components/BillSummary';
export const TableManagement = ({ tableId, onBack }) => {
    const { getTableById } = useTablesContext();
    const [showBill, setShowBill] = useState(false);
    const table = getTableById(tableId);
    if (!table) {
        return (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-muted-foreground", children: "Mesa n\u00E3o encontrada" }), _jsx(Button, { onClick: onBack, className: "mt-4", children: "Voltar" })] }));
    }
    if (showBill) {
        return (_jsx(BillSummary, { table: table, onBack: () => setShowBill(false), onClose: onBack }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: onBack, className: "bg-secondary hover:bg-secondary/80", children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-beer", children: ["Mesa ", table.number] }), _jsx(Badge, { variant: table.isOpen ? "default" : "secondary", className: "bg-primary text-primary-foreground", children: table.isOpen ? "Aberta" : "Fechada" })] })] }), table.isOpen && (_jsxs(Button, { onClick: () => setShowBill(true), className: "bg-accent hover:bg-accent/90 text-accent-foreground", children: [_jsx(Receipt, { className: "mr-2 h-4 w-4" }), "Fechar Conta"] }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "bg-card border-border", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-foreground", children: [_jsx(Users, { className: "h-5 w-5" }), "Clientes (", table.customers.length, ")"] }), table.isOpen && _jsx(AddCustomerDialog, { tableId: tableId })] }) }), _jsx(CardContent, { children: _jsx(CustomerList, { customers: table.customers }) })] }), _jsxs(Card, { className: "bg-card border-border", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-foreground", children: [_jsx(ShoppingCart, { className: "h-5 w-5" }), "Pedidos (", table.orders.length, ")"] }), table.isOpen && table.customers.length > 0 && (_jsx(AddOrderDialog, { tableId: tableId, customers: table.customers }))] }) }), _jsx(CardContent, { children: table.orders.length === 0 ? (_jsx("p", { className: "text-muted-foreground text-center py-4", children: "Nenhum pedido ainda" })) : (_jsx("div", { className: "space-y-3", children: table.orders.map((order) => (_jsx(OrderItem, { order: order, tableId: tableId }, order.id))) })) })] })] })] }));
};
