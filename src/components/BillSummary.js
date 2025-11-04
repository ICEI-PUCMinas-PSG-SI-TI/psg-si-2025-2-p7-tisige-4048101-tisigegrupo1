import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Receipt, Users, Calculator } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const BillSummary = ({ table, onBack, onClose }) => {
    const { closeTable, getTableTotal } = useTablesContext();
    const total = getTableTotal(table.id);
    const customerCount = table.customers.length;
    const totalPerPerson = customerCount > 0 ? total / customerCount : 0;
    const handleCloseTable = () => {
        closeTable(table.id);
        onClose();
    };
    const ordersByCustomer = table.customers.map(customer => {
        const customerOrders = table.orders.filter(order => order.isForAll || order.customerIds.includes(customer.id));
        const customerTotal = customerOrders.reduce((sum, order) => {
            // If order is for all, divide the cost by number of customers
            const orderCost = order.quantity * order.unitPrice;
            return sum + (order.isForAll ? orderCost / table.customers.length : orderCost);
        }, 0);
        return {
            customer,
            orders: customerOrders,
            total: customerTotal,
        };
    });
    // Orders for all customers
    const allCustomerOrders = table.orders.filter(order => order.isForAll);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Button, { variant: "secondary", size: "sm", onClick: onBack, className: "bg-secondary hover:bg-secondary/80", children: _jsx(ArrowLeft, { className: "h-4 w-4" }) }), _jsx("div", { children: _jsxs("h1", { className: "text-2xl font-bold text-beer flex items-center gap-2", children: [_jsx(Receipt, { className: "h-6 w-6" }), "Conta - Mesa ", table.number] }) })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { className: "bg-card border-border", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-foreground", children: "Resumo da Conta" }) }), _jsxs(CardContent, { className: "space-y-4", children: [allCustomerOrders.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-primary mb-2", children: "Pedidos para toda a mesa" }), _jsx("div", { className: "space-y-1 ml-4", children: allCustomerOrders.map(order => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [order.quantity, "x ", order.product] }), _jsxs("span", { className: "text-foreground", children: ["R$ ", (order.quantity * order.unitPrice).toFixed(2)] })] }, order.id))) })] })), ordersByCustomer.map(({ customer, orders, total: customerTotal }) => (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-primary mb-2", children: customer.name }), _jsxs("div", { className: "space-y-1 ml-4", children: [orders.filter(order => !order.isForAll).map(order => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [order.quantity, "x ", order.product] }), _jsxs("span", { className: "text-foreground", children: ["R$ ", (order.quantity * order.unitPrice).toFixed(2)] })] }, order.id))), orders.filter(order => order.isForAll).map(order => (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [order.quantity, "x ", order.product, " (compartilhado)"] }), _jsxs("span", { className: "text-foreground", children: ["R$ ", ((order.quantity * order.unitPrice) / table.customers.length).toFixed(2)] })] }, order.id))), orders.length > 0 && (_jsxs("div", { className: "flex justify-between text-sm font-medium border-t border-border pt-1 mt-1", children: [_jsx("span", { className: "text-foreground", children: "Subtotal:" }), _jsxs("span", { className: "text-primary", children: ["R$ ", customerTotal.toFixed(2)] })] }))] })] }, customer.id))), _jsx(Separator, { className: "bg-border" }), _jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "flex justify-between text-lg font-bold", children: [_jsx("span", { className: "text-foreground", children: "Total Geral:" }), _jsxs("span", { className: "text-beer", children: ["R$ ", total.toFixed(2)] })] }) })] })] }), _jsxs(Card, { className: "bg-card border-border", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-foreground flex items-center gap-2", children: [_jsx(Calculator, { className: "h-5 w-5" }), "Divis\u00E3o da Conta"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "bg-muted/30 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Users, { className: "h-4 w-4 text-primary" }), _jsxs("span", { className: "text-sm text-muted-foreground", children: [customerCount, " pessoa(s) na mesa"] })] }), _jsxs("div", { className: "text-lg font-semibold text-foreground", children: ["R$ ", totalPerPerson.toFixed(2), " por pessoa"] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "font-medium text-foreground", children: "Consumo Individual:" }), ordersByCustomer.map(({ customer, total: customerTotal }) => (_jsxs("div", { className: "flex justify-between p-2 bg-muted/20 rounded", children: [_jsx("span", { className: "text-foreground", children: customer.name }), _jsxs("span", { className: "font-medium text-primary", children: ["R$ ", customerTotal.toFixed(2)] })] }, customer.id)))] })] })] })] }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx(Button, { variant: "secondary", onClick: onBack, className: "bg-secondary hover:bg-secondary/80", children: "Voltar para Mesa" }), _jsx(Button, { onClick: handleCloseTable, className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground", children: "Fechar Mesa" })] })] }));
};
