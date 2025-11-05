<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Kitchen() {
  const { signOut, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [unitId, setUnitId] = useState<string | null>(null);

  // Get kitchen user's unit
  useEffect(() => {
    const getKitchenUnit = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("user_roles")
        .select("unit_id")
        .eq("user_id", user.id)
        .eq("role", "kitchen")
        .single();

      if (error) {
        console.error("Erro ao carregar unidade:", error);
        return;
      }

      setUnitId(data?.unit_id || null);
    };

    getKitchenUnit();
  }, [user]);

  const loadOrders = async () => {
    if (!unitId) return;

    // First, get all waiters from the same unit
    const { data: waiters, error: waitersError } = await supabase
      .from("profiles")
      .select("id")
      .eq("unit_id", unitId);

    if (waitersError) {
      console.error("Erro ao carregar garçons:", waitersError);
      return;
    }

    const waiterIds = waiters?.map((w) => w.id) || [];
    
    if (waiterIds.length === 0) {
      setOrders([]);
      return;
    }

    // Then get orders from those waiters
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        menu_items (name),
        tables (table_number),
        profiles!orders_waiter_id_fkey (full_name)
      `)
      .in("status", ["pending", "preparing"])
      .in("waiter_id", waiterIds)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao carregar pedidos:", error);
      return;
    }

    setOrders(data || []);
  };

  useEffect(() => {
    if (unitId) {
      loadOrders();

      // Realtime updates
      const channel = supabase
        .channel("orders-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
          },
          () => {
            loadOrders();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [unitId]);

  const handleCompleteOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({
        status: "delivered",
        completed_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      toast.error("Erro ao confirmar saída");
      return;
    }

    toast.success("Saída confirmada!");
    loadOrders();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(var(--kitchen-bg))" }}>
      <header className="border-b" style={{ backgroundColor: "hsl(var(--kitchen-card))" }}>
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold text-foreground">Cozinha - Pedidos</h1>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Fila de Pedidos ({orders.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Mais antigo no topo, mais recente embaixo
          </p>
        </div>

        <div className="space-y-4">
          {!unitId ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Você não está associado a nenhuma unidade
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhum pedido na fila
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card
                key={order.id}
                style={{ backgroundColor: "hsl(var(--kitchen-card))" }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold">
                        {order.menu_items?.name}
                      </h3>
                      <Badge variant="outline" className="text-base">
                        Qtd: {order.quantity}
                      </Badge>
                    </div>
                    
                    {order.observations && (
                      <div className="rounded-md bg-muted/50 p-3">
                        <p className="text-sm font-medium mb-1">Observações:</p>
                        <p className="text-sm">
                          {order.observations}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-4 text-sm text-muted-foreground pt-2">
                      <div>
                        <span className="font-medium">Mesa:</span> {order.tables?.table_number}
                      </div>
                      <div>
                        <span className="font-medium">Garçom:</span> {order.profiles?.full_name}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => handleCompleteOrder(order.id)}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Confirmar Saída
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
=======

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
>>>>>>> 8f92bec9b88629fe024341da12ebad2101bbdd29
