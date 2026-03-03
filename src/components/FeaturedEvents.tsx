import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { eventService } from "@/services/eventService";
import { Event } from "@/types/eventTypes";
import { Link } from "react-router-dom";

const FeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEvents({ per_page: 10 });
        // Filter for featured and public events
        const featured = response.data.data.filter(
          (event: Event) => event.is_featured && event.is_public
        );
        setFeaturedEvents(featured.slice(0, 3)); // Limit to 3 events
      } catch (err) {
        console.error('Error fetching featured events:', err);
        setError('Failed to load featured events.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getEventTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      concert: 'Concert',
      service: 'Service',
      live_recording: 'Live Recording',
      conference: 'Conference',
      other: 'Other'
    };
    return typeMap[type] || type;
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
          <div className="flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-4xl font-bold text-foreground">Featured Events</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't miss these special upcoming performances and community gatherings that showcase the power of gospel music.
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
        {!loading && !error && featuredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
              No featured events
            </h3>
            <p className="text-muted-foreground mb-6">
              Check back later for featured events or browse all events.
            </p>
            <Button asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        )}

        {/* Featured Events Grid */}
        {!loading && !error && featuredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-glow transition-all duration-300 group">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getEventImage(event)} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {getEventTypeLabel(event.type)}
                    </Badge>
                  </div>
                  {event.is_featured && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-warm text-white">
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-semibold text-foreground">{formatPrice(event.ticket_price)}</span>
                  </div>
                </div>

                <CardHeader>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {event.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>{event.capacity} Expected Attendees</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    asChild
                  >
                    <Link to="/events">Register Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link to="/events">
            <Button 
              size="lg" 
              className="bg-gradient-warm hover:shadow-warm transition-all duration-300"
            >
              View All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;

