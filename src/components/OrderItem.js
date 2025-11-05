import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const OrderItem = ({ order, tableId }) => {
    const { toggleOrderServed, getTableById } = useTablesContext();
    const table = getTableById(tableId);
    const getCustomerNames = () => {
        if (order.isForAll)
            return 'Todos os clientes';
        if (!table)
            return 'Mesa não encontrada';
        const customers = table.customers.filter(c => order.customerIds.includes(c.id));
        return customers.map(c => c.name).join(', ') || 'Clientes não encontrados';
    };
    const total = order.quantity * order.unitPrice;
    return (_jsx(Card, { className: `bg-card border-border transition-colors ${order.served ? 'bg-success/10 border-success/30' : ''}`, children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h4", { className: "font-semibold text-foreground", children: order.product }), _jsx(Badge, { variant: order.served ? "default" : "secondary", className: order.served ? "bg-success text-success-foreground" : "", children: order.served ? 'Servido' : 'Pendente' })] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: ["Cliente(s): ", getCustomerNames()] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [order.quantity, "x R$ ", order.unitPrice.toFixed(2), " = R$ ", total.toFixed(2)] })] }), _jsx(Button, { size: "sm", variant: order.served ? "secondary" : "default", onClick: () => toggleOrderServed(tableId, order.id), className: order.served ?
                            "bg-secondary hover:bg-secondary/80 text-secondary-foreground" :
                            "bg-success hover:bg-success/90 text-success-foreground", children: order.served ? _jsx(X, { className: "h-4 w-4" }) : _jsx(Check, { className: "h-4 w-4" }) })] }) }) }));
};
