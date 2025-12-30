import React, { forwardRef } from 'react';
import { Bill, CompanyInfo } from '@/types/bill';
import { format } from 'date-fns';
import techverseLogo from '@/assets/techverse-logo.jpg';

interface InvoicePreviewProps {
  bill: Bill;
  companyInfo: CompanyInfo;
}

export const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ bill, companyInfo }, ref) => {
    return (
      <div 
        ref={ref} 
        className="bg-white relative overflow-hidden mx-auto flex flex-col"
        style={{ 
          width: '210mm',
          height: '297mm',
          padding: '15mm',
          boxSizing: 'border-box',
        }}
      >
        {/* Large Watermark Logo in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <img src={techverseLogo} alt="" className="w-72 md:w-96 h-72 md:h-96 object-contain opacity-10" />
        </div>

        {/* Header Section */}
        <div className="flex flex-row justify-between items-start pb-4 border-b-2 border-primary relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo */}
            <img src={techverseLogo} alt="Techverse Infotech" className="w-16 h-16 md:w-24 md:h-24 object-contain" />
            <h1 className="font-display font-bold text-xl md:text-3xl text-primary">
              Techverse Infotech
            </h1>
          </div>
          
          <div className="text-right">
            <h2 className="font-display font-bold text-2xl md:text-4xl text-primary italic">
              INVOICE
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">No:{bill.invoiceNumber}</p>
          </div>
        </div>

        {/* Contact & Invoice Info */}
        <div className="flex flex-row justify-between mt-8 relative z-10">
          <div>
            <h3 className="font-bold text-xs md:text-sm mb-2">CONTACT INFO:</h3>
            <p className="font-semibold text-sm md:text-base">{companyInfo.name}</p>
            <p className="text-xs md:text-base">PH:{companyInfo.phone}</p>
            <p className="text-xs md:text-base break-all">email:{companyInfo.email}</p>
            {companyInfo.address && <p className="text-xs md:text-base">{companyInfo.address}</p>}
          </div>
          
          <div className="text-right">
            <p className="mb-2 md:mb-4 text-sm md:text-base">Date: {format(new Date(bill.date), 'dd/MM/yyyy')}</p>
            <div>
              <p className="font-semibold text-sm md:text-base">INVOICE TO :</p>
              <p className="font-bold text-base md:text-lg">{bill.customerName}</p>
              {bill.customerAddress && <p className="text-xs md:text-sm text-muted-foreground">{bill.customerAddress}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mt-8 md:mt-12 relative z-10">
          {/* Table Header */}
          <div className="flex">
            <div 
              className="flex-1 py-2 md:py-2.5 px-3 md:px-6"
              style={{ 
                background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--invoice-accent)) 100%)',
                borderTopLeftRadius: '6px',
                borderBottomLeftRadius: '6px'
              }}
            >
              <span className="text-white font-semibold text-[10px] md:text-xs tracking-widest uppercase">DESCRIPTION</span>
            </div>
            <div 
              className="py-2 md:py-2.5 px-4 md:px-8 text-center"
              style={{ 
                background: 'linear-gradient(90deg, hsl(var(--invoice-accent)) 0%, hsl(var(--primary)) 100%)',
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
                minWidth: '80px'
              }}
            >
              <span className="text-white font-semibold text-[10px] md:text-xs tracking-widest uppercase">PRICE</span>
            </div>
          </div>

          {/* Table Body */}
          <div className="mt-1">
            {bill.items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center py-3 md:py-4"
                style={{ borderLeft: '4px solid #9370DB' }}
              >
                <div className="flex-1 px-3 md:px-6">
                  <span className="text-sm md:text-base font-medium text-gray-800 uppercase">{item.description}</span>
                </div>
                <div className="px-4 md:px-8 text-right" style={{ minWidth: '80px' }}>
                  <span className="text-sm md:text-base font-bold" style={{ color: 'hsl(var(--primary))' }}>
                    RS {item.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Badge */}
          <div className="flex justify-end mt-4">
            <div 
              className="py-2 px-4 md:px-5 flex items-center gap-2 md:gap-3"
              style={{ 
                background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--invoice-accent)) 100%)',
                borderRadius: '4px'
              }}
            >
              <span className="text-white font-bold text-xs md:text-sm">TOTAL:</span>
              <span className="text-white font-bold text-xs md:text-sm">RS {bill.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer - positioned at bottom */}
        <div className="mt-auto pt-8 z-10 relative">
          <p className="text-primary font-display text-lg md:text-xl italic">
            Thank you for purchase!
          </p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';
