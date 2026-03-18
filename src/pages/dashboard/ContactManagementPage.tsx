import React from 'react';
import ContactInfoForm from '@/components/admin/ContactInfoForm';
import UserMessagesList from '@/components/admin/UserMessagesList';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

const ContactManagementPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-sky-900 via-cyan-800 to-teal-800 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Mail className="h-7 w-7" />
          Contact Management
        </h1>
        <p className="text-white/80 mt-2">
          Manage website contact details and handle incoming user messages from one workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Contact Details
          </p>
          <p className="text-base font-semibold mt-1">Address, phone, email, and office hours</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            User Messages
          </p>
          <p className="text-base font-semibold mt-1">Inbox, sent, status updates, and message actions</p>
        </div>
      </div>
      <ContactInfoForm />
      <UserMessagesList />
    </div>
  );
};

export default ContactManagementPage;
