
import { useTablesContext } from '@/contexts/TablesContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChefHat, Check, Clock } from 'lucide-react';
import { Header } from '@/components/Header';

export default function Kitchen() {
  const { tables, toggleOrderServed } = useTablesContext();

  // Get all orders from all open tables
  const allOrders = tables
    .filter(table => table.isOpen)
    .flatMap(table => 
      table.orders.map(order => ({
        ...order,
        tableNumber: table.number,
        tableId: table.id,
      }))
    )
    .sort((a, b) => {
      // Sort by served status (unserved first) and then by order time
      if (a.served === b.served) {
        return a.id.localeCompare(b.id);
      }
      return a.served ? 1 : -1;
    });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/20 p-3 rounded-full">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cozinha</h1>
            <p className="text-muted-foreground">Pedidos em andamento</p>
          </div>
        </div>

        {allOrders.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum pedido no momento</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {allOrders.map((order) => (
              <Card 
                key={order.id} 
                className={`bg-card border-border transition-opacity ${
                  order.served ? 'opacity-50' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                        Mesa {order.tableNumber}
                      </Badge>
                      {order.served ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          Servido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant={order.served ? "secondary" : "default"}
                      onClick={() => toggleOrderServed(order.tableId, order.id)}
                      className={!order.served ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                    >
                      {order.served ? 'Reabrir' : 'Marcar como servido'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{order.product}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: <span className="font-semibold text-foreground">{order.quantity}x</span>
                      </p>
                    </div>
                    {order.isForAll ? (
                      <Badge variant="secondary" className="bg-secondary/50">
                        Para todos da mesa
                      </Badge>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Para {order.customerIds.length} cliente(s)
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
