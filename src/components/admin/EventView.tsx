import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Users, DollarSign, ExternalLink, Eye } from 'lucide-react';
import { Event } from '@/types/eventTypes';

interface EventViewProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventView: React.FC<EventViewProps> = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      concert: "bg-purple-100 text-purple-800",
      service: "bg-blue-100 text-blue-800",
      live_recording: "bg-orange-100 text-orange-800",
      conference: "bg-green-100 text-green-800",
      other: "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={typeColors[type] || typeColors.other}>
        {type.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Event Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <div className="flex items-center gap-2">
                  {getTypeBadge(event.type)}
                  {getStatusBadge(event.status)}
                  {event.is_featured && (
                    <Badge variant="secondary">Featured</Badge>
                  )}
                  {!event.is_public && (
                    <Badge variant="outline">Private</Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Date & Time
              </div>
              <div className="text-sm">
                {formatDate(event.date)}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <div className="text-sm">
                <div>{event.venue}</div>
                <div className="text-muted-foreground">{event.location}</div>
                <div className="text-muted-foreground">{event.city}, {event.country}</div>
              </div>
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Capacity
              </div>
              <div className="text-sm">
                {event.capacity} people
              </div>
            </div>

            {/* Ticket Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Ticket Price
              </div>
              <div className="text-sm">
                {formatPrice(event.ticket_price)}
                {event.ticket_url && (
                  <div className="mt-1">
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Buy Tickets
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>

          {/* Timestamps */}
          {(event.created_at || event.updated_at) && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground space-y-1">
                {event.created_at && (
                  <div>Created: {new Date(event.created_at).toLocaleString()}</div>
                )}
                {event.updated_at && event.updated_at !== event.created_at && (
                  <div>Last updated: {new Date(event.updated_at).toLocaleString()}</div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventView;
