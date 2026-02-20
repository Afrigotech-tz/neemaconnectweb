import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, Calendar, MapPin, Users, Eye, Clock, Ticket } from 'lucide-react';
import { Event } from '@/types/eventTypes';
import { eventService } from '@/services/eventService';
import EventForm from './EventForm';
import EventView from './EventView';
import { useToast } from '@/hooks/use-toast';

const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEvents({ per_page: 100 });
      setEvents(response.data.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsFormOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await eventService.deleteEvent(event.id);
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEvents();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="badge badge-success badge-lg">Upcoming</span>;
      case "past":
        return <span className="badge badge-ghost badge-lg">Past</span>;
      case "cancelled":
        return <span className="badge badge-error badge-lg">Cancelled</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20" data-theme="neemadmin">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOC04LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Calendar className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Events Management</h1>
              <p className="text-white/80">Manage your events and performances</p>
            </div>
          </div>
          <Button onClick={handleCreateEvent} className="btn btn-secondary gap-2 shadow-lg">
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>

      {error && (
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Events Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-base-content">{events.length}</p>
              <p className="text-sm text-base-content/60">Total Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Clock className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'upcoming').length}</p>
              <p className="text-sm text-base-content/60">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Ticket className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{events.filter(e => e.ticket_price > 0).length}</p>
              <p className="text-sm text-base-content/60">Paid Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-base-200">
          <h2 className="text-xl font-bold text-base-content">All Events</h2>
          <p className="text-sm text-base-content/60">Manage your event calendar</p>
        </div>
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">No events found</h3>
              <p className="text-base-content/60 mb-4">Create your first event!</p>
              <Button onClick={handleCreateEvent} className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="bg-base-100">
                    <th className="font-bold">Event</th>
                    <th className="font-bold">Type</th>
                    <th className="font-bold">Date & Time</th>
                    <th className="font-bold">Location</th>
                    <th className="font-bold">Price</th>
                    <th className="font-bold">Status</th>
                    <th className="text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="hover transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p 
                              className="font-semibold text-base-content cursor-pointer hover:text-primary transition-colors" 
                              onClick={() => handleViewEvent(event)}
                            >
                              {event.title}
                            </p>
                            {event.is_featured && (
                              <span className="badge badge-secondary badge-sm">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline capitalize">{event.type}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/70">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <p className="text-base-content">{event.venue}</p>
                          <p className="text-base-content/50">{event.city}</p>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-base-content">{formatPrice(event.ticket_price)}</span>
                      </td>
                      <td>{getStatusBadge(event.status)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs" onClick={() => handleViewEvent(event)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs" onClick={() => handleEditEvent(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs text-error" onClick={() => handleDeleteEvent(event)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Event View Dialog */}
      <EventView
        isOpen={!!viewingEvent}
        onClose={() => setViewingEvent(null)}
        event={viewingEvent}
      />

      {/* Event Form Dialog */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        event={editingEvent}
      />
    </div>
  );
};

export default EventsManagement;

