-- Create tables for the CRM system

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(phone)
);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  segment TEXT NOT NULL CHECK (segment IN ('Agri', 'Corporate', 'Others')),
  customer_id UUID REFERENCES customers(id),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  requirement_details TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Lead', 'Enquiry', 'Quote', 'Won', 'Loss')),
  remarks TEXT,
  reminder_date DATE,
  assigned_to TEXT NOT NULL CHECK (assigned_to IN ('Amit', 'Prateek')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_enquiries_customer_id ON enquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_date ON enquiries(date);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_assigned_to ON enquiries(assigned_to);

-- Enable Row Level Security but with public access for development
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (development only)
CREATE POLICY "Allow public access to customers" 
  ON customers FOR ALL 
  USING (true);

CREATE POLICY "Allow public access to enquiries" 
  ON enquiries FOR ALL 
  USING (true);
