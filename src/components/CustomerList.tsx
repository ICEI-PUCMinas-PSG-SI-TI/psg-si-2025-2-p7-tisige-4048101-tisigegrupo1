import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone } from 'lucide-react';
import { Customer } from '@/types';

interface CustomerListProps {
  customers: Customer[];
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  if (customers.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-4">
        Nenhum cliente adicionado ainda
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <Card key={customer.id} className="bg-muted/30 border-border">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{customer.name}</h4>
                {customer.phone && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};