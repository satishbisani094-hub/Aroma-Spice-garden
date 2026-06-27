import React, { useState } from 'react';
import { apiService } from '../services/api';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiService.createQuery(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Contact submission error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: <MapPin className="h-6 w-6 text-accent" />,
      title: "Our Address",
      desc: "Aroma Spices, PP2R+JX, S. Maidukuru, Andhra Pradesh 516172, India",
      action: "https://maps.google.com/?q=Aroma+Spices+Maidukuru",
      actionLabel: "Get Directions"
    },
    {
      icon: <Phone className="h-6 w-6 text-accent" />,
      title: "Call Us Directly",
      desc: "+91 98765 43210 / +91 98765 01234",
      action: "tel:+919876543210",
      actionLabel: "Call Now"
    },
    {
      icon: <Mail className="h-6 w-6 text-accent" />,
      title: "Email Inquiry",
      desc: "info@aromaspices.com / support@aromaspices.com",
      action: "mailto:info@aromaspices.com",
      actionLabel: "Send Email"
    }
  ];

  return (
    <div className="bg-dark-light pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h1 className="text-xs uppercase tracking-widest text-accent font-semibold">Contact Us</h1>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white">We'd Love To Hear From You</p>
          <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactCards.map((card, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-lg flex flex-col justify-between items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 border border-accent/20 rounded-full">
                {card.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-serif">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{card.desc}</p>
              </div>
              <a
                href={card.action}
                target={card.action.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-accent hover:text-white uppercase tracking-wider text-xs font-semibold pt-2 inline-block transition-colors border-b border-accent/30 hover:border-white"
              >
                {card.actionLabel}
              </a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          {/* Map */}
          <div className="w-full h-[450px] rounded-lg overflow-hidden border border-accent/20 shadow-lg lg:order-2">
            <iframe
              title="Aroma Spices Contact Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.8837130773824!2d78.7844005!3d14.8315994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDQ5JzUzLjciTiA3OMKwNDcnMDMuOCJFOg!5e0!3m2!1sen!2sin!4v1624519992000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>

          {/* Form */}
          <div className="glass-panel p-8 rounded-lg space-y-6 lg:order-1">
            <h3 className="text-2xl font-bold font-serif text-white">Send Us A Message</h3>
            
            {success ? (
              <div className="bg-green-950/40 border border-green-500/30 text-green-300 p-6 rounded-md text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <h4 className="text-lg font-bold font-serif">Thank You!</h4>
                <p className="text-sm">Your message has been sent successfully. We will get back to you shortly.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-xs text-accent font-semibold uppercase tracking-widest hover:text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-950/40 border border-red-500/30 text-red-300 p-4 rounded-md flex items-center space-x-2 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                      className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +91 9876543210"
                      className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Table Booking Query"
                      className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Your Message</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your feedback, question, or request..."
                    className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-accent hover:bg-accent-hover text-dark font-semibold rounded-md uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* WhatsApp banner */}
        <div className="glass-panel p-8 rounded-lg flex flex-col md:flex-row justify-between items-center gap-6 border-accent/20 bg-primary/10">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold font-serif text-white">Prefer Instant Chat?</h4>
            <p className="text-sm text-gray-400">Connect with our support team on WhatsApp for immediate response regarding party bookings.</p>
          </div>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded font-bold uppercase tracking-wider transition-colors"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Contact;
