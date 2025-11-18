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
      order.status !== 'cancelled' && (order.isForAll || order.customerIds.includes(customer.id))
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

  // Orders for all customers (excluding cancelled)
  const allCustomerOrders = table.orders.filter(order => order.isForAll && order.status !== 'cancelled');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onBack}
            className="bg-secondary hover:bg-secondary/80 h-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-beer flex items-center gap-2">
              <Receipt className="h-5 w-5 sm:h-6 sm:w-6" />
              Conta - Mesa {table.number}
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bill Details */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-foreground">Resumo da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            {/* Orders for all customers */}
            {allCustomerOrders.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-primary mb-2">Pedidos para toda a mesa</h4>
                <div className="space-y-1 ml-2 sm:ml-4">
                  {allCustomerOrders.map(order => (
                    <div key={order.id} className="flex justify-between text-xs sm:text-sm">
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
                <h4 className="font-semibold text-sm sm:text-base text-primary mb-2">{customer.name}</h4>
                <div className="space-y-1 ml-2 sm:ml-4">
                  {orders.filter(order => !order.isForAll).map(order => (
                    <div key={order.id} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">
                        {order.quantity}x {order.product}
                      </span>
                      <span className="text-foreground">
                        R$ {(order.quantity * order.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {orders.filter(order => order.isForAll).map(order => (
                    <div key={order.id} className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">
                        {order.quantity}x {order.product} (compartilhado)
                      </span>
                      <span className="text-foreground">
                        R$ {((order.quantity * order.unitPrice) / table.customers.length).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {orders.length > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm font-medium border-t border-border pt-1 mt-1">
                      <span className="text-foreground">Subtotal:</span>
                      <span className="text-primary">R$ {customerTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <Separator className="bg-border" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-base sm:text-lg font-bold">
                <span className="text-foreground">Total Geral:</span>
                <span className="text-beer">R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Split Bill Options */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg text-foreground flex items-center gap-2">
              <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
              Divisão da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
            <div className="bg-muted/30 p-3 sm:p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {customerCount} pessoa(s) na mesa
                </span>
              </div>
              <div className="text-base sm:text-lg font-semibold text-foreground">
                R$ {totalPerPerson.toFixed(2)} por pessoa
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h4 className="font-medium text-sm sm:text-base text-foreground">Consumo Individual:</h4>
              {ordersByCustomer.map(({ customer, total: customerTotal }) => (
                <div key={customer.id} className="flex justify-between p-2 bg-muted/20 rounded text-sm sm:text-base">
                  <span className="text-foreground">{customer.name}</span>
                  <span className="font-medium text-primary">R$ {customerTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <Button 
          variant="secondary" 
          onClick={onBack}
          className="bg-secondary hover:bg-secondary/80 w-full sm:w-auto h-10 sm:h-11"
        >
          Voltar para Mesa
        </Button>
        <Button 
          onClick={handleCloseTable}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto h-10 sm:h-11"
        >
          Fechar Mesa
        </Button>
      </div>
    </div>
  );
};