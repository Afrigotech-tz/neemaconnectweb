import { Heart, HandHeart, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PartnershipSection = () => {
  const partnershipOptions = [
    {
      type: "Short-Term",
      icon: Heart,
      duration: "3-6 Months",
      description: "Perfect for events and seasonal support",
      color: "from-warm-orange to-warm-red"
    },
    {
      type: "Long-Term",
      icon: HandHeart,
      duration: "1+ Years",
      description: "Ongoing support for sustained impact",
      color: "from-primary to-primary-glow"
    }
  ];

  const partnershipBenefits = [
    {
      icon: Star,
      title: "Community Impact",
      description: "Support music education and spiritual growth in our community"
    },
    {
      icon: Heart,
      title: "Brand Visibility",
      description: "Gain positive exposure through our concerts and events"
    },
    {
      icon: HandHeart,
      title: "Meaningful Connection",
      description: "Build authentic relationships with our choir family"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Become Our Partner
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join us in spreading joy and hope through music. Choose a partnership plan that aligns with your vision and budget.
          </p>
        </div>

        {/* Partnership Registration Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {partnershipOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.type}
                className="relative overflow-hidden hover:shadow-glow transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{option.type} Partnership</CardTitle>
                  <p className="text-muted-foreground">{option.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">Duration: {option.duration}</p>
                </CardHeader>

                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    Register for {option.type} Partnership
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Partnership Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {partnershipBenefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Our Products & Events Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Our Products Overview */}
          <div className="bg-card rounded-xl p-6 border">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Our Products</h3>
            <p className="text-muted-foreground mb-4">
              Discover our collection of inspirational merchandise that spreads the message of faith and hope.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Choir Albums & Digital Music</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Faith-Based Apparel & Accessories</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Inspirational Books & Resources</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Custom Choir Merchandise</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events Overview */}
          <div className="bg-card rounded-xl p-6 border">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Upcoming Events</h3>
            <p className="text-muted-foreground mb-4">
              Join us for inspiring performances and community gatherings throughout the year.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Gospel Concerts & Performances</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Community Worship Services</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Music Workshops & Training</span>
              </div>
              <div className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-primary mr-2" />
                <span>Special Holiday Celebrations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-hero rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h3>
            <p className="text-lg mb-6 opacity-90">
              Contact us to discuss custom partnership opportunities that align with your organization's goals.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-foreground hover:bg-white/90 transition-all duration-300"
            >
              Contact Partnership Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;

