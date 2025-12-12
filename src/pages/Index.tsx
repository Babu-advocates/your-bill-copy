import React from 'react';
import { BillProvider } from '@/context/BillContext';
import { Dashboard } from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <BillProvider>
      <div className="min-h-screen bg-background">
        <div className="container max-w-5xl py-8 px-4">
          <Dashboard />
        </div>
        <Toaster />
      </div>
    </BillProvider>
  );
};

export default Index;
