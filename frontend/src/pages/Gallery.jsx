import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { X, ZoomIn, Info, Loader2 } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  const categories = ['All', 'Food Gallery', 'Restaurant Interior', 'Customer Moments'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const data = await apiService.getGallery();
        setItems(data);
      } catch (err) {
        console.warn('API gallery error, fallback loaded:', err.message);
        // Fallback items if API is offline
        setItems([
          { id: '1', title: 'Hyderabadi Chicken Dum Biryani', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800' },
          { id: '2', title: 'Tandoori Starter Platter', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800' },
          { id: '3', title: 'Spicy Nellore Fish Curry', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800' },
          { id: '4', title: 'Family Dining Main Hall', category: 'Restaurant Interior', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800' },
          { id: '5', title: 'Cozy Dining Table setup', category: 'Restaurant Interior', image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800' },
          { id: '6', title: 'Happy Birthday Celebration', category: 'Customer Moments', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=800' },
          { id: '7', title: 'Anniversary Dinner Party', category: 'Customer Moments', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800' },
          { id: '8', title: 'Signature Cashew Paneer', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?q=80&w=800' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="bg-dark-light pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h1 className="text-xs uppercase tracking-widest text-accent font-semibold">Visual Tour</h1>
          <p className="text-4xl md:text-5xl font-bold font-serif text-white">Our Gallery</p>
          <div className="h-0.5 w-24 bg-accent mx-auto mt-4" />
        </div>

        {/* Categories tabs */}
        <div className="flex justify-center space-x-3 mb-10 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-md text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-accent text-dark border-accent'
                  : 'bg-dark-light text-gray-300 border-white/5 hover:border-accent/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-gray-500 text-sm">Polishing pictures...</p>
          </div>
        ) : (
          <div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-dark-light rounded border border-white/5">
                <Info className="h-10 w-10 text-accent mx-auto mb-3" />
                <p className="text-white text-lg font-serif">No images in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setLightboxImg(item)}
                    className="relative overflow-hidden rounded-lg group cursor-pointer border border-white/5 bg-dark-light aspect-4/3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                      <ZoomIn className="h-6 w-6 text-accent absolute top-4 right-4 animate-bounce" />
                      <p className="text-white font-serif text-base font-bold">{item.title}</p>
                      <p className="text-accent text-xs uppercase tracking-widest font-semibold mt-1">
                        {item.category}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 text-white hover:text-accent p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col space-y-4">
            <div className="overflow-hidden rounded border border-accent/20 max-h-[75vh] flex justify-center items-center bg-black">
              <img
                src={lightboxImg.image}
                alt={lightboxImg.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold font-serif text-white">{lightboxImg.title || 'Aroma Spices Scene'}</h3>
              <p className="text-accent text-xs uppercase tracking-widest font-medium mt-1">
                {lightboxImg.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
