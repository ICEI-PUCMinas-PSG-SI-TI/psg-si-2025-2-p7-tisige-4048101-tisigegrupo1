import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  price: number;
}

// Fetch all products
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      return (data || []).map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
      }));
    },
  });
};

// Add a new product
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: product.price,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
