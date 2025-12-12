import React, { useState, useRef } from 'react';
import { useBills } from '@/context/BillContext';
import { BillItem } from '@/types/bill';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoicePreview } from './InvoicePreview';
import { Plus, Trash2, Eye, Printer, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useReactToPrint } from 'react-to-print';

interface CreateBillFormProps {
  onBack: () => void;
}

export function CreateBillForm({ onBack }: CreateBillFormProps) {
  const { addBill, companyInfo, getNextInvoiceNumber } = useBills();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<BillItem[]>([
    { id: crypto.randomUUID(), description: '', price: 0 }
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const invoiceNumber = getNextInvoiceNumber();
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${invoiceNumber}`,
  });

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: '', price: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: 'description' | 'price', value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: field === 'price' ? Number(value) : value } : item
    ));
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!customerName.trim()) {
      toast({
        title: "Error",
        description: "Please enter customer name",
        variant: "destructive",
      });
      return;
    }

    if (items.some(item => !item.description.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all item descriptions",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await addBill({
        invoiceNumber,
        date,
        customerName,
        customerAddress,
        items,
        total,
      });
      onBack();
    } catch (error) {
      // Error toast is shown in context
    } finally {
      setSaving(false);
    }
  };

  const currentBill = {
    id: 'preview',
    invoiceNumber,
    date,
    customerName: customerName || 'Customer Name',
    customerAddress,
    items,
    total,
    createdAt: new Date().toISOString(),
  };

  if (showPreview) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex gap-4 no-print">
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </Button>
          <Button onClick={() => handlePrint()} className="btn-primary-gradient">
            <Printer className="w-4 h-4 mr-2" />
            Print Invoice
          </Button>
          <Button onClick={handleSave} variant="secondary" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Invoice'}
          </Button>
        </div>
        <InvoicePreview ref={invoiceRef} bill={currentBill} companyInfo={companyInfo} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="font-display text-2xl font-bold text-primary">
          Create New Invoice
        </h2>
        <span className="text-muted-foreground">#{invoiceNumber}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="font-display">Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Customer Address (Optional)</Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter customer address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display">Items</CardTitle>
            <Button size="sm" onClick={addItem} variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={item.id} className="flex gap-2 items-end animate-slide-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div className="w-32 space-y-1">
                  <Label className="text-xs">Price (₹)</Label>
                  <Input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <div className="pt-4 border-t flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => setShowPreview(true)}>
          <Eye className="w-4 h-4 mr-2" />
          Preview Invoice
        </Button>
        <Button onClick={handleSave} className="btn-primary-gradient" disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Invoice'}
        </Button>
      </div>
    </div>
  );
}
