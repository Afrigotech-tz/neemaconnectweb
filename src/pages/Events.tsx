import { useState } from "react";
import { Calendar, MapPin, Clock, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Events = () => {
  const [filter, setFilter] = useState("all");

  const events = [
    {
      id: 1,
      title: "Christmas Carol Concert",
      date: "December 24, 2024",
      time: "7:00 PM",
      location: "City Cathedral",
      attendees: "500+",
      type: "concert",
      status: "upcoming",
      description: "Join us for a magical evening of traditional and contemporary Christmas carols that will fill your heart with joy and wonder.",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      price: "Free"
    },
    {
      id: 2,
      title: "Gospel Music Workshop",
      date: "January 15, 2025",
      time: "2:00 PM",
      location: "Community Center",
      attendees: "50",
      type: "workshop",
      status: "upcoming",
      description: "Learn vocal techniques and harmonies in this interactive workshop for aspiring gospel singers.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      price: "$25"
    },
    {
      id: 3,
      title: "Sunday Service Performance",
      date: "Every Sunday",
      time: "10:00 AM",
      location: "Grace Baptist Church",
      attendees: "200+",
      type: "service",
      status: "recurring",
      description: "Weekly worship service featuring uplifting gospel music and spiritual fellowship.",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      price: "Free"
    },
    {
      id: 4,
      title: "Easter Celebration Concert",
      date: "April 20, 2025",
      time: "6:00 PM",
      location: "Metropolitan Arena",
      attendees: "1000+",
      type: "concert",
      status: "upcoming",
      description: "A spectacular Easter celebration featuring special guests and a full orchestra.",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      price: "$15"
    },
    {
      id: 5,
      title: "Youth Choir Training",
      date: "February 10, 2025",
      time: "4:00 PM",
      location: "Music Academy",
      attendees: "30",
      type: "workshop",
      status: "upcoming",
      description: "Special training session for young singers aged 8-18 to develop their gospel music skills.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      price: "$15"
    },
    {
      id: 6,
      title: "Thanksgiving Praise Night",
      date: "November 25, 2024",
      time: "7:30 PM",
      location: "Community Hall",
      attendees: "300+",
      type: "concert",
      status: "past",
      description: "A night of gratitude and praise featuring our choir and special guest performers.",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      price: "Free"
    }
  ];

  const filterTypes = [
    { key: "all", label: "All Events" },
    { key: "concert", label: "Concerts" },
    { key: "workshop", label: "Workshops" },
    { key: "service", label: "Services" }
  ];

  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.type === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-green-100 text-green-800">Upcoming</Badge>;
      case "recurring":
        return <Badge className="bg-blue-100 text-blue-800">Recurring</Badge>;
      case "past":
        return <Badge className="bg-gray-100 text-gray-800">Past</Badge>;
      default:
        return null;
    }
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
              >
                {type.label}
              </Button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="group hover:shadow-warm transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {getStatusBadge(event.status)}
                    <Badge variant="secondary">{event.price}</Badge>
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
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      {event.attendees} Expected
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${
                      event.status === "past" 
                        ? "bg-gray-400 cursor-not-allowed" 
                        : "bg-gradient-primary hover:shadow-glow"
                    } transition-all duration-300`}
                    disabled={event.status === "past"}
                  >
                    {event.status === "past" ? "Event Completed" : "Register Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* No Events Message */}
          {filteredEvents.length === 0 && (
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