import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, UserPlus } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
import { Card, CardContent } from '@/components/ui/card';
export const AddCustomerDialog = ({ tableId }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const { addCustomerToTable, registeredCustomers } = useTablesContext();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            addCustomerToTable(tableId, { name: name.trim(), phone: phone.trim() });
            setName('');
            setPhone('');
            setOpen(false);
        }
    };
    const handleSelectRegisteredCustomer = (customer) => {
        addCustomerToTable(tableId, { name: customer.name, phone: customer.phone });
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", className: "bg-primary hover:bg-primary/90 text-primary-foreground", children: [_jsx(Plus, { className: "mr-1 h-3 w-3" }), "Adicionar"] }) }), _jsxs(DialogContent, { className: "bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-foreground", children: "Adicionar Cliente" }) }), _jsxs("div", { className: "space-y-6", children: [registeredCustomers.length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-foreground font-semibold", children: "Selecionar Cliente Cadastrado" }), _jsx("div", { className: "grid grid-cols-1 gap-2 mt-2 max-h-[200px] overflow-y-auto", children: registeredCustomers.map((customer) => (_jsx(Card, { className: "cursor-pointer transition-colors bg-card border-border hover:bg-primary/10 hover:border-primary", onClick: () => handleSelectRegisteredCustomer(customer), children: _jsx(CardContent, { className: "p-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "h-4 w-4 text-primary" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium text-foreground", children: customer.name }), customer.phone && (_jsx("p", { className: "text-xs text-muted-foreground", children: customer.phone }))] })] }) }) }, customer.id))) })] })), registeredCustomers.length > 0 && (_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("span", { className: "w-full border-t border-border" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "Ou" }) })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx(Label, { className: "text-foreground font-semibold", children: "Adicionar Novo Cliente" }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "customerName", className: "text-foreground", children: "Nome *" }), _jsx(Input, { id: "customerName", value: name, onChange: (e) => setName(e.target.value), placeholder: "Nome do cliente", className: "bg-input border-border text-foreground", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "customerPhone", className: "text-foreground", children: "Telefone" }), _jsx(Input, { id: "customerPhone", type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "(11) 99999-9999", className: "bg-input border-border text-foreground" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setOpen(false), className: "flex-1", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground", children: "Adicionar" })] })] })] })] })] }));
};
