import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone } from 'lucide-react';
export const CustomerList = ({ customers }) => {
    if (customers.length === 0) {
        return (_jsx("p", { className: "text-muted-foreground text-center py-4", children: "Nenhum cliente adicionado ainda" }));
    }
    return (_jsx("div", { className: "space-y-3", children: customers.map((customer) => (_jsx(Card, { className: "bg-muted/30 border-border", children: _jsx(CardContent, { className: "p-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary/20 p-2 rounded-full", children: _jsx(User, { className: "h-4 w-4 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-foreground", children: customer.name }), customer.phone && (_jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [_jsx(Phone, { className: "h-3 w-3" }), _jsx("span", { children: customer.phone })] }))] })] }) }) }, customer.id))) }));
};
