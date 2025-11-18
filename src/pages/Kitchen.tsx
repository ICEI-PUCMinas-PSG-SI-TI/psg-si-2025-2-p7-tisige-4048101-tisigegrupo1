import React from 'react';
import { useTablesContext } from '@/contexts/TablesContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { OrderStatus } from '@/types';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-orange-500/10 text-orange-500 border-orange-500', priority: 1, next: 'preparing' as OrderStatus },
  preparing: { label: 'Em Preparo', color: 'bg-blue-500/10 text-blue-500 border-blue-500', priority: 2, next: 'ready' as OrderStatus },
  ready: { label: 'Pronto', color: 'bg-purple-500/10 text-purple-500 border-purple-500', priority: 3, next: 'completed' as OrderStatus },
  completed: { label: 'Concluído', color: 'bg-success/10 text-success border-success', priority: 4, next: null },
  cancelled: { label: 'Cancelado', color: 'bg-destructive/10 text-destructive border-destructive', priority: 5, next: null },
};

export default function Kitchen() {
  const { tables, updateOrderStatus } = useTablesContext();

  // Get all orders from all open tables, excluding cancelled
  const allOrders = tables
    .filter(table => table.isOpen)
    .flatMap(table => 
      table.orders
        .filter(order => order.status !== 'cancelled')
        .map(order => ({
          ...order,
          tableNumber: table.number,
          tableId: table.id,
        }))
    )
    .sort((a, b) => {
      // Sort by status priority
      const priorityDiff = statusConfig[a.status].priority - statusConfig[b.status].priority;
      if (priorityDiff !== 0) return priorityDiff;
      // Then by order ID
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-3 sm:p-4 md:p-6 max-w-4xl">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-primary/20 p-2 sm:p-3 rounded-full">
            <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Cozinha</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Pedidos em andamento</p>
          </div>
        </div>

        {allOrders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-6 sm:p-8 text-center">
              <ChefHat className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">Nenhum pedido no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {allOrders.map((order) => {
              const config = statusConfig[order.status];
              const canAdvance = config.next;
              
              return (
                <Card 
                  key={order.id} 
                  className={`bg-card border-border transition-opacity ${
                    order.status === 'completed' ? 'opacity-50' : ''
                  }`}
                >
                  <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary text-xs sm:text-sm">
                          Mesa {order.tableNumber}
                        </Badge>
                        <Badge variant="outline" className={`text-xs sm:text-sm ${config.color}`}>
                          {config.label}
                        </Badge>
                      </div>
                      {canAdvance && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateOrderStatus(order.id, config.next!)}
                          className="w-full sm:w-auto h-9 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <ArrowRight className="h-4 w-4 mr-1" />
                          {statusConfig[config.next!].label}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Produto</p>
                        <p className="text-sm sm:text-base font-semibold text-foreground">{order.product}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Quantidade</p>
                          <p className="text-sm sm:text-base text-foreground">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-muted-foreground">Valor unitário</p>
                          <p className="text-sm sm:text-base text-foreground">R$ {order.unitPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}