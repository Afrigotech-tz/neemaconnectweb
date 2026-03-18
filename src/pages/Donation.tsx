import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Heart, DollarSign, Users, Award, Music, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatTZS } from '@/lib/currency';
import { donationService } from '@/services/donationService';
import { DonationCategory } from '@/types/donationTypes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { paymentService } from '@/services/paymentService';
import { PaymentMethod } from '@/types/paymentTypes';

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
  const { toast } = useToast();
  const { user } = useAuth();
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [submittingDonation, setSubmittingDonation] = useState(false);
  const [campaigns, setCampaigns] = useState<DonationCategory[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState({
    donorName: user ? `${user.first_name} ${user.surname}`.trim() : "",
    donorEmail: user?.email || "",
    donorPhone: user?.phone_number || "",
    amount: 0,
    frequency: "once",
    campaignId: "",
    paymentMethod: "mobile_money",
    message: "",
  });

  const normalizeCollection = <T,>(payload: unknown): T[] => {
    if (Array.isArray(payload)) return payload as T[];
    if (payload && typeof payload === "object" && "data" in (payload as { data?: unknown })) {
      const inner = (payload as { data?: unknown }).data;
      if (Array.isArray(inner)) return inner as T[];
      if (inner && typeof inner === "object" && "data" in (inner as { data?: unknown })) {
        const nested = (inner as { data?: unknown }).data;
        if (Array.isArray(nested)) return nested as T[];
      }
    }
    return [];
  };

  useEffect(() => {
    const fetchCampaignsAndMethods = async () => {
      setLoadingCategories(true);
      setLoadingPaymentMethods(true);
      try {
        const [categoryResponse, paymentMethodsResponse] = await Promise.all([
          donationService.getCategories(),
          paymentService.getPaymentMethods(),
        ]);

        if (categoryResponse.success) {
          const categories = normalizeCollection<DonationCategory>(categoryResponse.data);
          setCampaigns(categories);
          if (!formData.campaignId && categories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              campaignId: String(categories[0].id),
            }));
          }
        } else {
          setCampaigns([]);
        }

        if (paymentMethodsResponse.success) {
          const methods = normalizeCollection<PaymentMethod>(paymentMethodsResponse.data);
          setPaymentMethods(methods);
          if (methods.length > 0) {
            setFormData((prev) => ({
              ...prev,
              paymentMethod: methods[0].type || methods[0].name,
            }));
          }
        } else {
          setPaymentMethods([]);
        }

        if (!categoryResponse.success && !paymentMethodsResponse.success) {
          toast({
            title: "Donation setup warning",
            description: "Unable to load campaign and payment options. You can still donate by entering campaign ID.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Donation setup warning",
          description: "Unable to load campaign and payment options. You can still donate by entering campaign ID.",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
        setLoadingPaymentMethods(false);
      }
    };

    void fetchCampaignsAndMethods();
  }, []);

  const handleQuickAmountSelect = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount }));
  };

  const handleDonationSubmit = async () => {
    const campaignId = Number(formData.campaignId);

    if (!formData.donorName.trim() || !formData.donorEmail.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide your name and email before donating.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.amount || formData.amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a donation amount greater than zero.",
        variant: "destructive",
      });
      return;
    }

    if (!Number.isFinite(campaignId) || campaignId <= 0) {
      toast({
        title: "Campaign required",
        description: "Please select a campaign or enter a valid campaign ID.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingDonation(true);
    try {
      const transactionReference = `WEB-${Date.now()}`;
      const response = await donationService.createDonation({
        campaign_id: campaignId,
        donor_name: formData.donorName.trim(),
        donor_email: formData.donorEmail.trim(),
        donor_phone: formData.donorPhone.trim() || undefined,
        amount: Number(formData.amount),
        currency: "TZS",
        payment_method: formData.paymentMethod,
        transaction_reference: transactionReference,
        message: formData.message
          ? `[${formData.frequency}] ${formData.message.trim()}`
          : `[${formData.frequency}] Donation submitted from website`,
      });

      if (response.success) {
        toast({
          title: "Donation submitted",
          description: response.message || "Thank you for supporting the ministry.",
        });
        setFormData((prev) => ({
          ...prev,
          amount: 0,
          message: "",
        }));
      } else {
        toast({
          title: "Donation failed",
          description: response.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Donation failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingDonation(false);
    }
  };

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
                  <Button
                    key={amount}
                    type="button"
                    variant={formData.amount === amount ? "default" : "outline"}
                    className="h-12 text-lg font-semibold"
                    onClick={() => handleQuickAmountSelect(amount)}
                  >
                    {formatTZS(amount)}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donor-name">Full Name</Label>
                    <Input
                      id="donor-name"
                      placeholder="Your full name"
                      value={formData.donorName}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, donorName: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="donor-email">Email Address</Label>
                    <Input
                      id="donor-email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.donorEmail}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, donorEmail: event.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="donor-phone">Phone (Optional)</Label>
                    <Input
                      id="donor-phone"
                      placeholder="+255 743 871 360"
                      value={formData.donorPhone}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, donorPhone: event.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign">Campaign</Label>
                    {campaigns.length > 0 ? (
                      <Select
                        value={formData.campaignId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, campaignId: value }))
                        }
                      >
                        <SelectTrigger id="campaign">
                          <SelectValue
                            placeholder={loadingCategories ? "Loading campaigns..." : "Select campaign"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {campaigns.map((campaign) => (
                            <SelectItem key={campaign.id} value={String(campaign.id)}>
                              {campaign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        <Input
                          id="campaign"
                          type="number"
                          min={1}
                          placeholder="Enter campaign ID"
                          value={formData.campaignId}
                          onChange={(event) =>
                            setFormData((prev) => ({ ...prev, campaignId: event.target.value }))
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Campaign list unavailable. Enter a valid campaign ID.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-amount">Custom Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="custom-amount"
                      type="number"
                      placeholder="Enter amount in TSh"
                      className="pl-10"
                      value={formData.amount || ""}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, amount: Number(event.target.value || 0) }))
                      }
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="donation-frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, frequency: value }))
                    }
                  >
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
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: value }))
                    }
                  >
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.length > 0 ? (
                        paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.type || method.name}>
                            {method.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="mobile_money">Mobile Money</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {loadingPaymentMethods && (
                    <p className="text-xs text-muted-foreground mt-1">Loading payment methods...</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Leave a message or prayer request"
                    className="h-20"
                    value={formData.message}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, message: event.target.value }))
                    }
                  />
                </div>
              </div>
              
              <Button
                className="w-full h-12 text-lg font-semibold"
                onClick={handleDonationSubmit}
                disabled={submittingDonation}
              >
                {submittingDonation ? "Submitting..." : "Donate Now"}
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
