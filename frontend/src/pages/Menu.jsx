import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { defaultMenuItems } from '../config/defaultMenu';
import { Search, Loader2, Info, CheckCircle, AlertTriangle, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState('all'); // all, veg, non-veg
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => {
      const current = prev[itemId] || 1;
      const nextVal = current + change;
      return { ...prev, [itemId]: nextVal > 0 ? nextVal : 1 };
    });
  };

  const handleOrderClick = (item) => {
    let size = null;
    let price = item.price || 150;
    const qty = quantities[item.id] || 1;

    if (item.prices && typeof item.prices === 'object') {
      size = selectedSizes[item.id] || Object.keys(item.prices)[0];
      price = item.prices[size];
    }

    addToCart({
      id: item.id,
      name: item.name,
      price: price,
      selectedSize: size ? size.toUpperCase() : null,
      isVeg: item.isVeg,
      isBooking: false,
      quantity: qty
    });

    setAddedItems(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [item.id]: false }));
      setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    }, 1500);
  };

  const categories = [
    'All',
    'Non Veg Biryanis',
    'Combos & Jumbo Packs',
    'Veg Biryanis',
    'Soups',
    'Tandoori Veg Starters',
    'Tandoori Non Veg Starters',
    'Chinese Veg Starters',
    'Egg Starters',
    'Veg Curries',
    'Egg Curries',
    'Non Veg Curries',
    'Chinese Non Veg Starters',
    'Andhra Specials',
    'Rotis',
    'Fried Rice & Noodles',
    'Beverages & Mojitos',
    'Milkshakes',
    'Ice Creams'
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await apiService.getMenu();
        if (data && data.length > 0) {
          setMenuItems(data);
        } else {
          // Fallback to default menu items imported from backend config
          setMenuItems(defaultMenuItems.map((item, idx) => ({ id: `dish_${idx + 1}`, ...item })));
        }
      } catch (err) {
        console.warn('API error, using local fallback:', err.message);
        // Fallback to default menu items on error
        setMenuItems(defaultMenuItems.map((item, idx) => ({ id: `dish_${idx + 1}`, ...item })));
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Filter items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    let matchesVeg = true;
    if (vegFilter === 'veg') matchesVeg = item.isVeg === true;
    if (vegFilter === 'non-veg') matchesVeg = item.isVeg === false;

    return matchesSearch && matchesCategory && matchesVeg;
  });

  return (
    <div className="bg-dark pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h1 className="text-xs uppercase tracking-widest text-accent font-semibold">Our Selection</h1>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white">The Aroma Menu</p>
          <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
        </div>

        {/* Controls: Search & Filters */}
        <div className="glass-panel p-6 rounded-lg mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search dishes (e.g. Biryani, Paneer)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-md bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm"
            />
          </div>

          {/* Veg/Non-Veg Filter Buttons */}
          <div className="flex bg-black/40 border border-white/10 rounded-md p-1 shrink-0">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                vegFilter === 'all' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                vegFilter === 'veg' ? 'bg-green-700 text-white' : 'text-gray-400 hover:text-green-500'
              }`}
            >
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block" />
              <span>Veg Only</span>
            </button>
            <button
              onClick={() => setVegFilter('non-veg')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center space-x-1.5 ${
                vegFilter === 'non-veg' ? 'bg-red-800 text-white' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block" />
              <span>Non-Veg</span>
            </button>
          </div>
        </div>

        {/* Categories Strip */}
        <div className="mb-12 overflow-x-auto no-scrollbar scroll-smooth flex space-x-3 py-2 border-b border-white/5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-md text-sm uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === cat
                  ? 'bg-accent text-dark border-accent shadow-md shadow-accent/20'
                  : 'bg-dark-light text-gray-300 border-white/5 hover:border-accent/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-accent" />
            <p className="text-gray-400 text-sm">Crafting menu cards...</p>
          </div>
        ) : (
          <div>
            {/* Menu Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-dark-light rounded-lg border border-white/5">
                <Info className="h-12 w-12 text-accent mx-auto mb-4" />
                <p className="text-white text-lg font-bold font-serif">No dishes found</p>
                <p className="text-gray-500 text-sm mt-1">Try expanding your search query or selecting another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass-panel p-6 rounded-lg flex flex-col justify-between border border-accent/10 hover:border-accent/30 transition-all duration-300 group"
                  >
                    <div className="space-y-3">
                      {/* Title & Veg icon */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${
                            item.isVeg ? 'border-green-600' : 'border-red-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? 'bg-green-600' : 'bg-red-600'
                            }`} />
                          </span>
                          <h3 className="text-xl font-bold text-white font-serif group-hover:text-accent transition-colors">
                            {item.name}
                          </h3>
                        </div>
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-400 leading-relaxed font-light">
                        {item.description || "Freshly cooked to order with authentic Guntur seasonings and local Andhra spices."}
                      </p>
                    </div>

                    {/* Pricing section */}
                    <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between w-full">
                      <div className="flex flex-wrap items-center gap-4">
                        {item.prices && typeof item.prices === 'object' ? (
                          <div className="flex items-center space-x-2">
                            <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Size:</label>
                            <select
                              value={selectedSizes[item.id] || Object.keys(item.prices)[0]}
                              onChange={(e) => setSelectedSizes(prev => ({ ...prev, [item.id]: e.target.value }))}
                              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent"
                            >
                              {Object.keys(item.prices).map(sz => (
                                <option key={sz} value={sz}>{sz.charAt(0).toUpperCase() + sz.slice(1)} - ₹{item.prices[sz]}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-accent font-serif">₹{item.price || 150}</p>
                        )}

                        {/* Quantity adjustor block on menu card */}
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-md p-0.5">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-2 text-xs font-semibold text-white">{quantities[item.id] || 1}</span>
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="p-1 text-gray-400 hover:text-white transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleOrderClick(item)}
                        className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded transition-all cursor-pointer ${
                          addedItems[item.id] 
                            ? 'bg-green-700 text-white border border-green-600 animate-pulse'
                            : 'bg-primary/20 hover:bg-primary text-white border border-accent/20 hover:border-accent'
                        }`}
                      >
                        {addedItems[item.id] ? 'Added ✓' : 'Add to Order'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
