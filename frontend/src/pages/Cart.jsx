import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Calendar, Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [orderType, setOrderType] = useState('delivery'); // delivery, takeaway, dinein
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Default Restaurant WhatsApp Number (Aroma Spices Restaurant)
  const RESTAURANT_WHATSAPP_NUMBER = '919573145154'; 

  const handleQuantityChange = (id, size, change) => {
    const item = cartItems.find(i => i.id === id && i.selectedSize === size);
    if (item) {
      updateQuantity(id, size, item.quantity + change);
    }
  };

  const handleRemove = (id, size) => {
    removeFromCart(id, size);
  };

  const handleCheckout = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please fill in your Name and Phone Number.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter your Delivery Address.');
      return;
    }

    // Build the WhatsApp message template
    let message = `*🍽️ AROMA SPICES RESTAURANT ORDER* \n`;
    message += `===============================\n\n`;
    message += `👤 *Customer Name:* ${customerName}\n`;
    message += `📞 *Phone Number:* ${customerPhone}\n`;
    message += `🚚 *Order Type:* ${orderType.toUpperCase()}\n`;
    
    if (orderType === 'delivery') {
      message += `📍 *Delivery Address:* ${deliveryAddress}\n`;
    }
    
    if (specialInstructions.trim()) {
      message += `📝 *Instructions:* ${specialInstructions}\n`;
    }
    
    message += `\n*🛒 ITEMS ORDERED:*\n`;
    message += `-------------------------------\n`;

    let itemIndex = 1;
    let dishesTotal = 0;
    let hasBooking = false;
    let bookingDetails = '';

    cartItems.forEach((item) => {
      if (item.isBooking) {
        hasBooking = true;
        bookingDetails = `📅 *Table Reservation Details:*\n`;
        bookingDetails += `  - Date: ${item.date}\n`;
        bookingDetails += `  - Time: ${item.time}\n`;
        bookingDetails += `  - Guests: ${item.guests}\n`;
        if (item.specialRequests) {
          bookingDetails += `  - Requests: ${item.specialRequests}\n`;
        }
        bookingDetails += `\n`;
      } else {
        const itemPrice = item.price;
        const subtotal = itemPrice * item.quantity;
        dishesTotal += subtotal;
        
        const sizeText = item.selectedSize ? ` (${item.selectedSize})` : '';
        message += `${itemIndex}. *${item.name}${sizeText}* \n`;
        message += `   Qty: ${item.quantity} x ₹${itemPrice} = *₹${subtotal}*\n`;
        itemIndex++;
      }
    });

    if (itemIndex > 1) {
      message += `-------------------------------\n`;
      message += `💰 *Food Bill Total:* ₹${dishesTotal}\n\n`;
    }

    if (hasBooking) {
      message += bookingDetails;
    }

    message += `===============================\n`;
    message += `Thank you! Please confirm my order and share the ETA.`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${RESTAURANT_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Clear cart and redirect
    clearCart();
    window.open(whatsappUrl, '_blank');
  };

  const bookingItem = cartItems.find(item => item.isBooking);
  const dishItems = cartItems.filter(item => !item.isBooking);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4 space-y-6">
          <div className="inline-flex p-6 bg-primary/10 rounded-full border border-accent/20 text-accent mb-2">
            <ShoppingBag size={48} />
          </div>
          <h2 className="text-3xl font-bold font-serif text-white">Your Cart is Empty</h2>
          <p className="text-gray-400 text-sm">You have not added any delicious Andhra dishes or table bookings yet.</p>
          <div className="pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-accent hover:bg-accent/90 text-dark font-bold uppercase tracking-wider text-xs rounded transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Browse Our Menu</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h1 className="text-xs uppercase tracking-widest text-accent font-semibold font-sans">Checkout</h1>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white">Your Cart</p>
          <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Contents Section (Left) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-lg space-y-6">
              <h3 className="text-lg font-bold font-serif border-b border-white/5 pb-3 text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-accent" />
                <span>Review Order Details</span>
              </h3>

              {/* Display Bookings */}
              {bookingItem && (
                <div className="bg-primary/10 border border-accent/20 rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between border-b border-accent/10 pb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className="text-accent" />
                      <h4 className="font-bold text-white text-sm uppercase tracking-wider">Table Reservation</h4>
                    </div>
                    <button
                      onClick={() => handleRemove(bookingItem.id, null)}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                      title="Remove Booking"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider font-semibold">Date</p>
                      <p className="text-white font-medium mt-0.5">{bookingItem.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider font-semibold">Time</p>
                      <p className="text-white font-medium mt-0.5">{bookingItem.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 uppercase tracking-wider font-semibold">Guests</p>
                      <p className="text-white font-medium mt-0.5">{bookingItem.guests} Person(s)</p>
                    </div>
                  </div>
                  {bookingItem.specialRequests && (
                    <div className="text-xs pt-1 border-t border-accent/5">
                      <span className="text-gray-500 font-semibold">Special Requests: </span>
                      <span className="text-gray-300 italic">"{bookingItem.specialRequests}"</span>
                    </div>
                  )}
                </div>
              )}

              {/* Display Dishes list */}
              {dishItems.length > 0 ? (
                <div className="divide-y divide-white/5 space-y-4">
                  {dishItems.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-start justify-between pt-4 first:pt-0">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`w-3 h-3 border flex items-center justify-center shrink-0 ${
                            item.isVeg ? 'border-green-600' : 'border-red-600'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              item.isVeg ? 'bg-green-600' : 'bg-red-600'
                            }`} />
                          </span>
                          <h4 className="font-bold text-white font-serif">{item.name}</h4>
                        </div>
                        <p className="text-xs text-accent">
                          ₹{item.price} {item.selectedSize && <span className="text-gray-500">({item.selectedSize})</span>}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity adjuster */}
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-md p-0.5">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedSize, -1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-semibold text-white">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedSize, 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <span className="text-sm font-bold text-white min-w-16 text-right">
                          ₹{item.price * item.quantity}
                        </span>

                        {/* Delete btn */}
                        <button
                          onClick={() => handleRemove(item.id, item.selectedSize)}
                          className="text-gray-500 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !bookingItem && <p className="text-gray-500 text-sm italic py-4">No dishes added to your order.</p>
              )}

              {/* Total Summary Footer */}
              {dishItems.length > 0 && (
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-white">
                  <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">Total Food Bill:</span>
                  <span className="text-2xl font-black text-accent font-serif">₹{cartTotal}</span>
                </div>
              )}
            </div>
            
            <div className="text-left">
              <Link to="/menu" className="inline-flex items-center space-x-1.5 text-xs text-accent hover:text-accent/80 font-bold uppercase tracking-wider">
                <ArrowLeft size={12} />
                <span>Add More Items</span>
              </Link>
            </div>
          </div>

          {/* Form Checkout Section (Right) */}
          <div className="lg:col-span-5">
            <form onSubmit={handleCheckout} className="glass-panel p-6 rounded-lg space-y-5 text-left">
              <h3 className="text-lg font-bold font-serif border-b border-white/5 pb-3 text-white">
                Delivery Details
              </h3>

              {/* Order Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Order Type</label>
                <div className="grid grid-cols-3 gap-2 bg-black/40 border border-white/10 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 text-center text-xs rounded font-semibold uppercase tracking-wider transition-all ${
                      orderType === 'delivery' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2 text-center text-xs rounded font-semibold uppercase tracking-wider transition-all ${
                      orderType === 'takeaway' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Takeaway
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('dinein')}
                    className={`py-2 text-center text-xs rounded font-semibold uppercase tracking-wider transition-all ${
                      orderType === 'dinein' ? 'bg-primary text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Dine-In
                  </button>
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>

              {/* Customer Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 95731 45154"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>

              {/* Delivery Address (only if delivery selected) */}
              {orderType === 'delivery' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Delivery Address *</label>
                  <textarea
                    required
                    placeholder="Enter your full street address, flat number, and landmark..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-md px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent h-20 resize-none"
                  />
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Special Instructions</label>
                <textarea
                  placeholder="e.g. Make it extra spicy, call before delivery, no onion/garlic..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-md px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent h-20 resize-none"
                />
              </div>

              {/* Checkout Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-accent hover:bg-accent-hover text-dark font-black uppercase tracking-widest text-xs rounded-md shadow-lg shadow-accent/20 hover:shadow-accent/40 flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                <Send size={14} />
                <span>Confirm via WhatsApp</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
