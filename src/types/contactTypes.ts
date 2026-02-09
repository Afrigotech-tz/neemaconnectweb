export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  office_hours?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  whatsapp_number?: string;
  emergency_contact?: string;
  support_email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInfoData {
  phone: string;
  email: string;
  address: string;
  office_hours?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  whatsapp_number?: string;
  emergency_contact?: string;
  support_email?: string;
}

export type UpdateContactInfoData = Partial<CreateContactInfoData>;

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactSubmissionData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactInfoResponse {
  success: boolean;
  message: string;
  data?: ContactInfo;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data?: ContactSubmission;
}

export interface ContactSubmissionsResponse {
  success: boolean;
  message: string;
  data?: ContactSubmission[];
}
