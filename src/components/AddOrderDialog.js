import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Utensils } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
export const AddOrderDialog = ({ tableId, customers }) => {
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [customProduct, setCustomProduct] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unitPrice, setUnitPrice] = useState('');
    const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
    const [isForAll, setIsForAll] = useState(false);
    const { addOrderToTable, products } = useTablesContext();
    const handleSubmit = (e) => {
        e.preventDefault();
        const product = selectedProduct || customProduct;
        const price = selectedProduct ?
            products.find(p => p.name === selectedProduct)?.price || 0 :
            parseFloat(unitPrice);
        if (product.trim() && price > 0 && (isForAll || selectedCustomerIds.length > 0)) {
            addOrderToTable(tableId, {
                product: product.trim(),
                quantity: parseInt(quantity),
                unitPrice: price,
                customerIds: isForAll ? [] : selectedCustomerIds,
                isForAll,
            });
            // Reset form
            setSelectedProduct('');
            setCustomProduct('');
            setQuantity('1');
            setUnitPrice('');
            setSelectedCustomerIds([]);
            setIsForAll(false);
            setOpen(false);
        }
    };
    const handleProductSelect = (productName) => {
        setSelectedProduct(productName);
        setCustomProduct('');
        const product = products.find(p => p.name === productName);
        if (product) {
            setUnitPrice(product.price.toString());
        }
    };
    const handleCustomerToggle = (customerId, checked) => {
        if (checked) {
            setSelectedCustomerIds(prev => [...prev, customerId]);
        }
        else {
            setSelectedCustomerIds(prev => prev.filter(id => id !== customerId));
        }
    };
    const handleForAllToggle = (checked) => {
        setIsForAll(checked);
        if (checked) {
            setSelectedCustomerIds([]);
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", className: "bg-primary hover:bg-primary/90 text-primary-foreground", children: [_jsx(Plus, { className: "mr-1 h-3 w-3" }), "Adicionar"] }) }), _jsxs(DialogContent, { className: "bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-foreground", children: "Adicionar Pedido" }) }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-foreground", children: "Produtos do Menu" }), _jsx("div", { className: "grid grid-cols-1 gap-2 mt-2", children: products.map((product) => (_jsx(Card, { className: `cursor-pointer transition-colors ${selectedProduct === product.name ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-muted/50'}`, onClick: () => handleProductSelect(product.name), children: _jsx(CardContent, { className: "p-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Utensils, { className: "h-4 w-4 text-primary" }), _jsx("span", { className: "font-medium text-foreground", children: product.name })] }), _jsxs("span", { className: "text-beer font-semibold", children: ["R$ ", product.price.toFixed(2)] })] }) }) }, product.name))) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx(Label, { className: "text-foreground", children: "Ou adicione um produto personalizado:" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "customProduct", className: "text-foreground", children: "Produto Personalizado" }), _jsx(Input, { id: "customProduct", value: customProduct, onChange: (e) => {
                                                            setCustomProduct(e.target.value);
                                                            if (e.target.value) {
                                                                setSelectedProduct('');
                                                            }
                                                        }, placeholder: "Nome do produto", className: "bg-input border-border text-foreground" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "customPrice", className: "text-foreground", children: "Pre\u00E7o Unit\u00E1rio (R$)" }), _jsx(Input, { id: "customPrice", type: "number", step: "0.01", value: unitPrice, onChange: (e) => setUnitPrice(e.target.value), placeholder: "0,00", min: "0", className: "bg-input border-border text-foreground" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "quantity", className: "text-foreground", children: "Quantidade *" }), _jsx(Input, { id: "quantity", type: "number", value: quantity, onChange: (e) => setQuantity(e.target.value), placeholder: "1", min: "1", className: "bg-input border-border text-foreground w-24", required: true })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-foreground", children: "Para quem \u00E9 o pedido? *" }), _jsxs("div", { className: "space-y-3 mt-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "forAll", checked: isForAll, onCheckedChange: handleForAllToggle }), _jsx(Label, { htmlFor: "forAll", className: "text-foreground font-medium", children: "Todos os clientes da mesa" })] }), !isForAll && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { className: "text-sm text-muted-foreground", children: "Ou selecione clientes espec\u00EDficos:" }), customers.map((customer) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: customer.id, checked: selectedCustomerIds.includes(customer.id), onCheckedChange: (checked) => handleCustomerToggle(customer.id, !!checked) }), _jsx(Label, { htmlFor: customer.id, className: "text-foreground", children: customer.name })] }, customer.id)))] }))] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { type: "button", variant: "secondary", onClick: () => setOpen(false), className: "flex-1", children: "Cancelar" }), _jsx(Button, { type: "submit", className: "flex-1 bg-primary hover:bg-primary/90 text-primary-foreground", children: "Adicionar Pedido" })] })] })] })] }));
};
