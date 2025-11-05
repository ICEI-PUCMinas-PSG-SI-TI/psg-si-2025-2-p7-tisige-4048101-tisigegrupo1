<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/10 p-4 text-center">
      <div className="mx-auto mb-6">
        <img src={logo} alt="Boteco do Morcego" className="h-48 w-48 object-contain" />
      </div>
      <h1 className="mb-4 text-4xl font-bold text-primary md:text-5xl">Boteco do Morcego</h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">Controle de Pedidos</p>
      <Button size="lg" onClick={() => navigate("/auth")}>
        Acessar Sistema
      </Button>
=======
import { useState } from 'react';
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
>>>>>>> 8f92bec9b88629fe024341da12ebad2101bbdd29
    </div>
  );
};

export default Index;
