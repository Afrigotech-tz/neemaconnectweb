import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UpcomingEvents = () => {
  const events = [
    {
      id: 1,
      title: "Christmas Carol Concert",
      date: "December 24, 2024",
      time: "7:00 PM",
      location: "City Cathedral",
      attendees: "500+",
      description: "Join us for a magical evening of traditional and contemporary Christmas carols that will fill your heart with joy and wonder.",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      featured: true
    },
    {
      id: 2,
      title: "Gospel Music Workshop",
      date: "January 15, 2025",
      time: "2:00 PM",
      location: "Community Center",
      attendees: "50",
      description: "Learn vocal techniques and harmonies in this interactive workshop for aspiring gospel singers.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png"
    },
    {
      id: 3,
      title: "Sunday Service Performance",
      date: "Every Sunday",
      time: "10:00 AM",
      location: "Grace Baptist Church",
      attendees: "200+",
      description: "Weekly worship service featuring uplifting gospel music and spiritual fellowship.",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png"
    }
  ];

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

        {/* Events List */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="bg-card rounded-xl p-6 border hover:shadow-warm transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {event.featured && (
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
                      {event.attendees}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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

