import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ShoppingCart, DollarSign } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const TableCard = ({ table, onSelect }) => {
    const { getTableTotal } = useTablesContext();
    const total = getTableTotal(table.id);
    return (_jsxs(Card, { className: "bg-card hover:bg-card/80 transition-colors cursor-pointer border-border", onClick: () => onSelect(table.id), children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "text-lg font-bold text-beer", children: ["Mesa ", table.number] }), _jsx(Badge, { variant: table.isOpen ? "default" : "secondary", className: "bg-primary text-primary-foreground", children: table.isOpen ? "Aberta" : "Fechada" })] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: [table.customers.length, " cliente(s)"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(ShoppingCart, { className: "h-4 w-4" }), _jsxs("span", { children: [table.orders.length, " pedido(s)"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-primary", children: [_jsx(DollarSign, { className: "h-4 w-4" }), _jsxs("span", { children: ["R$ ", total.toFixed(2)] })] })] }), table.isOpen && (_jsx(Button, { size: "sm", variant: "default", className: "w-full mt-4", onClick: (e) => {
                            e.stopPropagation();
                            onSelect(table.id);
                        }, children: "Gerenciar Mesa" }))] })] }));
};
