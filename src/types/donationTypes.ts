export interface Donation {
  id: number;
  user_id?: number | null;
  campaign_id: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string | null;
  amount: number;
  currency?: string;
  payment_method?: string;
  transaction_reference: string;
  message?: string | null;
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface DonationCategory {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface DonationStatistics {
  total_donations?: number;
  total_amount?: number;
  this_month_donations?: number;
  this_month_amount?: number;
  [key: string]: unknown;
}

export interface CreateDonationData {
  campaign_id: number;
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  transaction_reference: string;
  message?: string;
}

export interface UpdateDonationStatusData {
  status: string;
}

export interface CreateDonationCategoryData {
  name: string;
}

export interface UpdateDonationCategoryData {
  name: string;
}

export interface DonationListResponse {
  data: Donation[];
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}
