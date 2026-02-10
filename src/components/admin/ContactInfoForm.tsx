import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContact } from '@/hooks/useContact';
import { UpdateContactInfoData } from '@/types/contactTypes';
import { Loader2, Save } from 'lucide-react';

const ContactInfoForm: React.FC = () => {
  const { contactInfo, fetchContactInfo, updateContactInfo, createContactInfo, loading } = useContact();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateContactInfoData>({
    address: '',
    phone: '',
    email: '',
    office_hours: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        address: contactInfo.address || '',
        phone: contactInfo.phone || '',
        email: contactInfo.email || '',
        office_hours: contactInfo.office_hours || '',
      });
    }
  }, [contactInfo]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (contactInfo) {
        await updateContactInfo(formData);
      } else {
        await createContactInfo({
          address: formData.address!,
          phone: formData.phone!,
          email: formData.email!,
          office_hours: formData.office_hours,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !contactInfo) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Phone */}
            <div>
              <Label htmlFor="phone">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1234567890"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
                rows={2}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Office Hours */}
            <div className="md:col-span-2">
              <Label htmlFor="office_hours">Office Hours</Label>
              <Input
                id="office_hours"
                value={formData.office_hours}
                onChange={(e) => setFormData({ ...formData, office_hours: e.target.value })}
                placeholder="Mon-Fri: 9AM-5PM"
              />
            </div>

          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {contactInfo ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {contactInfo ? 'Update Contact Info' : 'Save Contact Info'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactInfoForm;
