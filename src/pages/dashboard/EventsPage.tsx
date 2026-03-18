import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Filter, Loader2, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Event } from "@/types/eventTypes";
import { eventService } from "@/services/eventService/eventService";
import EventForm from "@/components/admin/EventForm";

const EventsPage = () => {
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEvents({
          type: filter === "all" ? undefined : filter,
          per_page: 50
        });
        setEvents(response.data.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  const handleCreateSuccess = () => {
    // Refresh the events list
    const fetchEvents = async () => {
      try {
        const response = await eventService.getEvents({
          type: filter === "all" ? undefined : filter,
          per_page: 50
        });
        setEvents(response.data.data);
      } catch (err) {
        console.error('Error refreshing events:', err);
      }
    };
    fetchEvents();
  };

  const filterTypes = [
    { key: "all", label: "All Events" },
    { key: "concert", label: "Concerts" },
    { key: "service", label: "Services" },
    { key: "live_recording", label: "Live Recordings" },
    { key: "conference", label: "Conferences" },
    { key: "other", label: "Other" }
  ];

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

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGetTickets = (event: Event) => {
    if (event.ticket_url) {
      window.open(event.ticket_url, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Discover upcoming concerts, services, and special events
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-primary hover:shadow-glow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">Filter by type:</span>
        </div>
        {filterTypes.map((type) => (
          <Button
            key={type.key}
            variant={filter === type.key ? "default" : "outline"}
            onClick={() => setFilter(type.key)}
            className={filter === type.key ? "bg-gradient-primary" : ""}
            disabled={loading}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading events...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="group hover:shadow-warm transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src="/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png"
                  alt={event.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {getStatusBadge(event.status)}
                  {event.is_featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                  )}
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="group-hover:text-primary transition-colors">
                  {event.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    {event.venue}, {event.city}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    Capacity: {event.capacity}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Badge variant="secondary">{formatPrice(event.ticket_price)}</Badge>
                  <Badge variant="outline" className="capitalize">{event.type}</Badge>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    event.status === "past" || event.status === "cancelled"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-primary hover:shadow-glow"
                  } transition-all duration-300`}
                  disabled={event.status === "past" || event.status === "cancelled"}
                  onClick={() => handleGetTickets(event)}
                >
                  {event.status === "past" ? "Event Completed" :
                   event.status === "cancelled" ? "Event Cancelled" :
                   event.ticket_url ? (
                     <>
                       Get Tickets
                       <ExternalLink className="ml-2 h-4 w-4" />
                     </>
                   ) : "Register Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* No Events Message */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
            No events found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filter or check back later for new events.
          </p>
        </div>
      )}

      {/* Create Event Form */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
};

export default EventsPage;
