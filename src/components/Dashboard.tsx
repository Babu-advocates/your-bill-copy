import React, { useState } from 'react';
import { useBills } from '@/context/BillContext';
import { Logo } from './Logo';
import { BillsList } from './BillsList';
import { CreateBillForm } from './CreateBillForm';
import { CreateQuotationForm } from './CreateQuotationForm';
import { SettingsForm } from './SettingsForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Settings, FileText, IndianRupee, FileQuestion } from 'lucide-react';

type View = 'dashboard' | 'create' | 'settings' | 'quotation';

export function Dashboard() {
  const [view, setView] = useState<View>('dashboard');
  const { bills } = useBills();

  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total, 0);
  const totalInvoices = bills.length;

  if (view === 'create') {
    return <CreateBillForm onBack={() => setView('dashboard')} />;
  }

  if (view === 'quotation') {
    return <CreateQuotationForm onBack={() => setView('dashboard')} />;
  }

  if (view === 'settings') {
    return <SettingsForm onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Logo size="md" />
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => setView('settings')}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="secondary" onClick={() => setView('quotation')}>
            <FileQuestion className="w-4 h-4 mr-2" />
            New Quotation
          </Button>
          <Button onClick={() => setView('create')} className="btn-primary-gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="card-hover bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-3xl font-bold font-display text-primary">{totalInvoices}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-accent/50 to-accent/20 border-accent-foreground/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
              <IndianRupee className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold font-display text-accent-foreground">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Invoices */}
      <div>
        <h2 className="font-display text-xl font-semibold mb-4">Recent Invoices</h2>
        <BillsList />
      </div>
    </div>
  );
}
