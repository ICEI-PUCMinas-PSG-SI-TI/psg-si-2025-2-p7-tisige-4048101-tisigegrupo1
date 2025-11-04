import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Utensils } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
import { Customer } from '@/types';

interface AddOrderDialogProps {
  tableId: string;
  customers: Customer[];
}

export const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ tableId, customers }) => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [customProduct, setCustomProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unitPrice, setUnitPrice] = useState('');
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [isForAll, setIsForAll] = useState(false);
  const { addOrderToTable, products } = useTablesContext();

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleProductSelect = (productName: string) => {
    setSelectedProduct(productName);
    setCustomProduct('');
    const product = products.find(p => p.name === productName);
    if (product) {
      setUnitPrice(product.price.toString());
    }
  };

  const handleCustomerToggle = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomerIds(prev => [...prev, customerId]);
    } else {
      setSelectedCustomerIds(prev => prev.filter(id => id !== customerId));
    }
  };

  const handleForAllToggle = (checked: boolean) => {
    setIsForAll(checked);
    if (checked) {
      setSelectedCustomerIds([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Adicionar Pedido</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Produtos do Menu */}
          <div>
            <Label className="text-foreground">Produtos do Menu</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {products.map((product) => (
                <Card 
                  key={product.name} 
                  className={`cursor-pointer transition-colors ${
                    selectedProduct === product.name ? 'bg-primary/10 border-primary' : 'bg-card border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleProductSelect(product.name)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                      <span className="text-beer font-semibold">R$ {product.price.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Produto Personalizado */}
          <div className="space-y-4">
            <Label className="text-foreground">Ou adicione um produto personalizado:</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customProduct" className="text-foreground">Produto Personalizado</Label>
                <Input
                  id="customProduct"
                  value={customProduct}
                  onChange={(e) => {
                    setCustomProduct(e.target.value);
                    if (e.target.value) {
                      setSelectedProduct('');
                    }
                  }}
                  placeholder="Nome do produto"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="customPrice" className="text-foreground">Preço Unitário (R$)</Label>
                <Input
                  id="customPrice"
                  type="number"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="0,00"
                  min="0"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Quantidade */}
          <div>
            <Label htmlFor="quantity" className="text-foreground">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="1"
              className="bg-input border-border text-foreground w-24"
              required
            />
          </div>

          {/* Seleção de Clientes */}
          <div>
            <Label className="text-foreground">Para quem é o pedido? *</Label>
            <div className="space-y-3 mt-2">
              {/* Opção "Todos" */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="forAll"
                  checked={isForAll}
                  onCheckedChange={handleForAllToggle}
                />
                <Label htmlFor="forAll" className="text-foreground font-medium">
                  Todos os clientes da mesa
                </Label>
              </div>
              
              {/* Clientes individuais */}
              {!isForAll && (
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Ou selecione clientes específicos:</Label>
                  {customers.map((customer) => (
                    <div key={customer.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={customer.id}
                        checked={selectedCustomerIds.includes(customer.id)}
                        onCheckedChange={(checked) => handleCustomerToggle(customer.id, !!checked)}
                      />
                      <Label htmlFor={customer.id} className="text-foreground">
                        {customer.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Adicionar Pedido
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};