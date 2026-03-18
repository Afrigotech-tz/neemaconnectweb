import HeroSlider from "@/components/HeroSlider";
import PartnershipSection from "@/components/PartnershipSection";
import MusicPlatforms from "@/components/MusicPlatforms";
import FeaturedEvents from "@/components/FeaturedEvents";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Music, Heart, Award, Rocket, Lightbulb } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();

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
      <section className="py-20 bg-gradient-hero text-primary-foreground relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <p className="text-[hsl(var(--gold))] font-semibold tracking-[0.2em] uppercase mb-6">~ Who We Are</p>
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-primary-foreground">
                {t('home.title')}
              </h2>
              <p className="text-lg lg:text-2xl text-primary-foreground/90 leading-relaxed mb-4 max-w-2xl">
                {t('home.description1')}
              </p>
              <p className="text-base lg:text-lg text-primary-foreground/80 leading-relaxed mb-10 max-w-2xl">
                {t('home.description2')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="group flex items-start gap-4 rounded-2xl border border-primary-foreground/35 bg-primary-foreground/15 p-5 backdrop-blur-md shadow-warm transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/20">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-gold text-foreground flex items-center justify-center shadow-glow ring-2 ring-primary-foreground/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Rocket className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-foreground mb-2">{t('common.choir_members')}</h3>
                    <p className="text-primary-foreground/95 text-base">{t('common.passionate_voices')}</p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 rounded-2xl border border-primary-foreground/35 bg-primary-foreground/15 p-5 backdrop-blur-md shadow-warm transition-all duration-300 hover:-translate-y-1 hover:bg-primary-foreground/20">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-gold text-foreground flex items-center justify-center shadow-glow ring-2 ring-primary-foreground/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <Lightbulb className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-foreground mb-2">{t('common.performances')}</h3>
                    <p className="text-primary-foreground/95 text-base">{t('common.concerts_and_services')}</p>
                  </div>
                </div>
              </div>

              <Link to="/about" className="inline-flex">
                <button className="bg-gradient-gold text-foreground px-10 py-4 rounded-md text-2xl font-semibold hover:brightness-105 transition-all duration-300 shadow-warm-lg">
                  OUR TEAM
                </button>
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <img 
                src="/lovable-uploads/336ebe09-2ea3-4cfb-a1ca-56b18fd19f9b.png" 
                alt="Neema Gospel Choir Team"
                className="rounded-3xl shadow-2xl w-full min-h-[520px] object-cover"
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:-right-8 lg:translate-x-0 w-[86%] rounded-3xl bg-card text-card-foreground p-6 shadow-warm-lg border border-border">
                <p className="text-primary text-xl mb-2">Neema Gospel Choir</p>
                <h3 className="text-4xl font-semibold mb-3 text-card-foreground">Looking for help?</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We are here to serve through worship, music ministry, and community support.
                </p>
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
