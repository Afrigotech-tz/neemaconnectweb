import { Calendar, Clock, MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FeaturedEvents = () => {
  const featuredEvents = [
    {
      id: 1,
      title: "Christmas Joy Concert",
      date: "December 24, 2024",
      time: "7:00 PM",
      location: "St. Mary's Cathedral",
      attendees: 500,
      description: "Join us for a magical evening of Christmas carols and festive songs that will fill your heart with joy and celebration. Experience the true spirit of Christmas through powerful gospel music.",
      image: "/lovable-uploads/693e0442-bda3-4e44-bf2d-08b09e98ba54.png",
      featured: true,
      price: "Free",
      category: "Concert"
    },
    {
      id: 2,
      title: "Spring Gospel Workshop",
      date: "March 15, 2025",
      time: "10:00 AM",
      location: "Community Center",
      attendees: 100,
      description: "Learn vocal techniques, harmony arrangements, and spiritual expression in this comprehensive gospel music workshop. Perfect for singers of all levels looking to grow in their ministry.",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      featured: true,
      price: "$25",
      category: "Workshop"
    },
    {
      id: 3,
      title: "Easter Sunrise Service",
      date: "March 31, 2025",
      time: "6:00 AM",
      location: "Riverside Park",
      attendees: 300,
      description: "Celebrate the resurrection with an outdoor sunrise service featuring uplifting gospel music and inspiring messages of hope and renewal for the Easter season.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      featured: true,
      price: "Free",
      category: "Service"
    }
  ];

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

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-glow transition-all duration-300 group">
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {event.category}
                  </Badge>
                </div>
                {event.featured && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-warm text-white">
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-sm font-semibold text-foreground">{event.price}</span>
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
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  <span>{event.attendees} Expected Attendees</span>
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Register Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-warm hover:shadow-warm transition-all duration-300"
          >
            View All Events
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;