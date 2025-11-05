import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const RegisterCustomerDialog = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const { addRegisteredCustomer } = useTablesContext();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            addRegisteredCustomer({
                name: name.trim(),
                phone: phone.trim(),
            });
            setName('');
            setPhone('');
            setOpen(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: "outline", className: "border-beer text-beer hover:bg-beer/10", children: [_jsx(Users, { className: "mr-2 h-4 w-4" }), "Cadastrar Cliente"] }) }), _jsxs(DialogContent, { className: "bg-card border-border", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5 text-beer" }), "Cadastrar Novo Cliente"] }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "customerName", className: "text-foreground", children: "Nome *" }), _jsx(Input, { id: "customerName", value: name, onChange: (e) => setName(e.target.value), placeholder: "Nome completo", className: "bg-input border-border text-foreground", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "customerPhone", className: "text-foreground", children: "Telefone" }), _jsx(Input, { id: "customerPhone", type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "(11) 99999-9999", className: "bg-input border-border text-foreground" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setOpen(false), className: "flex-1", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground", children: "Cadastrar" })] })] })] })] }));
};
