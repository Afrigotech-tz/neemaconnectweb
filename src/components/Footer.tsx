import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-hero text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Changed grid to accommodate 5 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <img src="/lovable-uploads/NGC-Logo-2.png" alt="NGC Logo" className="w-8 h-8 object-contain"/>
              </div>
              <span className="font-bold text-lg">Neema Gospel Choir</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Spreading the message of hope and love through powerful gospel music. 
              Join us in worship and celebration as we lift our voices to glorify God.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/about" },
                { name: "Events", path: "/events" },
                { name: "Partner", path: "/partner" },
                { name: "Blog", path: "/blog" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-sm text-primary-foreground/80 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Services</h3>
            <ul className="space-y-2">
              {[
                "Wedding Performances",
                "Corporate Events",
                "Church Services",
                "Community Outreach",
                "Music Ministry",
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-primary-foreground/80">{service}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* NEW: Sponsors Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Our Sponsors</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              <b>Neema Gospel Choir</b> is a passionate music ministry under the Africa Inland Church <b>(AICT)</b>, 
              dedicated to spreading the Gospel of Jesus Christ through powerful worship and uplifting songs.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/lovable-uploads/AIC-MAIN.png" 
                  alt="AIC Main Sponsor Logo" 
                  className="h-12 w-auto p-1 rounded-md object-contain hover:opacity-80 transition-opacity"
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <img 
                  src="/lovable-uploads/neema.png" 
                  alt="Neema Sponsor Logo" 
                  className="h-12 w-auto p-1 rounded-md object-contain hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
            <p className="text-xs text-primary-foreground/60 italic">
              Interested in becoming a sponsor? Contact us to learn about partnership opportunities.
            </p>
          </div>
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">
                  123 Temeke<br />
                  Dar es salaam, Tanzania.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">+255 (743) 87-1360</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">info@neemagospelchoir.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-sm text-primary-foreground/80">
            © 2025 Neema Gospel Choir. All rights reserved. Made with  for spreading God's love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;