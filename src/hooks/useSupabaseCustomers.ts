import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RegisteredCustomer {
  id: string;
  name: string;
  phone: string;
}

// Fetch all registered customers
export const useRegisteredCustomers = () => {
  return useQuery({
    queryKey: ['registered-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registered_customers')
        .select('*')
        .order('name');

      if (error) throw error;

      return (data || []).map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
      }));
    },
  });
};

// Add a new registered customer
export const useAddRegisteredCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Omit<RegisteredCustomer, 'id'>) => {
      const { data, error } = await supabase
        .from('registered_customers')
        .insert({
          name: customer.name,
          phone: customer.phone,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registered-customers'] });
    },
  });
};
