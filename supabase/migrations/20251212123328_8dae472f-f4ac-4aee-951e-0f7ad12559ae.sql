-- Create bills table to store invoice data
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number INTEGER NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_address TEXT,
  date TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (but allow all access for single-user app)
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- Allow public access (single user app, no auth)
CREATE POLICY "Allow all access to bills" ON public.bills
  FOR ALL USING (true) WITH CHECK (true);

-- Create storage bucket for bill files
INSERT INTO storage.buckets (id, name, public)
VALUES ('bills', 'bills', true);

-- Storage policies for bill files
CREATE POLICY "Allow public read access to bills bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'bills');

CREATE POLICY "Allow public insert access to bills bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bills');

CREATE POLICY "Allow public update access to bills bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'bills');

CREATE POLICY "Allow public delete access to bills bucket"
ON storage.objects FOR DELETE
USING (bucket_id = 'bills');