import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, X } from 'lucide-react';
import { OrderItem as OrderItemType, OrderStatus } from '@/types';
import { useTablesContext } from '@/contexts/TablesContext';

interface OrderItemProps {
  order: OrderItemType;
  tableId: string;
}

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-orange-500/10 text-orange-500 border-orange-500', next: 'preparing' as OrderStatus },
  preparing: { label: 'Em Preparo', color: 'bg-blue-500/10 text-blue-500 border-blue-500', next: 'ready' as OrderStatus },
  ready: { label: 'Pronto', color: 'bg-purple-500/10 text-purple-500 border-purple-500', next: 'completed' as OrderStatus },
  completed: { label: 'Concluído', color: 'bg-success/10 text-success border-success', next: null },
  cancelled: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive border-destructive', next: null },
};

export const OrderItem: React.FC<OrderItemProps> = ({ order, tableId }) => {
  const { updateOrderStatus, cancelOrder, getTableById } = useTablesContext();
  const table = getTableById(tableId);
  
  const getCustomerNames = () => {
    if (order.isForAll) return 'Todos os clientes';
    if (!table) return 'Mesa não encontrada';
    
    const customers = table.customers.filter(c => order.customerIds.includes(c.id));
    return customers.map(c => c.name).join(', ') || 'Clientes não encontrados';
  };
  
  const total = order.quantity * order.unitPrice;
  const config = statusConfig[order.status];
  const canAdvance = config.next && order.status !== 'cancelled';
  const canCancel = order.status !== 'completed' && order.status !== 'cancelled';

  return (
    <Card className={`bg-card border-border transition-colors ${order.status === 'completed' ? 'bg-success/10 border-success/30' : ''} ${order.status === 'cancelled' ? 'opacity-50' : ''}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-sm sm:text-base text-foreground">{order.product}</h4>
              <Badge variant="outline" className={`text-xs ${config.color}`}>
                {config.label}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Cliente(s): {getCustomerNames()}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {order.quantity}x R$ {order.unitPrice.toFixed(2)} = R$ {total.toFixed(2)}
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {canAdvance && (
              <Button
                size="sm"
                variant="default"
                onClick={() => updateOrderStatus(order.id, config.next!)}
                className="flex-1 h-9 bg-primary hover:bg-primary/90"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                {statusConfig[config.next!].label}
              </Button>
            )}
            {canCancel && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => cancelOrder(order.id)}
                className="h-9"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};