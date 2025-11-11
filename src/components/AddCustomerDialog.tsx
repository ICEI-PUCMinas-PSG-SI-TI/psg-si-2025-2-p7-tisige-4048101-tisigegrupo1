import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, UserPlus } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
import { Card, CardContent } from '@/components/ui/card';

interface AddCustomerDialogProps {
  tableId: string;
}

export const AddCustomerDialog: React.FC<AddCustomerDialogProps> = ({ tableId }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { addCustomerToTable, registeredCustomers } = useTablesContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addCustomerToTable(tableId, { name: name.trim(), phone: phone.trim() });
      setName('');
      setPhone('');
      setOpen(false);
    }
  };

  const handleSelectRegisteredCustomer = (customer: typeof registeredCustomers[0]) => {
    addCustomerToTable(tableId, { name: customer.name, phone: customer.phone });
    setOpen(false);
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
          <DialogTitle className="text-foreground">Adicionar Cliente</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Clientes Cadastrados */}
          {registeredCustomers.length > 0 && (
            <div>
              <Label className="text-foreground font-semibold">Selecionar Cliente Cadastrado</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-[200px] overflow-y-auto">
                {registeredCustomers.map((customer) => (
                  <Card 
                    key={customer.id} 
                    className="cursor-pointer transition-colors bg-card border-border hover:bg-primary/10 hover:border-primary"
                    onClick={() => handleSelectRegisteredCustomer(customer)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium text-foreground">{customer.name}</span>
                          {customer.phone && (
                            <p className="text-xs text-muted-foreground">{customer.phone}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Separador */}
          {registeredCustomers.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Ou</span>
              </div>
            </div>
          )}

          {/* Formulário para Novo Cliente */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label className="text-foreground font-semibold">Adicionar Novo Cliente</Label>
            <div>
              <Label htmlFor="customerName" className="text-foreground">Nome *</Label>
              <Input
                id="customerName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do cliente"
                className="bg-input border-border text-foreground"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" className="text-foreground">Telefone</Label>
              <Input
                id="customerPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Adicionar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};