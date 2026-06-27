import React from 'react';
import { ChefHat, ShieldCheck, Heart, Coffee, Star, ShieldAlert } from 'lucide-react';

const About = () => {
  const points = [
    {
      icon: <ChefHat className="h-8 w-8 text-accent" />,
      title: "Experienced Culinary Chefs",
      desc: "Our master chefs have years of training in traditional Andhra cooking styles, ensuring every dish captures the perfect balance of hot, spicy, and tangy flavors."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-accent" />,
      title: "100% Hygienic Kitchens",
      desc: "We prioritize safety and cleanliness. Our kitchens undergo daily deep sanitization, and staff follow strict health guidelines including mandatory gear."
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Family-Friendly Atmosphere",
      desc: "Enjoy comfortable, spacious seating designed to bring families closer. We have dedicated spaces for kids' safety and big family group gatherings."
    },
    {
      icon: <Coffee className="h-8 w-8 text-accent" />,
      title: "Quality Sourced Spices",
      desc: "We grind our own masalas! Authentic spices are sourced directly from Guntur and local spice gardens to maintain the rich heritage taste of S. Maidukuru."
    }
  ];

  return (
    <div className="bg-dark-light pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h1 className="text-xs uppercase tracking-widest text-accent font-semibold">About Us</h1>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white">Our Culinary Journey</p>
          <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-accent">The Story of Aroma Spices</h2>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
              Founded in S. Maidukuru, Aroma Spices was born out of a passion to preserve and celebrate the authentic culinary traditions of Andhra Pradesh. We believe that food is not just nourishment, but a celebration of culture, spice, and heritage.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              Our signature dishes—including our Chittimutyalu Biryani, Raju Gari Kodi Pulav, and Guntur Chicken Fry—are cooked using traditional copper vessels and authentic wood-fire techniques where possible to locked-in the natural aromas.
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent font-serif">10+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Secret Masalas</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-bold text-accent font-serif">100%</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Fresh Meat</p>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="text-center">
                <p className="text-3xl font-bold text-accent font-serif">150+</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">Seating Capacity</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg -rotate-3 transform -z-10" />
            <img
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600"
              alt="Kitchen cooking food"
              className="rounded-lg shadow-xl border border-accent/20 object-cover w-full h-[400px]"
            />
          </div>
        </div>

        {/* Quality Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {points.map((p, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-lg flex space-x-4 items-start">
              <div className="p-3 bg-primary/10 border border-accent/20 rounded-md shrink-0">
                {p.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-serif">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chefs section */}
        <div className="text-center space-y-6 max-w-4xl mx-auto pt-8 border-t border-white/5">
          <ChefHat className="h-12 w-12 text-accent mx-auto" />
          <h3 className="text-2xl font-bold font-serif text-white">Behind The Apron</h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
            "We believe in spices that talk to your soul. Our recipes have been handed down through generations and curated to deliver an unforgettable dining experience in Andhra Pradesh."
          </p>
          <span className="block text-accent font-serif text-sm tracking-widest font-medium uppercase">— Master Chef Soma Raju</span>
        </div>

      </div>
    </div>
  );
};

export default About;
