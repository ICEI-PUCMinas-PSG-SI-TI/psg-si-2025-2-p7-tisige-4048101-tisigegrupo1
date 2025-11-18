import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';

export const CreateTableDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const { createTable } = useTablesContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const number = parseInt(tableNumber);
    if (number > 0) {
      createTable(number);
      setTableNumber('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-warm h-10 sm:h-11 text-sm sm:text-base">
          <Plus className="mr-1 sm:mr-2 h-4 w-4" />
          Nova Mesa
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border w-[calc(100vw-2rem)] sm:w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg text-foreground">Abrir Nova Mesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tableNumber" className="text-sm sm:text-base text-foreground">Número da Mesa</Label>
            <Input
              id="tableNumber"
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Digite o número da mesa"
              className="bg-input border-border text-foreground h-10 sm:h-11"
              required
              min="1"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1 h-10">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10">
              Criar Mesa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};