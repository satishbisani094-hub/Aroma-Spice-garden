import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, AlignLeft, User, Phone, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    specialRequest: ''
  });

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.guests) {
      setError('Please fill in Date, Time, and Number of Guests.');
      return;
    }

    addToCart({
      id: 'table_booking',
      name: 'Table Reservation',
      isBooking: true,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
      specialRequests: formData.specialRequest
    });

    // Take them straight to the cart checkout page
    navigate('/cart');
  };

  // Get current date in YYYY-MM-DD format to set min attribute (prevent past bookings)
  const getTodayDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="bg-dark pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-xs uppercase tracking-widest text-accent font-semibold">Online Booking</h1>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white">Reserve A Table</p>
          <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
        </div>

        {ticket ? (
          /* Ticket Summary View */
          <div className="glass-panel p-8 rounded-lg border border-accent/30 bg-primary/5 space-y-6 max-w-2xl mx-auto animate-fade-in-up">
            <div className="text-center space-y-2 pb-6 border-b border-white/10">
              <CheckCircle className="h-14 w-14 text-accent mx-auto" />
              <h2 className="text-2xl font-bold font-serif text-white">Reservation Request Sent!</h2>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Your Booking Code: #{ticket.id ? ticket.id.toUpperCase() : 'PENDING'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-xs block">Guest Name</span>
                <span className="text-white font-medium text-base">{ticket.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-xs block">Phone Number</span>
                <span className="text-white font-medium text-base">{ticket.phone}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-xs block">Date of Visit</span>
                <span className="text-white font-medium text-base">{ticket.date}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-xs block">Preferred Time</span>
                <span className="text-white font-medium text-base">{ticket.time}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-xs block">Total Guests</span>
                <span className="text-accent font-bold text-base">{ticket.guests} People</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 uppercase tracking-wider text-xs block">Status</span>
                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-semibold uppercase tracking-widest rounded inline-block">
                  {ticket.status.toUpperCase()}
                </span>
              </div>
            </div>

            {ticket.specialRequest && (
              <div className="p-4 bg-black/40 rounded border border-white/5 text-sm">
                <span className="text-gray-500 uppercase tracking-wider text-xs block mb-1">Special Request</span>
                <p className="text-gray-300 font-light italic">"{ticket.specialRequest}"</p>
              </div>
            )}

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs text-gray-500">
              <p>* We will call or SMS you shortly to confirm your booking.</p>
              <button
                onClick={() => setTicket(null)}
                className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-dark font-semibold rounded uppercase tracking-wider transition-colors"
              >
                Book Another Table
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form View */
          <div className="glass-panel p-8 rounded-lg space-y-6 max-w-2xl mx-auto">
            <p className="text-center text-sm text-gray-400 leading-relaxed">
              Book your lunch or dinner table online. For groups larger than 12 guests, please contact us directly via phone.
            </p>

            {error && (
              <div className="bg-red-950/40 border border-red-500/30 text-red-300 p-4 rounded-md flex items-center space-x-2 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center space-x-1">
                    <User className="h-3.5 w-3.5 text-accent" />
                    <span>Your Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-accent" />
                    <span>Contact Number</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9573145154"
                    className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    <span>Select Date</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={getTodayDate()}
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full border border-white/10 rounded-md bg-black/40 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                    <span>Select Time</span>
                  </label>
                  <select
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full border border-white/10 rounded-md bg-black/40 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="" disabled>Choose Slot</option>
                    <optgroup label="Lunch Slots">
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="12:30 PM">12:30 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                    </optgroup>
                    <optgroup label="Dinner Slots">
                      <option value="07:00 PM">07:00 PM</option>
                      <option value="07:30 PM">07:30 PM</option>
                      <option value="08:00 PM">08:00 PM</option>
                      <option value="08:30 PM">08:30 PM</option>
                      <option value="09:00 PM">09:00 PM</option>
                      <option value="09:30 PM">09:30 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                      <option value="10:30 PM">10:30 PM</option>
                    </optgroup>
                  </select>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center space-x-1">
                    <Users className="h-3.5 w-3.5 text-accent" />
                    <span>Number of Guests</span>
                  </label>
                  <select
                    name="guests"
                    required
                    value={formData.guests}
                    onChange={handleChange}
                    className="block w-full border border-white/10 rounded-md bg-black/40 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4 People</option>
                    <option value="5">5 People</option>
                    <option value="6">6 People</option>
                    <option value="7">7 People</option>
                    <option value="8">8 People</option>
                    <option value="9">9 People</option>
                    <option value="10">10 People</option>
                    <option value="11">11 People</option>
                    <option value="12">12 People (Max Online)</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1.5 flex items-center space-x-1">
                  <AlignLeft className="h-3.5 w-3.5 text-accent" />
                  <span>Special Request (Optional)</span>
                </label>
                <textarea
                  name="specialRequest"
                  rows="3"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="e.g. High-chair for kids, wheelchair access, window table, birthday setup..."
                  className="block w-full border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-600 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-accent hover:bg-accent-hover text-dark font-bold rounded-md uppercase tracking-wider transition-colors disabled:opacity-50 mt-6 shadow-lg shadow-accent/25 hover:shadow-accent/40"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending booking request...</span>
                  </>
                ) : (
                  <span>Request Table Reservation</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reservation;
