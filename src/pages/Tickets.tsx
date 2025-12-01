import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, Ticket, Users, Star, Music, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Tickets = () => {
  const { t } = useTranslation();

  const upcomingEvents = [
    {
      id: 1,
      title: "Easter Celebration Concert",
      date: "April 12, 2024",
      time: "7:00 PM",
      venue: "Community Center Auditorium",
      location: "Dar es Salaam, Tanzania",
      image: "/lovable-uploads/neema.png",
      description: "Join us for a special Easter celebration featuring traditional hymns and contemporary gospel music.",
      ticketTypes: [
        { type: "General Admission", price: "Free", available: true },
        { type: "VIP Seating", price: "$15", available: true },
        { type: "Family Package (4 seats)", price: "$50", available: true }
      ],
      tags: ["Concert", "Easter", "Family-Friendly"]
    },
    {
      id: 2,
      title: "Annual Gospel Gala",
      date: "June 15, 2024",
      time: "6:30 PM",
      venue: "National Stadium",
      location: "Dar es Salaam, Tanzania",
      image: "/lovable-uploads/NGC-Logo-2.png",
      description: "Our biggest event of the year featuring guest choirs from across East Africa.",
      ticketTypes: [
        { type: "Standard", price: "$25", available: true },
        { type: "Premium", price: "$50", available: true },
        { type: "VIP Experience", price: "$100", available: false }
      ],
      tags: ["Gala", "Premium Event", "International"]
    },
    {
      id: 3,
      title: "Christmas Carol Service",
      date: "December 20, 2024",
      time: "5:00 PM",
      venue: "St. Mary's Cathedral",
      location: "Dar es Salaam, Tanzania",
      image: "/lovable-uploads/AIC-MAIN.png",
      description: "A traditional Christmas carol service with candlelight and special performances.",
      ticketTypes: [
        { type: "General Seating", price: "Free", available: true },
        { type: "Reserved Seating", price: "$10", available: true }
      ],
      tags: ["Christmas", "Traditional", "Candlelight"]
    }
  ];

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
          
          <div className="space-y-8">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-warm transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-accent" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <h4 className="font-semibold text-foreground">Ticket Options:</h4>
                      {event.ticketTypes.map((ticket, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <span className="font-medium">{ticket.type}</span>
                            <span className="text-muted-foreground ml-2">- {ticket.price}</span>
                          </div>
                          <Button 
                            size="sm" 
                            disabled={!ticket.available}
                            variant={ticket.available ? "default" : "secondary"}
                          >
                            {ticket.available ? "Book Now" : "Sold Out"}
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        {event.location}
                      </div>
                      <Button variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
            <Button size="lg" className="text-lg px-8">
              Contact Us
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              View All Events
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tickets;