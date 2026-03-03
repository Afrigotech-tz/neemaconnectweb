import HeroSlider from "@/components/HeroSlider";
import PartnershipSection from "@/components/PartnershipSection";
import MusicPlatforms from "@/components/MusicPlatforms";
import FeaturedEvents from "@/components/FeaturedEvents";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Music, Heart, Award } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Users,
      number: "150+",
      label: t('common.choir_members'),
      description: t('common.passionate_voices')
    },
    {
      icon: Music,
      number: "500+",
      label: t('common.performances'),
      description: t('common.concerts_and_services')
    },
    {
      icon: Heart,
      number: "10K+",
      label: t('common.lives_touched'),
      description: t('common.hearts_changed')
    },
    {
      icon: Award,
      number: "15+",
      label: t('common.years_of_ministry'),
      description: t('common.serving_community')
    }
  ];

  return (
    <div className="pt-16"> {/* Account for fixed navigation */}
      {/* Hero Section */}
     <HeroSlider />

      {/* Donation Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('common.support_ministry')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('common.donation_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-warm transition-all duration-300 border-primary/20">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Monthly Support</h3>
                <p className="text-muted-foreground mb-4">Join our monthly supporters and help sustain our ministry</p>
                <Link to="/donation">
                  <button className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    Give Monthly
                  </button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300 border-accent/20 transform md:scale-105">
              <CardContent className="p-8">
                <Award className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">One-Time Gift</h3>
                <p className="text-muted-foreground mb-4">Make a single donation to support our current needs</p>
                <Link to="/donation">
                  <button className="w-full bg-accent text-accent-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors">
                    Give Once
                  </button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300 border-secondary/20">
              <CardContent className="p-8">
                <Music className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Sponsor Event</h3>
                <p className="text-muted-foreground mb-4">Partner with us to sponsor upcoming concerts and events</p>
                <Link to="/donation">
                  <button className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                    Sponsor Now
                  </button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              All donations are secure and help us continue sharing God's love through music
            </p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <span>✓ Secure Payment</span>
              <span>✓ Tax Deductible</span>
              <span>✓ 100% goes to Ministry</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                {t('home.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('home.description1')}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('home.description2')}
              </p>
              <button className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors mb-8">
                {t('common.watch_performances')}
              </button>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-warm transition-all duration-300">
                      <CardContent className="p-6">
                        <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                        <div className="text-2xl font-bold text-foreground mb-1">
                          {stat.number}
                        </div>
                        <div className="font-medium text-foreground mb-1">
                          {stat.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.description}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png" 
                alt="Neema Gospel Choir Team"
                className="rounded-2xl shadow-warm w-full"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Music className="h-12 w-12 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <FeaturedEvents />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Partnership Section */}
      <PartnershipSection />

      {/* Music Platforms */}
      <MusicPlatforms />

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              {t('common.what_people_say')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('common.testimonies')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(t('testimonials', { returnObjects: true }) as Array<{name: string; role: string; quote: string}>).map((testimonial, index) => (
              <Card key={index} className="hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex text-primary mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">⭐</span>
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

