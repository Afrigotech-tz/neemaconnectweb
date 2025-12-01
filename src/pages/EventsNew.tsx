import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Event } from "@/types/eventTypes";
import { eventService } from "@/services/eventService";

const Events = () => {
  const [filter, setFilter] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Events</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Join us for inspiring concerts, educational workshops, and spiritual gatherings that bring our community together through the power of gospel music.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
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
            <Alert className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    >
                      {event.status === "past" ? "Event Completed" :
                       event.status === "cancelled" ? "Event Cancelled" :
                       event.ticket_url ? "Get Tickets" : "Register Now"}
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-hero rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Want to Host an Event?</h3>
            <p className="text-lg mb-6 opacity-90">
              Invite Neema Gospel Choir to perform at your next event. We'd love to share our music with your community!
            </p>
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 transition-all duration-300"
            >
              Request Performance
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
