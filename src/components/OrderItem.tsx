import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { OrderItem as OrderItemType } from '@/types';
import { useTablesContext } from '@/contexts/TablesContext';

interface OrderItemProps {
  order: OrderItemType;
  tableId: string;
}

export const OrderItem: React.FC<OrderItemProps> = ({ order, tableId }) => {
  const { toggleOrderServed, getTableById } = useTablesContext();
  const table = getTableById(tableId);
  
  const getCustomerNames = () => {
    if (order.isForAll) return 'Todos os clientes';
    if (!table) return 'Mesa não encontrada';
    
    const customers = table.customers.filter(c => order.customerIds.includes(c.id));
    return customers.map(c => c.name).join(', ') || 'Clientes não encontrados';
  };
  
  const total = order.quantity * order.unitPrice;

  return (
    <Card className={`bg-card border-border transition-colors ${order.served ? 'bg-success/10 border-success/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">{order.product}</h4>
              <Badge 
                variant={order.served ? "default" : "secondary"} 
                className={order.served ? "bg-success text-success-foreground" : ""}
              >
                {order.served ? 'Servido' : 'Pendente'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Cliente(s): {getCustomerNames()}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.quantity}x R$ {order.unitPrice.toFixed(2)} = R$ {total.toFixed(2)}
            </p>
          </div>
          <Button
            size="sm"
            variant={order.served ? "secondary" : "default"}
            onClick={() => toggleOrderServed(tableId, order.id)}
            className={order.served ? 
              "bg-secondary hover:bg-secondary/80 text-secondary-foreground" : 
              "bg-success hover:bg-success/90 text-success-foreground"
            }
          >
            {order.served ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};