export interface ContactInfo {
  id: number;
  address: string;
  phone: string;
  email: string;
  office_hours?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInfoData {
  address: string;
  phone: string;
  email: string;
  office_hours?: string;
}

export type UpdateContactInfoData = Partial<CreateContactInfoData>;

export interface ContactInfoResponse {
  success: boolean;
  message: string;
  data?: ContactInfo;
}

export type UserMessageStatus = 'pending' | 'read' | 'replied' | 'closed';

export interface UserMessage {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: UserMessageStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateUserMessageData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface UpdateUserMessageData {
  status: UserMessageStatus;
}
