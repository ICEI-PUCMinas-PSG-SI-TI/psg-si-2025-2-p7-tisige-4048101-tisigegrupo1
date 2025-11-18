import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, Customer, OrderItem } from '@/types';

export interface DbTable {
  id: string;
  number: number;
  is_open: boolean;
  opened_at: string;
  closed_at: string | null;
}

export interface DbCustomer {
  id: string;
  table_id: string;
  name: string;
  phone: string;
}

export interface DbOrder {
  id: string;
  table_id: string;
  product: string;
  quantity: number;
  unit_price: number;
  status: string;
  is_for_all: boolean;
  customer_ids: string[];
}

// Fetch all tables with their customers and orders
export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .order('opened_at', { ascending: false });

      if (tablesError) throw tablesError;

      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');

      if (customersError) throw customersError;

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      const tables: Table[] = (tablesData || []).map((table: DbTable) => ({
        id: table.id,
        number: table.number,
        isOpen: table.is_open,
        openedAt: new Date(table.opened_at),
        closedAt: table.closed_at ? new Date(table.closed_at) : undefined,
        customers: (customersData || [])
          .filter((c: DbCustomer) => c.table_id === table.id)
          .map((c: DbCustomer) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
          })),
        orders: (ordersData || [])
          .filter((o: DbOrder) => o.table_id === table.id)
          .map((o: DbOrder) => ({
            id: o.id,
            product: o.product,
            quantity: o.quantity,
            unitPrice: o.unit_price,
            status: o.status as 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled',
            isForAll: o.is_for_all,
            customerIds: o.customer_ids || [],
          })),
      }));

      return tables;
    },
  });
};

// Create a new table
export const useCreateTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (number: number) => {
      const { data, error } = await supabase
        .from('tables')
        .insert({ number })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

// Add customer to table
export const useAddCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tableId, customer }: { tableId: string; customer: Omit<Customer, 'id'> }) => {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          table_id: tableId,
          name: customer.name,
          phone: customer.phone,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

// Add order to table
export const useAddOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tableId, order }: { tableId: string; order: Omit<OrderItem, 'id' | 'status'> }) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          table_id: tableId,
          product: order.product,
          quantity: order.quantity,
          unit_price: order.unitPrice,
          is_for_all: order.isForAll,
          customer_ids: order.customerIds,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};

// Close table
export const useCloseTable = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableId: string) => {
      const { data, error } = await supabase
        .from('tables')
        .update({
          is_open: false,
          closed_at: new Date().toISOString(),
        })
        .eq('id', tableId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
};
