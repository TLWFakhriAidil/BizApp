-- Create inventory/products table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL,
  product_id TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  price_per_unit NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_stock',
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock'))
);

-- Create prospects table
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prospect_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  platform TEXT NOT NULL,
  objective TEXT NOT NULL,
  niche TEXT NOT NULL,
  status_check TEXT NOT NULL,
  date DATE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create returns table
CREATE TABLE public.returns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  return_reason TEXT NOT NULL,
  return_status TEXT NOT NULL DEFAULT 'pending',
  return_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  refund_amount NUMERIC,
  notes TEXT,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_return_status CHECK (return_status IN ('pending', 'approved', 'rejected', 'completed'))
);

-- Enable Row Level Security
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory
CREATE POLICY "Users can view their own inventory"
ON public.inventory FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own inventory"
ON public.inventory FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inventory"
ON public.inventory FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inventory"
ON public.inventory FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for prospects
CREATE POLICY "Users can view their own prospects"
ON public.prospects FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prospects"
ON public.prospects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prospects"
ON public.prospects FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prospects"
ON public.prospects FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for returns
CREATE POLICY "Users can view their own returns"
ON public.returns FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own returns"
ON public.returns FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own returns"
ON public.returns FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own returns"
ON public.returns FOR DELETE
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON public.inventory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prospects_updated_at
BEFORE UPDATE ON public.prospects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_returns_updated_at
BEFORE UPDATE ON public.returns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_inventory_user_id ON public.inventory(user_id);
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_prospects_user_id ON public.prospects(user_id);
CREATE INDEX idx_returns_user_id ON public.returns(user_id);
CREATE INDEX idx_returns_order_id ON public.returns(order_id);