import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { eventService } from "@/services/eventService";
import { Event } from "@/types/eventTypes";

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEvents({ per_page: 10 });
        // Filter for upcoming and public events
        const upcoming = response.data.data.filter(
          (event: Event) => event.status === 'upcoming' && event.is_public
        );
        setEvents(upcoming.slice(0, 5)); // Limit to 5 events
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
        setError('Failed to load upcoming events.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Default event image
  const getEventImage = (event: Event) => {
    if (event.image) return event.image;
    return "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png";
  };

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join us for these inspiring events where faith and music come together in beautiful harmony
          </p>
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

        {/* No Events State */}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
              No upcoming events
            </h3>
            <p className="text-muted-foreground mb-6">
              Check back later for upcoming events or browse all events.
            </p>
            <Button asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        )}

        {/* Events List */}
        {!loading && !error && events.length > 0 && (
          <div className="space-y-8">
            {events.map((event) => (
              <div 
                key={event.id}
                className="bg-card rounded-xl p-6 border hover:shadow-warm transition-all duration-300 group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={getEventImage(event)} 
                      alt={event.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {event.is_featured && (
                      <div className="absolute top-4 left-4 bg-gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground mt-2 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        {event.venue}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 text-primary" />
                        {event.capacity}+
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span className="font-semibold text-primary">
                          {event.ticket_price === 0 ? 'Free' : `$${event.ticket_price}`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                        asChild
                      >
                        <Link to="/events">Register Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Events Button */}
        <div className="text-center mt-12">
          <Link to="/events">
            <Button 
              variant="outline" 
              size="lg"
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;

