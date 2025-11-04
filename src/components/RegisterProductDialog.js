import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const RegisterProductDialog = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const { addProduct } = useTablesContext();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && parseFloat(price) > 0) {
            addProduct({
                name: name.trim(),
                price: parseFloat(price),
            });
            setName('');
            setPrice('');
            setOpen(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: "outline", className: "border-beer text-beer hover:bg-beer/10", children: [_jsx(Utensils, { className: "mr-2 h-4 w-4" }), "Cadastrar Produto"] }) }), _jsxs(DialogContent, { className: "bg-card border-border", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [_jsx(Utensils, { className: "h-5 w-5 text-beer" }), "Cadastrar Novo Produto"] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "productName", className: "text-foreground", children: "Nome do Produto *" }), _jsx(Input, { id: "productName", value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex: Por\u00E7\u00E3o de Frango", className: "bg-input border-border text-foreground", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "productPrice", className: "text-foreground", children: "Pre\u00E7o (R$) *" }), _jsx(Input, { id: "productPrice", type: "number", step: "0.01", value: price, onChange: (e) => setPrice(e.target.value), placeholder: "0,00", min: "0", className: "bg-input border-border text-foreground", required: true })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setOpen(false), className: "flex-1", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground", children: "Cadastrar" })] })] })] })] }));
};
