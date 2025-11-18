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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
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
            <h1 className="text-xl sm:text-2xl font-bold text-beer">Mesa {table.number}</h1>
            <Badge variant={table.isOpen ? "default" : "secondary"} className="bg-primary text-primary-foreground mt-1">
              {table.isOpen ? "Aberta" : "Fechada"}
            </Badge>
          </div>
        </div>
        {table.isOpen && (
          <Button 
            onClick={() => setShowBill(true)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto h-10 sm:h-11"
          >
            <Receipt className="mr-2 h-4 w-4" />
            Fechar Conta
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Customers Section */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Clientes ({table.customers.length})
              </CardTitle>
              {table.isOpen && <AddCustomerDialog tableId={tableId} />}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <CustomerList customers={table.customers} />
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-foreground">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                Pedidos ({table.orders.length})
              </CardTitle>
              {table.isOpen && table.customers.length > 0 && (
                <AddOrderDialog tableId={tableId} customers={table.customers} />
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {table.orders.length === 0 ? (
              <p className="text-sm sm:text-base text-muted-foreground text-center py-4">
                Nenhum pedido ainda
              </p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
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