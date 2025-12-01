import PartnershipSection from "@/components/PartnershipSection";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, Heart, Star } from "lucide-react";

const Partner = () => {
  const currentPartners = [
    {
      name: "Grace Baptist Church",
      type: "Long-term Partner",
      since: "2015",
      description: "Our home church where we perform weekly services and special events."
    },
    {
      name: "City Cultural Center",
      type: "Venue Partner",
      since: "2018",
      description: "Providing venues for our major concerts and community events."
    },
    {
      name: "Music Academy",
      type: "Education Partner",
      since: "2020",
      description: "Collaborating on workshops and youth development programs."
    },
    {
      name: "Local Business Network",
      type: "Corporate Sponsors",
      since: "2019",
      description: "Supporting our ministry through financial contributions and promotion."
    }
  ];

  const partnershipBenefits = [
    {
      icon: Users,
      title: "Community Impact",
      description: "Reach thousands of community members through our events and performances",
      details: ["500+ people at major concerts", "Weekly church attendance of 200+", "10K+ social media reach"]
    },
    {
      icon: Building,
      title: "Brand Recognition",
      description: "Gain positive exposure through our marketing materials and events",
      details: ["Logo placement on programs", "Website acknowledgment", "Social media mentions"]
    },
    {
      icon: Heart,
      title: "Purpose-Driven Partnership",
      description: "Align your brand with meaningful community service and spiritual growth",
      details: ["Support music education", "Foster community unity", "Promote positive values"]
    },
    {
      icon: Star,
      title: "Exclusive Access",
      description: "Enjoy special privileges and unique opportunities as our partner",
      details: ["VIP event seating", "Private performances", "Behind-the-scenes access"]
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Partner With Us</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Join us in our mission to spread hope, love, and joy through gospel music. Together, we can make a lasting impact in our community.
          </p>
        </div>
      </section>

      {/* Partnership Options */}
      <PartnershipSection />

      {/* Why Partner With Us */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the meaningful benefits of partnering with Neema Gospel Choir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="hover:shadow-warm transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {benefit.description}
                        </p>
                        <ul className="space-y-1">
                          {benefit.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Valued Partners</h2>
            <p className="text-xl text-muted-foreground">
              Organizations and businesses that support our mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPartners.map((partner, index) => (
              <Card key={index} className="text-center hover:shadow-warm transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl text-primary-foreground font-bold">
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-2">{partner.type}</p>
                  <p className="text-sm text-muted-foreground mb-2">Partner since {partner.since}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Partnership Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Real impact from our collaborative efforts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Christmas Concert 2023",
                partner: "City Cultural Center",
                impact: "Reached 1,200 attendees and raised $5,000 for local charities",
                image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png"
              },
              {
                title: "Youth Music Program",
                partner: "Music Academy",
                impact: "Trained 150+ young singers and formed 3 new youth choirs",
                image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png"
              },
              {
                title: "Community Outreach",
                partner: "Local Business Network",
                impact: "Performed at 12 nursing homes, bringing joy to 800+ residents",
                image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png"
              }
            ].map((story, index) => (
              <Card key={index} className="hover:shadow-warm transition-all duration-300 group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={story.image} 
                    alt={story.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-primary font-medium mb-3">
                    In partnership with {story.partner}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    {story.impact}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partner;