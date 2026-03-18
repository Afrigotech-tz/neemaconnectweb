import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useContact } from "@/hooks/useContact";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/services/contactService/contactService";

const Contact = () => {
  const { contactInfo, fetchContactInfo } = useContact();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  const splitName = (fullName: string): { firstName: string; lastName: string } => {
    const trimmed = fullName.trim();
    if (!trimmed) return { firstName: "", lastName: "" };

    const parts = trimmed.split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ") || "-";
    return { firstName, lastName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName } = splitName(formData.name);

    if (!firstName) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await contactService.createUserMessage({
        first_name: firstName,
        last_name: lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject,
        message: formData.message,
      });

      if (response.success) {
        toast({
          title: "Message sent",
          description: response.message || "Your message has been received.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Failed to send",
          description: response.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Failed to send",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: MapPin,
      title: "Address",
      detail: contactInfo?.address || "123 Gospel Street, Music City",
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Phone",
      detail: contactInfo?.phone || "+255 743 871 360",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email",
      detail: contactInfo?.email || "info@neemagospelchoir.com",
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Office Hours",
      detail: contactInfo?.office_hours || "Monday - Friday: 9 AM - 5 PM",
      action: "Schedule Visit"
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            We'd love to hear from you! Whether you're interested in joining our choir, booking a performance, or just want to say hello, get in touch.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactCards.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <Card key={index} className="text-center hover:shadow-warm transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-foreground font-medium mb-1">{info.detail}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      {info.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 743 871 360"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <select
                      id="subject"
                      className="w-full p-3 border border-input rounded-md bg-background"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Performance Booking">Performance Booking</option>
                      <option value="Joining the Choir">Joining the Choir</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Donation">Donation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px]"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map and Quick Contact */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <Card className="overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Interactive map coming soon</p>
                    <Button variant="outline" className="mt-2">
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Quick Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Contact</CardTitle>
                  <p className="text-muted-foreground">
                    Need immediate assistance? Reach out to us directly.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "General Inquiries", email: contactInfo?.email || "info@neemagospelchoir.com" },
                      { name: "Performance Bookings", email: "bookings@neemagospelchoir.com" },
                      { name: "Partnership Opportunities", email: "partners@neemagospelchoir.com" },
                      { name: "Media & Press", email: "media@neemagospelchoir.com" },
                      { name: "Donations", email: "donations@neemagospelchoir.com" }
                    ].map((dept, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="font-medium">{dept.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => window.location.href = `mailto:${dept.email}`}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "How can I join the choir?",
                answer: "We welcome new members! Contact us to schedule an audition or attend one of our open rehearsals."
              },
              {
                question: "Do you perform at private events?",
                answer: "Yes! We perform at weddings, corporate events, and special celebrations. Contact our booking team for availability."
              },
              {
                question: "What are your rehearsal times?",
                answer: "We rehearse every Tuesday and Thursday from 7-9 PM, with additional rehearsals before major performances."
              },
              {
                question: "Is there a cost to join?",
                answer: "There are no membership fees, but we do ask for a commitment to regular attendance and participation in fundraising activities."
              }
            ].map((faq, index) => (
              <Card key={index} className="hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
