import React, { useState } from 'react';
import { useTablesContext } from '@/contexts/TablesContext';
import { TableCard } from '@/components/TableCard';
import { CreateTableDialog } from '@/components/CreateTableDialog';
import { TableManagement } from '@/components/TableManagement';
import { Header } from '@/components/Header';
import { Beer } from 'lucide-react';

const BotecoApp = () => {
  const { tables } = useTablesContext();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  
  const openTables = tables.filter(table => table.isOpen);

  if (selectedTableId) {
    return (
      <TableManagement 
        tableId={selectedTableId} 
        onBack={() => setSelectedTableId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-center pt-6">
        <CreateTableDialog />
      </div>

      {/* Tables Grid */}
      <div className="container mx-auto px-4">
        {openTables.length === 0 ? (
          <div className="text-center py-12">
            <Beer className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhuma mesa aberta
            </h2>
            <p className="text-muted-foreground">
              Crie uma nova mesa para começar o atendimento
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {openTables.map((table) => (
              <TableCard 
                key={table.id} 
                table={table} 
                onSelect={setSelectedTableId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-6">
        <BotecoApp />
      </div>
    </div>
  );
};

export default Index;
