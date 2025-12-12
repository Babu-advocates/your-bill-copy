import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill, CompanyInfo } from '@/types/bill';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BillContextType {
  bills: Bill[];
  companyInfo: CompanyInfo;
  addBill: (bill: Omit<Bill, 'id' | 'createdAt'>) => Promise<void>;
  deleteBill: (id: string) => Promise<void>;
  updateCompanyInfo: (info: CompanyInfo) => void;
  getNextInvoiceNumber: () => number;
  loading: boolean;
}

const defaultCompanyInfo: CompanyInfo = {
  name: 'TECHVERSE INFOTECH',
  phone: '+91 8248329035',
  email: 'techverse.infotech.pvt.ltd@gmail.com',
  address: '',
};

const BillContext = createContext<BillContextType | undefined>(undefined);

export function BillProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem('techverse-company-info');
    return saved ? JSON.parse(saved) : defaultCompanyInfo;
  });

  // Fetch bills from Supabase on mount
  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedBills: Bill[] = (data || []).map((row) => ({
        id: row.id,
        invoiceNumber: row.invoice_number,
        customerName: row.customer_name,
        customerAddress: row.customer_address || undefined,
        date: row.date,
        items: row.items as unknown as Bill['items'],
        total: Number(row.total),
        createdAt: row.created_at,
      }));

      setBills(mappedBills);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('techverse-company-info', JSON.stringify(companyInfo));
  }, [companyInfo]);

  const getNextInvoiceNumber = () => {
    if (bills.length === 0) return 1;
    return Math.max(...bills.map(b => b.invoiceNumber)) + 1;
  };

  const addBill = async (bill: Omit<Bill, 'id' | 'createdAt'>) => {
    try {
      const insertData = {
        invoice_number: bill.invoiceNumber,
        customer_name: bill.customerName,
        customer_address: bill.customerAddress || null,
        date: bill.date,
        items: bill.items,
        total: bill.total,
      };
      
      const { data, error } = await (supabase
        .from('bills') as unknown as { insert: (d: typeof insertData) => { select: () => { single: () => Promise<{ data: Record<string, unknown>; error: Error | null }> } } })
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      const newBill: Bill = {
        id: data.id as string,
        invoiceNumber: data.invoice_number as number,
        customerName: data.customer_name as string,
        customerAddress: (data.customer_address as string) || undefined,
        date: data.date as string,
        items: data.items as unknown as Bill['items'],
        total: Number(data.total),
        createdAt: data.created_at as string,
      };

      setBills(prev => [newBill, ...prev]);
      toast.success(`Invoice #${bill.invoiceNumber} saved successfully`);
    } catch (error) {
      console.error('Error saving bill:', error);
      toast.error('Failed to save invoice');
      throw error;
    }
  };

  const deleteBill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBills(prev => prev.filter(b => b.id !== id));
      toast.success('Invoice deleted');
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Failed to delete invoice');
      throw error;
    }
  };

  const updateCompanyInfo = (info: CompanyInfo) => {
    setCompanyInfo(info);
  };

  return (
    <BillContext.Provider value={{ bills, companyInfo, addBill, deleteBill, updateCompanyInfo, getNextInvoiceNumber, loading }}>
      {children}
    </BillContext.Provider>
  );
}

export function useBills() {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error('useBills must be used within a BillProvider');
  }
  return context;
}
