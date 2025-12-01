import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Gospel Street", "Music City, MC 12345"],
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+255 743 871 360", "Call us anytime"],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@neemagospelchoir.com", "We'll respond within 24 hours"],
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 9 AM - 5 PM", "Saturday: 10 AM - 2 PM"],
      action: "Schedule Visit"
    }
  ];

  const departments = [
    { name: "General Inquiries", email: "info@neemagospelchoir.com" },
    { name: "Performance Bookings", email: "bookings@neemagospelchoir.com" },
    { name: "Partnership Opportunities", email: "partners@neemagospelchoir.com" },
    { name: "Media & Press", email: "media@neemagospelchoir.com" },
    { name: "Donations", email: "donations@neemagospelchoir.com" }
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

      {/* Contact Information */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
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
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className={`${detailIndex === 0 ? 'text-foreground font-medium' : 'text-muted-foreground text-sm'} mb-1`}>
                        {detail}
                      </p>
                    ))}
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Your last name" />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="+255 743 871 360" />
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select 
                    id="subject" 
                    className="w-full p-3 border border-input rounded-md bg-background"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Performance Booking</option>
                    <option value="joining">Joining the Choir</option>
                    <option value="partnership">Partnership</option>
                    <option value="donation">Donation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us how we can help you..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
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

              {/* Quick Contact Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Contact</CardTitle>
                  <p className="text-muted-foreground">
                    Need immediate assistance? Contact the right department directly.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <span className="font-medium">{dept.name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10"
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