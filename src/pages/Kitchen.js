import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTablesContext } from '@/contexts/TablesContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Check, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
export default function Kitchen() {
    const { tables, toggleOrderServed } = useTablesContext();
    // Get all orders from all open tables
    const allOrders = tables
        .filter(table => table.isOpen)
        .flatMap(table => table.orders.map(order => ({
        ...order,
        tableNumber: table.number,
        tableId: table.id,
    })))
        .sort((a, b) => {
        // Sort by served status (unserved first) and then by order time
        if (a.served === b.served) {
            return a.id.localeCompare(b.id);
        }
        return a.served ? 1 : -1;
    });
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Header, {}), _jsxs("div", { className: "container mx-auto p-4 md:p-6 max-w-4xl", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx("div", { className: "bg-primary/20 p-3 rounded-full", children: _jsx(ChefHat, { className: "h-6 w-6 text-primary" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Cozinha" }), _jsx("p", { className: "text-muted-foreground", children: "Pedidos em andamento" })] })] }), allOrders.length === 0 ? (_jsx(Card, { className: "bg-card border-border", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(ChefHat, { className: "h-12 w-12 text-muted-foreground mx-auto mb-4" }), _jsx("p", { className: "text-muted-foreground", children: "Nenhum pedido no momento" })] }) })) : (_jsx("div", { className: "space-y-3", children: allOrders.map((order) => (_jsxs(Card, { className: `bg-card border-border transition-opacity ${order.served ? 'opacity-50' : ''}`, children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: "outline", className: "bg-primary/10 text-primary border-primary", children: ["Mesa ", order.tableNumber] }), order.served ? (_jsxs(Badge, { variant: "outline", className: "bg-green-500/10 text-green-500 border-green-500", children: [_jsx(Check, { className: "h-3 w-3 mr-1" }), "Servido"] })) : (_jsxs(Badge, { variant: "outline", className: "bg-orange-500/10 text-orange-500 border-orange-500", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), "Pendente"] }))] }), _jsx(Button, { size: "sm", variant: order.served ? "secondary" : "default", onClick: () => toggleOrderServed(order.tableId, order.id), className: !order.served ? "bg-primary hover:bg-primary/90 text-primary-foreground" : "", children: order.served ? 'Reabrir' : 'Marcar como servido' })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-foreground", children: order.product }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Quantidade: ", _jsxs("span", { className: "font-semibold text-foreground", children: [order.quantity, "x"] })] })] }), order.isForAll ? (_jsx(Badge, { variant: "secondary", className: "bg-secondary/50", children: "Para todos da mesa" })) : (_jsxs("p", { className: "text-xs text-muted-foreground", children: ["Para ", order.customerIds.length, " cliente(s)"] }))] }) })] }, order.id))) }))] })] }));
}
