import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, Users, Star, Heart, Loader2, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { eventService } from '@/services/eventService';
import { Event } from '@/types/eventTypes';
import { Link } from 'react-router-dom';

const Tickets = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEvents({ per_page: 50 });
        // Filter for upcoming and public events
        const upcomingEvents = response.data.data.filter(
          (event: Event) => event.status === 'upcoming' && event.is_public
        );
        setEvents(upcomingEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Event Tickets
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Book your tickets for our upcoming concerts and events. Join us for inspiring worship, 
            beautiful music, and fellowship in the presence of God.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span>Group Discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-secondary" />
              <span>Free Events Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">Don't miss out on these amazing worship experiences</p>
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

          {/* Events List */}
          {!loading && !error && events.length > 0 && (
            <div className="space-y-8">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-warm transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={getEventImage(event)} 
                        alt={event.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.is_featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>Capacity: {event.capacity}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-foreground">Ticket Information:</h4>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <span className="font-medium">General Admission</span>
                            <span className="text-muted-foreground ml-2">- {formatPrice(event.ticket_price)}</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant={event.ticket_price === 0 ? "secondary" : "default"}
                            asChild={!!event.ticket_url}
                          >
                            {event.ticket_url ? (
                              <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                                Get Tickets
                              </a>
                            ) : (
                              <span>Register Now</span>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {event.location}, {event.city}, {event.country}
                        </div>
                        <Button variant="outline" asChild>
                          <Link to="/events">View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No Events State */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
                No upcoming events
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back later for new events or browse all events.
              </p>
              <Button asChild>
                <Link to="/events">View All Events</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Booking Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Booking Information</h2>
            <p className="text-muted-foreground">Everything you need to know about our events</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Ticket className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Simple online booking process with instant confirmation
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-lg">Group Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Special pricing for groups of 10 or more people
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-lg">Free Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Many of our events are free - donations are welcome
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">VIP Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Premium seating and exclusive meet & greet opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact for Events */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Questions About Events?</h2>
          <p className="text-muted-foreground mb-8">
            Contact us for group bookings, special arrangements, or any other inquiries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tickets;

