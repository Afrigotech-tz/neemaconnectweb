import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Loader2, Calendar, MapPin, Users, Eye } from 'lucide-react';
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
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
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
        variant: 'destructive',
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEvents();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
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
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      case "past":
        return <Badge className="bg-gray-100 text-gray-800">Past</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Manage your events and performances</p>
        </div>
        <Button onClick={handleCreateEvent} className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No events found. Create your first event!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium cursor-pointer hover:text-blue-600" onClick={() => handleViewEvent(event)}>
                          {event.title}
                        </div>
                        {event.is_featured && (
                          <Badge variant="secondary" className="text-xs mt-1">Featured</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{event.type}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{event.venue}</div>
                        <div className="text-muted-foreground">{event.city}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>{formatPrice(event.ticket_price)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                          title="View Event"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete Event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
