-- Add status column to orders table
ALTER TABLE public.orders 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Migrate existing data: served=true -> 'completed', served=false -> 'pending'
UPDATE public.orders 
SET status = CASE 
  WHEN served = true THEN 'completed' 
  ELSE 'pending' 
END;

-- Drop the old served column
ALTER TABLE public.orders 
DROP COLUMN served;

-- Add check constraint for valid statuses
ALTER TABLE public.orders 
ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled'));