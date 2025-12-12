export interface BillItem {
  id: string;
  description: string;
  price: number;
}

export interface Bill {
  id: string;
  invoiceNumber: number;
  date: string;
  customerName: string;
  customerAddress?: string;
  items: BillItem[];
  total: number;
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  email: string;
  address?: string;
}
