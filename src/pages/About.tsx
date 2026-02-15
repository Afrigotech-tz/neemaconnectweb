import { useEffect } from "react";
import { Music, Users, Heart, Star, Mic, Music2, Shield, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAbout } from "@/hooks/useAbout";

interface Leader {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  icon: React.ElementType;
}

const About = () => {
  const { aboutUs, fetchAboutUs } = useAbout();

  useEffect(() => {
    fetchAboutUs();
  }, [fetchAboutUs]);

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

  // Leadership team data for the choir
  const leadershipTeam: Leader[] = [
    {
      id: 1,
      name: "Reverend Sarah Johnson",
      role: "Choir Director",
      description: "Oversees all musical performances, leads rehearsals, and provides spiritual guidance to the choir. With over 20 years of experience in gospel music ministry.",
      image: "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png",
      icon: Crown
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Assistant Choir Director",
      description: "Supports the director in managing rehearsals, coordinates section leaders, and assists with vocal training programs.",
      image: "/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png",
      icon: Mic
    },
    {
      id: 3,
      name: "Dr. Emily Williams",
      role: "Vocal Coach",
      description: "Provides vocal training, coaches individual singers, and ensures vocal health and technique excellence throughout the choir.",
      image: "/lovable-uploads/693e0442-bda3-4e44-bf2d-08b09e98ba54.png",
      icon: Music2
    },
    {
      id: 4,
      name: "James Anderson",
      role: "Choir Administrator",
      description: "Manages scheduling, communications, event logistics, and coordinates performances with external venues and organizations.",
      image: "/lovable-uploads/95215f6e-1ac7-47e3-aef6-31de3bfe820f.png",
      icon: Shield
    },
    {
      id: 5,
      name: "Pastor David Martinez",
      role: "Spiritual Leader",
      description: "Provides pastoral care, leads prayer sessions, and ensures the choir's mission remains grounded in faith and spiritual growth.",
      image: "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png",
      icon: Heart
    }
  ];

  // Fallback content when API hasn't loaded yet
  const storyContent = aboutUs?.our_story ||
    `Founded in 2009, Neema Gospel Choir began as a small group of friends who shared a passion for worship music. What started in a church basement with just 12 members has grown into a thriving ministry of over 150 talented singers from diverse backgrounds.

Our name "Neema," meaning "grace" in Swahili, was chosen to reflect our core belief that God's grace is for everyone, regardless of their background or circumstances. This principle guides everything we do — from our inclusive membership to our diverse musical repertoire.

Over the years, we've had the privilege of performing at hundreds of events, touching thousands of lives, and building a community that extends far beyond our choir.`;

  const missionContent = aboutUs?.mission ||
    "To glorify God and serve our community by sharing the message of hope, love, and grace through powerful gospel music that touches hearts and transforms lives.";

  const visionContent = aboutUs?.vision ||
    "To be a beacon of hope in our community, using music as a bridge to bring people together, heal divisions, and create a world filled with more love, understanding, and joy.";

  const heroImage = aboutUs?.image || "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png";

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
              {storyContent.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Choir performing"
                className="rounded-2xl shadow-warm w-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png";
                }}
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
                  {missionContent}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all duration-300">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">Our Vision</h2>
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  {visionContent}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {leadershipTeam.map((leader, index) => {
              const IconComponent = leader.icon;
              return (
                <Card 
                  key={leader.id} 
                  className="group hover:shadow-warm transition-all duration-500 overflow-hidden border-0 bg-gradient-to-b from-card to-card/80"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-56 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/lovable-uploads/61b8188f-df3e-4934-a3ff-2bbadcd88906.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-xs font-medium text-primary-foreground/90 uppercase tracking-wider">
                          {leader.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {leader.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {leader.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Leadership Flow Visual */}
          <div className="mt-16">
            <div className="flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                {/* Choir Director - Top */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg ring-4 ring-amber-100">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <span className="mt-3 font-semibold text-foreground">Choir Director</span>
                </div>
              </div>
              
              {/* Arrow down */}
              <div className="h-8 w-0.5 bg-gradient-to-b from-amber-400 to-primary my-2" />
              
              {/* Row 2: Assistant Director & Vocal Coach */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-16">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                    <Mic className="h-8 w-8 text-white" />
                  </div>
                  <span className="mt-2 font-medium text-foreground">Assistant Director</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg ring-4 ring-purple-100">
                    <Music2 className="h-8 w-8 text-white" />
                  </div>
                  <span className="mt-2 font-medium text-foreground">Vocal Coach</span>
                </div>
              </div>
              
              {/* Arrow down */}
              <div className="h-8 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400 my-2" />
              
              {/* Row 3: Choir Administrator & Spiritual Leader */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-16">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg ring-4 ring-teal-100">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <span className="mt-2 font-medium text-foreground">Choir Administrator</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg ring-4 ring-rose-100">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <span className="mt-2 font-medium text-foreground">Spiritual Leader</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
