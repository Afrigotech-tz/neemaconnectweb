import { Music, Users, Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const values = [
    {
      icon: Heart,
      title: "Love & Grace",
      description: "We believe in sharing God's unconditional love through every note we sing."
    },
    {
      icon: Users,
      title: "Unity",
      description: "Our diversity is our strength, coming together as one voice in worship."
    },
    {
      icon: Music,
      title: "Excellence",
      description: "We strive for musical excellence to honor God and inspire our community."
    },
    {
      icon: Star,
      title: "Service",
      description: "We are committed to serving our community through music ministry."
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About Neema Gospel Choir</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            A community of passionate believers united by faith, music, and a shared mission to spread God's love through the power of gospel music.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Founded in 2009, Neema Gospel Choir began as a small group of friends who shared a passion for worship music. What started in a church basement with just 12 members has grown into a thriving ministry of over 150 talented singers from diverse backgrounds.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Our name "Neema," meaning "grace" in Swahili, was chosen to reflect our core belief that God's grace is for everyone, regardless of their background or circumstances. This principle guides everything we do - from our inclusive membership to our diverse musical repertoire.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Over the years, we've had the privilege of performing at hundreds of events, touching thousands of lives, and building a community that extends far beyond our choir. We've seen marriages restored, hearts healed, and lives transformed through the power of worship music.
              </p>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png" 
                alt="Choir performing"
                className="rounded-2xl shadow-warm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our ministry and shape our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-warm transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-warm transition-all duration-300">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  To glorify God and serve our community by sharing the message of hope, love, and grace through powerful gospel music that touches hearts and transforms lives.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-warm transition-all duration-300">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  To be a beacon of hope in our community, using music as a bridge to bring people together, heal divisions, and create a world filled with more love, understanding, and joy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">
              Meet the dedicated individuals who guide our ministry
            </p>
          </div>
          
          <div className="text-center">
            <img 
              src="/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png" 
              alt="Leadership Team"
              className="rounded-2xl shadow-warm mx-auto max-w-2xl w-full"
            />
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our leadership team brings together decades of musical experience, pastoral wisdom, and administrative excellence. Together, they provide spiritual guidance, musical direction, and organizational leadership that keeps our choir thriving and growing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;