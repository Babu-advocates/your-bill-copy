import React, { useState } from 'react';
import { useBills } from '@/context/BillContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsFormProps {
  onBack: () => void;
}

export function SettingsForm({ onBack }: SettingsFormProps) {
  const { companyInfo, updateCompanyInfo } = useBills();
  const { toast } = useToast();
  
  const [name, setName] = useState(companyInfo.name);
  const [phone, setPhone] = useState(companyInfo.phone);
  const [email, setEmail] = useState(companyInfo.email);
  const [address, setAddress] = useState(companyInfo.address || '');

  const handleSave = () => {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updateCompanyInfo({ name, phone, email, address });
    toast({
      title: "Success",
      description: "Company information updated successfully",
    });
    onBack();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="font-display text-2xl font-bold text-primary">
          Company Settings
        </h2>
      </div>

      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="font-display">Company Information</CardTitle>
          <CardDescription>
            This information will appear on all your invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your business address"
            />
          </div>

          <Button onClick={handleSave} className="w-full btn-primary-gradient mt-6">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
