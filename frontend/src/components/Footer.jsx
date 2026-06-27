import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, MapPin, Phone, Mail, Clock, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-400 border-t border-accent/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Utensils className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold tracking-widest text-white font-serif uppercase">
                Aroma <span className="text-accent">Spices</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Experience the true taste of Andhra's culinary heritage. We serve hot, premium, and authentic flavours crafted by expert chefs.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-primary/20 text-accent border border-accent/20 rounded text-xs uppercase tracking-widest font-medium">
                FSSAI Certified
              </span>
            </div>
          </div>

          {/* Opening Hours Col */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold uppercase tracking-widest border-b border-accent/15 pb-2 inline-block">
              Opening Hours
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-accent mt-0.5" />
                <div>
                  <p className="text-white font-medium">Monday - Sunday</p>
                  <p className="text-xs text-gray-500">11:00 AM - 11:00 PM</p>
                </div>
              </li>
              <li className="text-xs text-accent">
                * Note: Kitchen closes at 10:45 PM
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-white text-base font-semibold uppercase tracking-widest border-b border-accent/15 pb-2 inline-block">
              Locate & Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <span className="leading-relaxed text-gray-500">
                  Aroma Spices, PP2R+JX, S. Maidukuru, Andhra Pradesh 516172, India
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span className="text-white font-medium">+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span>info@aromaspices.com</span>
              </li>
            </ul>
          </div>

          {/* Links Col */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold uppercase tracking-widest border-b border-accent/15 pb-2 inline-block">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-sm flex flex-col">
              <Link to="/about" className="hover:text-accent transition-colors duration-200">About Our Kitchen</Link>
              <Link to="/menu" className="hover:text-accent transition-colors duration-200">View Category Menu</Link>
              <Link to="/gallery" className="hover:text-accent transition-colors duration-200">Photo Gallery</Link>
              <Link to="/reserve" className="hover:text-accent transition-colors duration-200">Online Table Booking</Link>
              <Link to="/contact" className="hover:text-accent transition-colors duration-200">Get In Touch</Link>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} Aroma Spices Restaurant. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="flex items-center space-x-1 text-gray-600 hover:text-accent transition-colors">
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
