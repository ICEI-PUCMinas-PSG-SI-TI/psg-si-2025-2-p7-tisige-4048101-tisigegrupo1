import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, ShoppingCart, Plus, Receipt } from 'lucide-react';
import { useTablesContext } from '@/contexts/TablesContext';
import { AddCustomerDialog } from '@/components/AddCustomerDialog';
import { AddOrderDialog } from '@/components/AddOrderDialog';
import { OrderItem } from '@/components/OrderItem';
import { CustomerList } from '@/components/CustomerList';
import { BillSummary } from '@/components/BillSummary';

interface TableManagementProps {
  tableId: string;
  onBack: () => void;
}

export const TableManagement: React.FC<TableManagementProps> = ({ tableId, onBack }) => {
  const { getTableById } = useTablesContext();
  const [showBill, setShowBill] = useState(false);
  const table = getTableById(tableId);

  if (!table) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Mesa não encontrada</p>
        <Button onClick={onBack} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  if (showBill) {
    return (
      <BillSummary 
        table={table} 
        onBack={() => setShowBill(false)}
        onClose={onBack}
      />
    );
  }

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
            <h1 className="text-2xl font-bold text-beer">Mesa {table.number}</h1>
            <Badge variant={table.isOpen ? "default" : "secondary"} className="bg-primary text-primary-foreground">
              {table.isOpen ? "Aberta" : "Fechada"}
            </Badge>
          </div>
        </div>
        {table.isOpen && (
          <Button 
            onClick={() => setShowBill(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Receipt className="mr-2 h-4 w-4" />
            Fechar Conta
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customers Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5" />
                Clientes ({table.customers.length})
              </CardTitle>
              {table.isOpen && <AddCustomerDialog tableId={tableId} />}
            </div>
          </CardHeader>
          <CardContent>
            <CustomerList customers={table.customers} />
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="h-5 w-5" />
                Pedidos ({table.orders.length})
              </CardTitle>
              {table.isOpen && table.customers.length > 0 && (
                <AddOrderDialog tableId={tableId} customers={table.customers} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {table.orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Nenhum pedido ainda
              </p>
            ) : (
              <div className="space-y-3">
                {table.orders.map((order) => (
                  <OrderItem key={order.id} order={order} tableId={tableId} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};