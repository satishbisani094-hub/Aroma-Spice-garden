import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Star, Award, Users, Heart, Zap } from 'lucide-react';
import Contact from './Contact';

const Home = () => {
  const features = [
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "Gardens",
      desc: "Beautiful open-air garden seating and premium dining ambiance."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Family Dining",
      desc: "Premium seating arrangement designed for family dinners and corporate groups."
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Fresh Ingredients",
      desc: "Sourced daily to ensure freshness, hygiene, and excellent food quality."
    },
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: "Fast Service",
      desc: "Warm hospitality and quick table service so you enjoy fresh-from-the-kitchen meals."
    }
  ];

  const reviews = [
    {
      name: "Ramesh Kumar",
      rating: 5,
      comment: "Absolutely mouth-watering! The Hyderabadi Dum Biryani had the perfect aroma and tenderness. A must-visit place for Biryani lovers in Maidukuru."
    },
    {
      name: "Lakshmi Prasanna",
      rating: 5,
      comment: "The Gongura Mutton Biryani is exceptional. Tastes like real home-cooked food. Highly clean kitchen and friendly staff. 10/10 recommend."
    },
    {
      name: "Sandeep V.",
      rating: 5,
      comment: "Best restaurant in this area! The Andhra Chicken curry is spicy and loaded with flavors. Perfect ambiance for a family dinner."
    }
  ];

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* 1. HERO SECTION */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-dark z-10" />
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600"
            alt="Aroma Spices Dining Room"
            className="w-full h-full object-cover scale-105 animate-pulse"
            style={{ animationDuration: '6s' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/20 border border-accent/30 rounded-full text-accent text-xs uppercase tracking-widest font-semibold animate-fade-in-up">
            <Star className="h-3 w-3 fill-current" />
            <span>Welcome to Aroma Spices</span>
            <Star className="h-3 w-3 fill-current" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-serif animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Aroma <span className="text-gold-gradient">Spices</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 tracking-wider max-w-3xl mx-auto font-sans font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            "Authentic Andhra Flavours & Premium Dining Experience"
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/menu"
              className="w-full sm:w-auto px-8 py-3.5 bg-accent hover:bg-accent-hover text-dark font-semibold rounded-md uppercase tracking-wider transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 cursor-pointer flex items-center justify-center"
            >
              View Menu
            </Link>
            <Link
              to="/reserve"
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md uppercase tracking-wider border border-accent/40 hover:border-accent transition-all duration-300 cursor-pointer flex items-center justify-center"
            >
              Book A Table
            </Link>
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto px-8 py-3.5 bg-black/50 hover:bg-black/80 text-white font-semibold rounded-md uppercase tracking-wider border border-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Phone className="h-4 w-4 text-accent" />
              <span>Call Restaurant</span>
            </a>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-accent/50 animate-bounce">
          <span className="text-xs uppercase tracking-widest block mb-1">Scroll</span>
          <div className="h-6 w-0.5 bg-accent/50 mx-auto" />
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="py-20 bg-dark border-b border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-accent font-semibold">Our Specialties</h2>
            <p className="text-3xl md:text-4xl font-bold font-serif text-white">Why Dine With Aroma Spices?</p>
            <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-8 rounded-lg flex flex-col items-center text-center space-y-4 transition-all duration-300"
              >
                <div className="p-4 bg-primary/10 rounded-full border border-accent/20">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{feat.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subpages removed for Multi-Page architecture. Subpages are accessible via Navigation header. */}

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-24 bg-dark border-t border-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-accent font-semibold">Testimonials</h2>
            <p className="text-3xl md:text-4xl font-bold font-serif text-white">What Our Guests Say</p>
            <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-lg flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-accent">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic leading-relaxed">"{rev.comment}"</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-sm text-white font-semibold">{rev.name}</span>
                  <span className="text-xs text-accent uppercase tracking-widest">Verified Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT & MAP SECTION */}
      <section id="contact">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
