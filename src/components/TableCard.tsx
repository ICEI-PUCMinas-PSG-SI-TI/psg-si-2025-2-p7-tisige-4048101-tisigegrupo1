import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, ShoppingCart, DollarSign } from 'lucide-react';
import { Table } from '@/types';
import { useTablesContext } from '@/contexts/TablesContext';

interface TableCardProps {
  table: Table;
  onSelect: (tableId: string) => void;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onSelect }) => {
  const { getTableTotal } = useTablesContext();
  const total = getTableTotal(table.id);

  return (
    <Card className="bg-card hover:bg-card/80 transition-colors cursor-pointer border-border" onClick={() => onSelect(table.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-beer">
            Mesa {table.number}
          </CardTitle>
          <Badge variant={table.isOpen ? "default" : "secondary"} className="bg-primary text-primary-foreground">
            {table.isOpen ? "Aberta" : "Fechada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{table.customers.length} cliente(s)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>{table.orders.length} pedido(s)</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>R$ {total.toFixed(2)}</span>
          </div>
        </div>
        {table.isOpen && (
          <Button
            size="sm"
            variant="default"
            className="w-full mt-4"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(table.id);
            }}
          >
            Gerenciar Mesa
          </Button>
        )}
      </CardContent>
    </Card>
  );
};