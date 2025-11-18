import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Utensils } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';

export const RegisterProductDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const { addProduct } = useTablesContext();

  const handleSubmit = (e: React.FormEvent) => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="border-beer text-beer hover:bg-beer/10 h-9 sm:h-10 text-xs sm:text-sm">
          <Utensils className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Cadastrar</span> Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border w-[calc(100vw-2rem)] sm:w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg text-foreground flex items-center gap-2">
            <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-beer" />
            Cadastrar Novo Produto
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="productName" className="text-sm sm:text-base text-foreground">Nome do Produto *</Label>
            <Input
              id="productName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Porção de Frango"
              className="bg-input border-border text-foreground h-10 sm:h-11"
              required
            />
          </div>
          <div>
            <Label htmlFor="productPrice" className="text-sm sm:text-base text-foreground">Preço (R$) *</Label>
            <Input
              id="productPrice"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0,00"
              min="0"
              className="bg-input border-border text-foreground h-10 sm:h-11"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1 h-10">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10">
              Cadastrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
