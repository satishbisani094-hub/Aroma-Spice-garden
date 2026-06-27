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
          { id: '1', title: 'Aroma Garden Entrance', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFKyGsJvSDCd2Apn-iWeQ3dcvH7jznnilPxm9GBcnPZjwsKJ6xcFRpqbWTOHm65C8p5GIraPZ8urtLNyrJqGZzxtw8b7vmALnZeNfGfzp-FZguyXxVPZixJdSIv6zAGNQtwvVDbwJ08xy26=s1360-w1360-h1020-rw' },
          { id: '2', title: 'Beautiful Garden Seating', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAF4iV6FzFhfh-IEOg4wOIIPko5FTRjRJLw1XmX2S3N5WUAvvtuC7ctNXw4Z6oHlx_M9aXbofA8kn-hHQb7Dzca2E_xTRvquRuKgpw5pA2kP5rIvul_uFq_4T7Z-eZbLgX48EtuqT-rCZHA=s1360-w1360-h1020-rw' },
          { id: '3', title: 'Family Dining Lounge', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH0Gcil2t_Q26lkwWCS5WX3oEjqkwM7qLEvl42CK-cB9IPvelM64aD5bF-X_oIEY5vYGTC-81rDIYttGVzuUWWV45JiXunXaSfX7i817RMdmTVmS7mjJbkg5KVN37nhQ9b7ucTqo1diUXj_=s1360-w1360-h1020-rw' },
          { id: '4', title: 'Scenic Outdoor Seating', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAElgEuiNZ2gNjkaM8LI6le09zAvqm28s5Txtls-YIxzRC1eQfQfctBnwv84AgINzaNSjuFAZUoBacHplnmxWsc_WXpm3tSW1NvT2oLf7rHWXMclvgW2P7t7Mr3VYjD7VewZQnA5rGPYyqi2=s1360-w1360-h1020-rw' },
          { id: '5', title: 'Evening Illumination', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHeOCsmLh5Gz2yf46TVXM1d19azYTB4vB4W8Jp1v0hlxJW_KffO5PSBjCBQOxB8ZbIO4m6dWKdwnaKmdvtyol4z7cR3YCppVrb5dcphnHhQF5RiEaquaP-xBagSgUgmQcqlj2KCSYsGJ7Rv=s1360-w1360-h1020-rw' },
          { id: '6', title: 'Scenic Garden Corner', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH3uJIiZFRd_R7yIwq_qFauwMFBbbG3ggKUe6uL_Mnfoi3APeayoC3vPeL37qU8eTqjg-fcLQVGo7yGQG3xlAftGyPytwUF_mi5daX9EtLu_FuU4wk-6OL0f3vn4xYwbdgeMAG_7TuiwSQ=s1360-w1360-h1020-rw' },
          { id: '7', title: 'Lush Outdoor Courtyard', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHPyu-hsESJKV1xCxLV1lMUliizEBLx8-qaeuz2HG7Jj1mO13-3NFyRLjjNAc3SOT-F2K2BT2_I7r1i6YgmU2Es-s3CIUP1SC1WRkfTAL7XisfoHo5LwqYowV8j45Ct823rheEb3v8X99s-=s1360-w1360-h1020-rw' },
          { id: '8', title: 'Elegant Patio Dining', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGI71_kpy7XcbwtKWuG7GBaBM9juhrAKbkFUbB1AyCYVwIQenyYvt79bSdoO9zr_v3Zp38RLyywc99o4QfhqtObxNLjWb4FV7U_mCimhQf1PnGgGDxTy90mWxUOioVX0L8wHsPJMlELSMVA=s1360-w1360-h1020-rw' },
          { id: '9', title: 'Garden Night View', category: 'Restaurant Interior', image: 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFpROZa4N2Z5y7CEeZk5XSbjWOeLPboA78eRd2f-52gZDarNWlr4kLYQ-7VdZasySK0fR_7uWaJEmF0VJCAOkoTrWEegx0B5vV0tc8Pt30r0wB5dmfzCNV-rgwjVT1sNDHAaeDQl5lUCLQ=s1360-w1360-h1020-rw' }
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
