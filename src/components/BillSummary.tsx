import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Receipt, Users, Calculator } from 'lucide-react';
import { Table } from '@/types';
import { useTablesContext } from '@/contexts/TablesContext';

interface BillSummaryProps {
  table: Table;
  onBack: () => void;
  onClose: () => void;
}

export const BillSummary: React.FC<BillSummaryProps> = ({ table, onBack, onClose }) => {
  const { closeTable, getTableTotal } = useTablesContext();
  const total = getTableTotal(table.id);
  const customerCount = table.customers.length;
  const totalPerPerson = customerCount > 0 ? total / customerCount : 0;

  const handleCloseTable = () => {
    closeTable(table.id);
    onClose();
  };

  const ordersByCustomer = table.customers.map(customer => {
    const customerOrders = table.orders.filter(order => 
      order.isForAll || order.customerIds.includes(customer.id)
    );
    const customerTotal = customerOrders.reduce((sum, order) => {
      // If order is for all, divide the cost by number of customers
      const orderCost = order.quantity * order.unitPrice;
      return sum + (order.isForAll ? orderCost / table.customers.length : orderCost);
    }, 0);
    return {
      customer,
      orders: customerOrders,
      total: customerTotal,
    };
  });

  // Orders for all customers
  const allCustomerOrders = table.orders.filter(order => order.isForAll);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onBack}
            className="bg-secondary hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-beer flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              Conta - Mesa {table.number}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bill Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Resumo da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Orders for all customers */}
            {allCustomerOrders.length > 0 && (
              <div>
                <h4 className="font-semibold text-primary mb-2">Pedidos para toda a mesa</h4>
                <div className="space-y-1 ml-4">
                  {allCustomerOrders.map(order => (
                    <div key={order.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.quantity}x {order.product}
                      </span>
                      <span className="text-foreground">
                        R$ {(order.quantity * order.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {ordersByCustomer.map(({ customer, orders, total: customerTotal }) => (
              <div key={customer.id}>
                <h4 className="font-semibold text-primary mb-2">{customer.name}</h4>
                <div className="space-y-1 ml-4">
                  {orders.filter(order => !order.isForAll).map(order => (
                    <div key={order.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.quantity}x {order.product}
                      </span>
                      <span className="text-foreground">
                        R$ {(order.quantity * order.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {orders.filter(order => order.isForAll).map(order => (
                    <div key={order.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {order.quantity}x {order.product} (compartilhado)
                      </span>
                      <span className="text-foreground">
                        R$ {((order.quantity * order.unitPrice) / table.customers.length).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {orders.length > 0 && (
                    <div className="flex justify-between text-sm font-medium border-t border-border pt-1 mt-1">
                      <span className="text-foreground">Subtotal:</span>
                      <span className="text-primary">R$ {customerTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Separator className="bg-border" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-foreground">Total Geral:</span>
                <span className="text-beer">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Split Bill Options */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Divisão da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {customerCount} pessoa(s) na mesa
                </span>
              </div>
              <div className="text-lg font-semibold text-foreground">
                R$ {totalPerPerson.toFixed(2)} por pessoa
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Consumo Individual:</h4>
              {ordersByCustomer.map(({ customer, total: customerTotal }) => (
                <div key={customer.id} className="flex justify-between p-2 bg-muted/20 rounded">
                  <span className="text-foreground">{customer.name}</span>
                  <span className="font-medium text-primary">R$ {customerTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button 
          variant="secondary" 
          onClick={onBack}
          className="bg-secondary hover:bg-secondary/80"
        >
          Voltar para Mesa
        </Button>
        <Button 
          onClick={handleCloseTable}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          Fechar Mesa
        </Button>
      </div>
    </div>
  );
};