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
