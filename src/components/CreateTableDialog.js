import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const CreateTableDialog = () => {
    const [open, setOpen] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const { createTable } = useTablesContext();
    const handleSubmit = (e) => {
        e.preventDefault();
        const number = parseInt(tableNumber);
        if (number > 0) {
            createTable(number);
            setTableNumber('');
            setOpen(false);
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Nova Mesa"] }) }), _jsxs(DialogContent, { className: "bg-card border-border", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-foreground", children: "Abrir Nova Mesa" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "tableNumber", className: "text-foreground", children: "N\u00FAmero da Mesa" }), _jsx(Input, { id: "tableNumber", type: "number", value: tableNumber, onChange: (e) => setTableNumber(e.target.value), placeholder: "Digite o n\u00FAmero da mesa", className: "bg-input border-border text-foreground", required: true, min: "1" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setOpen(false), className: "flex-1", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground", children: "Criar Mesa" })] })] })] })] }));
};
