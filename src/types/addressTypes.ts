export interface Address {
  id: number;
  user_id: number;
  label: string;
  street: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressData {
  label: string;
  street: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

export type UpdateAddressData = Partial<CreateAddressData>;
