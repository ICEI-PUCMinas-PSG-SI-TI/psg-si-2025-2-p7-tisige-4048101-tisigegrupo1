-- Create products table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create registered_customers table
CREATE TABLE public.registered_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tables table (mesas)
CREATE TABLE public.tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table (clientes de uma mesa específica)
CREATE TABLE public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  served BOOLEAN NOT NULL DEFAULT false,
  is_for_all BOOLEAN NOT NULL DEFAULT false,
  customer_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registered_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public access since no auth yet)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Anyone can view registered_customers" ON public.registered_customers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert registered_customers" ON public.registered_customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update registered_customers" ON public.registered_customers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete registered_customers" ON public.registered_customers FOR DELETE USING (true);

CREATE POLICY "Anyone can view tables" ON public.tables FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tables" ON public.tables FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tables" ON public.tables FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tables" ON public.tables FOR DELETE USING (true);

CREATE POLICY "Anyone can view customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Anyone can insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete customers" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Anyone can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete orders" ON public.orders FOR DELETE USING (true);

-- Insert default products
INSERT INTO public.products (name, price) VALUES
  ('Camafeu de Camarão', 15.90),
  ('Fritas c/ Catupiry', 12.90),
  ('Maçã de Peito e Batata', 18.90),
  ('Chopp', 8.90),
  ('Xeque Mate', 10.90);