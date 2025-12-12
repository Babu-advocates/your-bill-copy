import React, { useState, useRef } from 'react';
import { useBills } from '@/context/BillContext';
import { Bill } from '@/types/bill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoicePreview } from './InvoicePreview';
import { format } from 'date-fns';
import { Eye, Trash2, Printer, X, Download } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function BillsList() {
  const { bills, deleteBill, companyInfo, loading } = useBills();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingBillId, setDownloadingBillId] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const hiddenInvoiceRef = useRef<HTMLDivElement>(null);
  const [billToDownload, setBillToDownload] = useState<Bill | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: selectedBill ? `Invoice-${selectedBill.invoiceNumber}` : 'Invoice',
  });

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !selectedBill) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Invoice-${selectedBill.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleDirectDownload = async (bill: Bill) => {
    setDownloadingBillId(bill.id);
    setBillToDownload(bill);
    
    // Wait for the hidden invoice to render
    setTimeout(async () => {
      if (!hiddenInvoiceRef.current) {
        setDownloadingBillId(null);
        setBillToDownload(null);
        return;
      }
      
      try {
        const canvas = await html2canvas(hiddenInvoiceRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
        pdf.save(`Invoice-${bill.invoiceNumber}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setDownloadingBillId(null);
        setBillToDownload(null);
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading invoices...</p>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-light flex items-center justify-center">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="font-display text-xl font-semibold text-muted-foreground">
          No invoices yet
        </h3>
        <p className="text-muted-foreground mt-2">
          Create your first invoice to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {bills.map((bill, index) => (
          <Card 
            key={bill.id} 
            className="card-hover animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-invoice-accent flex items-center justify-center text-primary-foreground font-bold">
                    #{bill.invoiceNumber}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{bill.customerName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(bill.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-xl font-bold text-primary">
                      ₹{bill.total.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedBill(bill)}
                      className="text-primary hover:bg-primary/10"
                      title="View Invoice"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDirectDownload(bill)}
                      disabled={downloadingBillId === bill.id}
                      className="text-primary hover:bg-primary/10"
                      title="Download PDF"
                    >
                      {downloadingBillId === bill.id ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(bill.id)}
                      className="text-destructive hover:bg-destructive/10"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hidden Invoice for Direct Download */}
      {billToDownload && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: '210mm', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
          <InvoicePreview ref={hiddenInvoiceRef} bill={billToDownload} companyInfo={companyInfo} />
        </div>
      )}

      {/* Invoice Preview Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-2 md:p-4 overflow-auto">
          <div className="bg-background rounded-lg w-full max-w-[240mm] max-h-[95vh] overflow-auto">
            <div className="sticky top-0 bg-background border-b p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
              <h3 className="font-display font-bold text-base md:text-lg">Invoice #{selectedBill.invoiceNumber}</h3>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  onClick={handleDownloadPDF} 
                  variant="outline"
                  disabled={downloading}
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  {downloading ? 'Downloading...' : 'PDF'}
                </Button>
                <Button onClick={() => handlePrint()} className="btn-primary-gradient" size="sm">
                  <Printer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="text-xs md:text-sm">Print</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSelectedBill(null)} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-2 md:p-4 overflow-x-auto">
              <div className="min-w-[210mm] transform origin-top-left scale-[0.45] sm:scale-[0.6] md:scale-[0.8] lg:scale-100" style={{ width: 'fit-content' }}>
                <InvoicePreview ref={invoiceRef} bill={selectedBill} companyInfo={companyInfo} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this invoice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) {
                  setDeleting(true);
                  try {
                    await deleteBill(deleteId);
                  } finally {
                    setDeleting(false);
                    setDeleteId(null);
                  }
                }
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
