export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  location: string;
  created_at: string;
};

export type Segment = 'Agri' | 'Corporate' | 'Others';
export type Status = 'Lead' | 'Enquiry' | 'Quote' | 'Won' | 'Loss';

export type Enquiry = {
  id: string;
  date: string;
  segment: Segment;
  customer_id: string | null;
  customer_name: string;
  phone: string;
  location: string;
  requirement_details: string;
  status: Status;
  remarks: string;
  reminder_date: string | null;
  assigned_to: string; // User ID (Amit or Prateek)
  created_at: string;
  updated_at: string;
};
