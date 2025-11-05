import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Beer, Utensils, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RegisterProductDialog } from './RegisterProductDialog';
import { RegisterCustomerDialog } from './RegisterCustomerDialog';
export const Header = () => {
    return (_jsx("header", { className: "bg-gradient-dark border-b border-border py-4", children: _jsxs("div", { className: "container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-3 hover:opacity-90 transition-opacity", children: [_jsx(Beer, { className: "h-6 w-6 text-beer" }), _jsx("h1", { className: "text-2xl font-extrabold text-beer tracking-tight", children: "Boteco do Morcego" }), _jsx(Utensils, { className: "h-5 w-5 text-beer" })] }), _jsxs("div", { className: "flex gap-3 items-center", children: [_jsx(Link, { to: "/cozinha", children: _jsxs(Button, { size: "sm", variant: "ghost", className: "border-beer text-beer hover:bg-beer/10", children: [_jsx(ChefHat, { className: "mr-2 h-4 w-4" }), "Cozinha"] }) }), _jsx(RegisterCustomerDialog, {}), _jsx(RegisterProductDialog, {})] })] }) }));
};
