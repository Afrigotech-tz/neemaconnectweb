export interface Event {
  id: number;
  title: string;
  type: 'concert' | 'service' | 'live_recording' | 'conference' | 'other';
  date: string;
  location: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  capacity: number;
  ticket_price: number;
  ticket_url?: string;
  image?: string;
  is_featured: boolean;
  is_public: boolean;
  status: 'upcoming' | 'past' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface EventCreate {
  title: string;
  type: 'concert' | 'service' | 'live_recording' | 'conference' | 'other';
  date: string;
  location: string;
  description: string;
  venue: string;
  city: string;
  country: string;
  capacity: number;
  ticket_price: number;
  ticket_url?: string;
  image?: string;
  is_featured: boolean;
  is_public: boolean;
  status: 'upcoming' | 'past' | 'cancelled';
}

export interface EventUpdate extends Partial<EventCreate> {}

export interface EventsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Event[];
    total: number;
    per_page: number;
  };
  message: string;
}

export interface EventResponse {
  success: boolean;
  data: Event;
  message: string;
}

export interface EventFilters {
  type?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
}

export interface EventSearchParams {
  query: string;
}
