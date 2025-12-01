import api from './api';
import {
  Event,
  EventCreate,
  EventUpdate,
  EventsResponse,
  EventResponse,
  EventFilters,
  EventSearchParams
} from '@/types/eventTypes';

export const eventService = {
  // Get list of events with optional filters
  getEvents: async (filters?: EventFilters): Promise<EventsResponse> => {
    const response = await api.get('/events', { params: filters });
    return response.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (): Promise<{ success: boolean; data: Event[]; message: string }> => {
    const response = await api.get('/events/upcoming');
    return response.data;
  },

  // Get single event details
  getEvent: async (eventId: number): Promise<EventResponse> => {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  },

  // Create new event
  createEvent: async (eventData: EventCreate): Promise<EventResponse> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId: number, eventData: EventUpdate): Promise<EventResponse> => {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  },

  // Search events
  searchEvents: async (params: EventSearchParams): Promise<{ success: boolean; data: Event[]; message: string }> => {
    const response = await api.get('/events/search', { params });
    return response.data;
  },
};

export default eventService;
