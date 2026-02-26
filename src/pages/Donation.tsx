import { useTranslation } from 'react-i18next';
import { Heart, DollarSign, Users, Award, Music, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTZS } from '@/lib/currency';

// Tanzania donation tiers in TSh
const donationTiers = [
  {
    icon: Heart,
    title: "Msaidizi (Supporter)",
    amount: 50000,
    description: "Help cover monthly choir practice expenses",
    features: ["Monthly newsletter", "Prayer requests"]
  },
  {
    icon: Music,
    title: "Mratibu (Patron)",
    amount: 100000,
    description: "Support music equipment and instruments",
    features: ["Newsletter", "Prayer requests", "Event updates"]
  },
  {
    icon: Award,
    title: "Mwenyekiti (Champion)",
    amount: 250000,
    description: "Sponsor a choir member's participation",
    features: ["All previous benefits", "Special recognition", "Annual report"]
  },
  {
    icon: Star,
    title: "Mhisani (Benefactor)",
    amount: 500000,
    description: "Fund major events and outreach programs",
    features: ["All benefits", "VIP event access", "Personal thank you"]
  }
];

// Quick donation amounts in TSh
const quickDonationAmounts = [50000, 100000, 250000, 500000];

const Donation = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Support Our Ministry
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your generous donations help us continue spreading God's love through music, 
            supporting our choir members, and reaching communities with the message of hope and grace.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Tax Deductible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>100% Goes to Ministry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Donation Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Make a Quick Donation</h2>
            <p className="text-muted-foreground">Choose an amount or enter your own</p>
          </div>
          
          <Card className="border-primary/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {quickDonationAmounts.map((amount) => (
                  <Button key={amount} variant="outline" className="h-12 text-lg font-semibold">
                    {formatTZS(amount)}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="custom-amount">Custom Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="custom-amount" placeholder="Enter amount in TSh" className="pl-10" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="donation-frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One-time (Mara moja)</SelectItem>
                      <SelectItem value="monthly">Monthly (Kila mwezi)</SelectItem>
                      <SelectItem value="quarterly">Quarterly (Robo mwaka)</SelectItem>
                      <SelectItem value="annually">Annually (Kila mwaka)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea id="message" placeholder="Leave a message or prayer request" className="h-20" />
                </div>
              </div>
              
              <Button className="w-full h-12 text-lg font-semibold">
                Donate Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Donation Tiers</h2>
            <p className="text-muted-foreground">Choose a giving level that works for you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier, index) => {
              const IconComponent = tier.icon;
              return (
                <Card key={index} className="text-center hover:shadow-warm transition-all duration-300 border-primary/20">
                  <CardHeader>
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-xl">{tier.title}</CardTitle>
                    <div className="text-3xl font-bold text-primary">{formatTZS(tier.amount)}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{tier.description}</p>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">
                      Choose {tier.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Your Impact</h2>
            <p className="text-muted-foreground">See how your donations make a difference</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Equipment & Instruments</h3>
              <p className="text-muted-foreground">Your donations help us maintain and upgrade our musical instruments and sound equipment</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community Outreach</h3>
              <p className="text-muted-foreground">Support our mission to reach communities and share God's love through music ministry</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Member Support</h3>
              <p className="text-muted-foreground">Help cover transportation, training, and other expenses for our dedicated choir members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donation;

