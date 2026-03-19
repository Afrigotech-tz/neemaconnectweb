import HeroSlider from "@/components/HeroSlider";
import PartnershipSection from "@/components/PartnershipSection";
import MusicPlatforms from "@/components/MusicPlatforms";
import FeaturedEvents from "@/components/FeaturedEvents";
import FeaturedProducts from "@/components/FeaturedProducts";
import { Card, CardContent } from "@/components/ui/card";
import {
  Music,
  Heart,
  Award,
  Users,
  Rocket,
  Lightbulb,
  CalendarDays,
  ShoppingBag,
  HandHeart,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useTranslation();
  const quickLinks = [
    {
      title: "Upcoming Events",
      description: "Find concerts, worship nights, and special gatherings near you.",
      icon: CalendarDays,
      to: "/events",
      cta: "View Events",
    },
    {
      title: "Support Ministry",
      description: "Give securely and help us keep sharing faith through music.",
      icon: HandHeart,
      to: "/donation",
      cta: "Donate Now",
    },
    {
      title: "Shop",
      description: "Explore choir products, ministry resources, and gift items.",
      icon: ShoppingBag,
      to: "/shop",
      cta: "Visit Shop",
    },
    {
      title: "Contact Us",
      description: "Reach out for bookings, prayers, partnerships, or questions.",
      icon: Mail,
      to: "/contact",
      cta: "Get in Touch",
    },
  ];

  const supportOptions = [
    {
      title: "Monthly Support",
      description: "Join our monthly supporters and help sustain our ministry.",
      cta: "Give Monthly",
      icon: Heart,
      tone: "text-primary",
      buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
    },
    {
      title: "One-Time Gift",
      description: "Make a single donation to support urgent and current needs.",
      cta: "Give Once",
      icon: Award,
      tone: "text-accent",
      buttonClass: "bg-accent text-accent-foreground hover:bg-accent/90",
    },
    {
      title: "Sponsor Event",
      description: "Partner with us to sponsor upcoming concerts and outreach.",
      cta: "Sponsor Now",
      icon: Music,
      tone: "text-secondary",
      buttonClass: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    },
  ];

  const impactStats = [
    {
      label: t('common.choir_members'),
      value: "150+",
      icon: Users,
    },
    {
      label: t('common.performances'),
      value: "500+",
      icon: Music,
    },
    {
      label: t('common.lives_touched'),
      value: "10K+",
      icon: Heart,
    },
    {
      label: t('common.years_of_ministry'),
      value: "15+",
      icon: Award,
    },
  ];

  return (
    <div className="pt-16"> {/* Account for fixed navigation */}
      {/* Hero Section */}
     <HeroSlider />

      {/* Quick Actions */}
      <section className="py-10 bg-background border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-3">
              <ArrowRight className="h-4 w-4" />
              Quick Access
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Explore Neema in One Click</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Everything you need is organized here so visitors can quickly find events, donations, shop items, and support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <p className="mt-4 text-sm font-semibold text-primary">{item.cta}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
              <HandHeart className="h-4 w-4" />
              Make a Difference
            </p>
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              {t('common.support_ministry')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              {t('common.donation_description')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {supportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <Card key={option.title} className="text-center border-border hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <Icon className={`h-12 w-12 mx-auto mb-4 ${option.tone}`} />
                    <h3 className="text-xl font-semibold text-foreground mb-2">{option.title}</h3>
                    <p className="text-muted-foreground mb-4">{option.description}</p>
                    <Link to="/donation">
                      <button className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${option.buttonClass}`}>
                        {option.cta}
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground mb-4">All donations are secure and help us continue sharing God's love through music.</p>
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Secure Payment
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                Tax Deductible
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                100% Goes to Ministry
              </span>
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

      {/* Impact Stats */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {impactStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-border/60 bg-background p-4 md:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-warm"
                  >
                    <div className="mx-auto h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                );
              })}
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

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-primary-foreground/20 bg-primary-foreground/10 p-8 md:p-10 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-balance">Join the Neema Gospel Choir Journey</h2>
                <p className="mt-3 text-primary-foreground/85 text-lg max-w-3xl">
                  Whether you want to worship with us, support the ministry, or partner for events, we would love to connect.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/partner">
                  <button className="w-full sm:w-auto rounded-lg bg-card text-card-foreground px-6 py-3 font-semibold hover:bg-card/90 transition-colors">
                    Become a Partner
                  </button>
                </Link>
                <Link to="/contact">
                  <button className="w-full sm:w-auto rounded-lg border border-primary-foreground/50 px-6 py-3 font-semibold hover:bg-primary-foreground/10 transition-colors">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <Card key={index} className="relative overflow-hidden border-border/70 hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex text-primary">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">★</span>
                        ))}
                      </div>
                      <Quote className="h-5 w-5 text-primary/70" />
                    </div>
                  </div>
                  <p className="text-muted-foreground italic mb-4 leading-relaxed relative z-10">
                    "{testimonial.quote}"
                  </p>
                  <div className="relative z-10">
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
