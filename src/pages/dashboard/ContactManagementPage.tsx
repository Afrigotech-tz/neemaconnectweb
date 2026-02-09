import React from 'react';
import ContactInfoForm from '@/components/admin/ContactInfoForm';

const ContactManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
        <p className="text-gray-600 mt-2">Manage contact information displayed on the website</p>
      </div>
      <ContactInfoForm />
    </div>
  );
};

export default ContactManagementPage;
