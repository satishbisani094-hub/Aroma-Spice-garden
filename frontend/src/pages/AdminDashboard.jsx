import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { defaultMenuItems } from '../config/defaultMenu';
import { 
  BarChart3, Calendar, BookOpen, MessageSquare, Image, LogOut, 
  Plus, Edit, Trash2, Check, X, ShieldAlert, Loader2, AlertCircle, Eye, EyeOff
} from 'lucide-react';

const AdminDashboard = () => {
  const { token, login, logout, isAuthenticated, loading: authLoading } = useAuth();
  
  // Auth Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState('analytics'); // analytics, reservations, menu, queries, gallery

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [menu, setMenu] = useState([]);
  const [queries, setQueries] = useState([]);
  const [gallery, setGallery] = useState([]);
  
  const [loadingData, setLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal / Form States
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState(null); // null for add, item object for edit
  const [menuForm, setMenuForm] = useState({
    name: '',
    category: 'Non Veg Biryanis',
    description: '',
    isVeg: false,
    priceRegular: '',
    priceCouple: '',
    priceFamily: '',
    image: ''
  });

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Food Gallery',
    image: ''
  });

  // Fetch data based on selected tab or auth status
  useEffect(() => {
    if (isAuthenticated) {
      fetchTabData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchTabData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === 'analytics') {
        const data = await apiService.getAnalytics(token);
        setAnalytics(data);
      } else if (activeTab === 'reservations') {
        const data = await apiService.getReservations(token);
        setReservations(data);
      } else if (activeTab === 'menu') {
        const data = await apiService.getMenu();
        setMenu(data.length > 0 ? data : defaultMenuItems.map((item, idx) => ({ id: `dish_${idx+1}`, ...item })));
      } else if (activeTab === 'queries') {
        const data = await apiService.getQueries(token);
        setQueries(data);
      } else if (activeTab === 'gallery') {
        const data = await apiService.getGallery();
        setGallery(data);
      }
    } catch (error) {
      console.error(`Error loading data for ${activeTab}:`, error);
      // Local fallbacks if backend is not started yet
      if (activeTab === 'menu') {
        setMenu(defaultMenuItems.map((item, idx) => ({ id: `dish_${idx+1}`, ...item })));
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await login(username, password);
      if (!res.success) {
        setLoginError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server');
    } finally {
      setLoginLoading(false);
    }
  };

  // --- Reservation Actions ---
  const handleUpdateReservationStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await apiService.updateReservationStatus(token, id, status);
      await fetchTabData(); // Reload
    } catch (error) {
      alert('Failed to update reservation: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // --- Query Actions ---
  const handleMarkQueryAsRead = async (id) => {
    setActionLoading(true);
    try {
      await apiService.markQueryAsRead(token, id);
      await fetchTabData();
    } catch (error) {
      alert('Failed to update query status');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Menu CRUD Actions ---
  const handleOpenMenuModal = (item = null) => {
    if (item) {
      // Edit mode
      setCurrentMenuItem(item);
      setMenuForm({
        name: item.name,
        category: item.category,
        description: item.description || '',
        isVeg: item.isVeg,
        priceRegular: item.prices?.regular || '',
        priceCouple: item.prices?.couple || '',
        priceFamily: item.prices?.family || '',
        image: item.image || ''
      });
    } else {
      // Add mode
      setCurrentMenuItem(null);
      setMenuForm({
        name: '',
        category: 'Non Veg Biryanis',
        description: '',
        isVeg: false,
        priceRegular: '',
        priceCouple: '',
        priceFamily: '',
        image: ''
      });
    }
    setMenuModalOpen(true);
  };

  const handleMenuFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const prices = {
        regular: Number(menuForm.priceRegular)
      };
      if (menuForm.priceCouple) prices.couple = Number(menuForm.priceCouple);
      if (menuForm.priceFamily) prices.family = Number(menuForm.priceFamily);

      const itemData = {
        name: menuForm.name,
        category: menuForm.category,
        description: menuForm.description,
        isVeg: menuForm.isVeg,
        prices,
        image: menuForm.image
      };

      if (currentMenuItem) {
        // Edit API call
        await apiService.updateMenuItem(token, currentMenuItem.id, itemData);
      } else {
        // Add API call
        await apiService.addMenuItem(token, itemData);
      }
      setMenuModalOpen(false);
      await fetchTabData();
    } catch (error) {
      alert('Failed to save menu item. Check API connections.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    setActionLoading(true);
    try {
      await apiService.deleteMenuItem(token, id);
      await fetchTabData();
    } catch (error) {
      alert('Failed to delete menu item');
    } finally {
      setActionLoading(false);
    }
  };

  // --- Gallery Actions ---
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await apiService.addGalleryItem(token, galleryForm);
      setGalleryModalOpen(false);
      setGalleryForm({ title: '', category: 'Food Gallery', image: '' });
      await fetchTabData();
    } catch (error) {
      alert('Failed to save image to gallery');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to remove this image?')) return;
    setActionLoading(true);
    try {
      await apiService.deleteGalleryItem(token, id);
      await fetchTabData();
    } catch (error) {
      alert('Failed to remove image');
    } finally {
      setActionLoading(false);
    }
  };

  // --- LOGIN PORTAL UI ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full glass-panel p-8 rounded-lg space-y-6 border-accent/30 shadow-2xl">
          <div className="text-center space-y-2">
            <ShieldAlert className="h-12 w-12 text-accent mx-auto" />
            <h2 className="text-2xl font-bold font-serif text-white uppercase tracking-wider">Admin Portal</h2>
            <p className="text-sm text-gray-500">Sign in to manage Aroma Spices operations</p>
          </div>

          {loginError && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-300 p-3 rounded-md flex items-center space-x-2 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. admin)"
                className="block w-full border border-white/10 rounded-md bg-black/40 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full border border-white/10 rounded-md bg-black/40 text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-accent hover:bg-accent-hover text-dark font-bold rounded-md uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>

          <div className="text-center text-xs text-gray-600">
            <p>Default credential: <b>admin</b> / <b>password123</b></p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD LAYOUT ---
  return (
    <div className="min-h-screen bg-dark pt-24 pb-12 flex flex-col md:flex-row">
      
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-dark-light border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="pb-4 border-b border-white/5">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold">Access Level</p>
            <h2 className="text-lg font-bold text-white font-serif uppercase mt-1">Administrator</h2>
          </div>

          <nav className="space-y-2 flex flex-col">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'analytics' ? 'bg-primary text-white border-l-4 border-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard Stats</span>
            </button>
            
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'reservations' ? 'bg-primary text-white border-l-4 border-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Reservations</span>
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'menu' ? 'bg-primary text-white border-l-4 border-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Menu Dishes</span>
            </button>

            <button
              onClick={() => setActiveTab('queries')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'queries' ? 'bg-primary text-white border-l-4 border-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>User Queries</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors ${
                activeTab === 'gallery' ? 'bg-primary text-white border-l-4 border-accent' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Image className="h-4 w-4" />
              <span>Photo Gallery</span>
            </button>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-md text-sm font-semibold transition-colors w-full mt-6"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {loadingData ? (
          <div className="flex flex-col items-center justify-center h-96 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-gray-500 text-sm">Retrieving administration files...</p>
          </div>
        ) : (
          <div>
            
            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-8 animate-fade-in-up">
                <h1 className="text-3xl font-serif font-bold text-white border-b border-white/5 pb-4">Performance Overview</h1>
                
                {/* Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="glass-panel p-6 rounded-lg space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Reservations</p>
                    <p className="text-4xl font-bold font-serif text-accent">{analytics.reservations.total}</p>
                    <p className="text-xs text-gray-400">{analytics.reservations.pending} Pending approval</p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-lg space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Confirmed bookings</p>
                    <p className="text-4xl font-bold font-serif text-green-500">{analytics.reservations.confirmed}</p>
                    <p className="text-xs text-gray-400">Ready to serve</p>
                  </div>

                  <div className="glass-panel p-6 rounded-lg space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Customer Queries</p>
                    <p className="text-4xl font-bold font-serif text-accent">{analytics.queries.total}</p>
                    <p className="text-xs text-gray-400">{analytics.queries.unread} Unread messages</p>
                  </div>

                  <div className="glass-panel p-6 rounded-lg space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total Menu Dishes</p>
                    <p className="text-4xl font-bold font-serif text-accent">{analytics.menu.total}</p>
                    <p className="text-xs text-gray-400">{analytics.menu.veg} Veg / {analytics.menu.nonVeg} Non-Veg</p>
                  </div>
                </div>

                {/* Categories Table/Stats */}
                <div className="glass-panel p-6 rounded-lg">
                  <h3 className="text-lg font-bold font-serif text-white mb-4">Dish Distribution By Category</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(analytics.menu.categories).map(([cat, count]) => (
                      <div key={cat} className="bg-black/30 border border-white/5 rounded p-3 flex justify-between items-center text-sm">
                        <span className="text-gray-400 truncate max-w-xs">{cat}</span>
                        <span className="text-accent font-bold px-2 py-0.5 bg-accent/10 rounded">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RESERVATIONS */}
            {activeTab === 'reservations' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h1 className="text-3xl font-serif font-bold text-white">Table Reservations</h1>
                  <button onClick={fetchTabData} className="text-xs text-accent hover:underline uppercase tracking-wider">Reload list</button>
                </div>

                <div className="glass-panel rounded-lg overflow-x-auto border border-white/5">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                        <th className="p-4">Customer</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Date/Time</th>
                        <th className="p-4">Guests</th>
                        <th className="p-4">Requests</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {reservations.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-8 text-center text-gray-500 italic">No reservation files found.</td>
                        </tr>
                      ) : (
                        reservations.map((res) => (
                          <tr key={res.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-white">{res.name}</td>
                            <td className="p-4">{res.phone}</td>
                            <td className="p-4">
                              <p className="font-semibold">{res.date}</p>
                              <p className="text-xs text-gray-500">{res.time}</p>
                            </td>
                            <td className="p-4 text-accent font-bold">{res.guests} Ppl</td>
                            <td className="p-4 max-w-xs truncate" title={res.specialRequest}>
                              {res.specialRequest || <span className="text-gray-600">—</span>}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                res.status === 'confirmed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                res.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                              }`}>
                                {res.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {res.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateReservationStatus(res.id, 'confirmed')}
                                    disabled={actionLoading}
                                    className="p-1 text-green-500 hover:bg-green-500/10 rounded transition-colors inline-block"
                                    title="Confirm Reservation"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateReservationStatus(res.id, 'cancelled')}
                                    disabled={actionLoading}
                                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors inline-block"
                                    title="Cancel Reservation"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: MENU MANAGEMENT */}
            {activeTab === 'menu' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h1 className="text-3xl font-serif font-bold text-white">Menu Manager</h1>
                  <button
                    onClick={() => handleOpenMenuModal()}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-dark font-bold rounded text-xs uppercase tracking-wider transition-colors shadow shadow-accent/10"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Dish</span>
                  </button>
                </div>

                <div className="glass-panel rounded-lg overflow-x-auto border border-white/5">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-black/40 text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                        <th className="p-4">Dish Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Prices (Reg / Cpl / Fam)</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {menu.map((dish) => (
                        <tr key={dish.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white">{dish.name}</p>
                            <p className="text-xs text-gray-500 max-w-md truncate" title={dish.description}>{dish.description || 'No description provided.'}</p>
                          </td>
                          <td className="p-4 text-xs text-gray-400 font-semibold">{dish.category}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold tracking-widest border ${
                              dish.isVeg ? 'bg-green-700/10 text-green-500 border-green-500/20' : 'bg-red-800/10 text-red-500 border-red-500/20'
                            }`}>
                              {dish.isVeg ? 'Veg' : 'Non Veg'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-semibold text-accent">
                            {dish.prices ? (
                              <span>
                                ₹{dish.prices.regular} 
                                {dish.prices.couple && ` / ₹${dish.prices.couple}`}
                                {dish.prices.family && ` / ₹${dish.prices.family}`}
                              </span>
                            ) : (
                              <span>₹{dish.price || 150}</span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenMenuModal(dish)}
                              className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded transition-colors inline-block"
                              title="Edit Dish"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(dish.id)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors inline-block"
                              title="Delete Dish"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: USER QUERIES */}
            {activeTab === 'queries' && (
              <div className="space-y-6 animate-fade-in-up">
                <h1 className="text-3xl font-serif font-bold text-white border-b border-white/5 pb-4">Customer Queries</h1>

                <div className="space-y-4">
                  {queries.length === 0 ? (
                    <div className="glass-panel p-8 text-center text-gray-500 italic rounded">No messages received yet.</div>
                  ) : (
                    queries.map((q) => (
                      <div key={q.id} className={`glass-panel p-6 rounded-lg border flex flex-col justify-between space-y-4 ${
                        !q.isRead ? 'border-accent/30 bg-accent/5' : 'border-white/5'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-base">{q.name}</h4>
                            <p className="text-xs text-gray-500">{q.email} | {q.phone || 'No phone number'}</p>
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(q.createdAt).toLocaleString()}</span>
                        </div>

                        <div className="bg-black/30 p-4 border border-white/5 rounded">
                          <p className="text-xs text-accent uppercase tracking-widest font-semibold mb-1">Subject: {q.subject}</p>
                          <p className="text-sm text-gray-300 font-light italic">"{q.message}"</p>
                        </div>

                        <div className="flex justify-end pt-2">
                          {!q.isRead ? (
                            <button
                              onClick={() => handleMarkQueryAsRead(q.id)}
                              disabled={actionLoading}
                              className="flex items-center space-x-1 px-3 py-1 bg-accent hover:bg-accent-hover text-dark text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                            >
                              <Check className="h-3 w-3" />
                              <span>Mark as Read</span>
                            </button>
                          ) : (
                            <span className="text-xs text-gray-600 uppercase tracking-wider font-bold">Opened & Read</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: GALLERY MANAGEMENT */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h1 className="text-3xl font-serif font-bold text-white">Gallery Manager</h1>
                  <button
                    onClick={() => setGalleryModalOpen(true)}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-dark font-bold rounded text-xs uppercase tracking-wider transition-colors shadow shadow-accent/10"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Image</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gallery.map((img) => (
                    <div key={img.id} className="relative overflow-hidden rounded-lg group border border-white/5 bg-dark-light aspect-4/3 flex flex-col justify-between">
                      <div className="h-40 overflow-hidden relative">
                        <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleDeleteGalleryItem(img.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors z-10"
                          title="Remove Image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="p-3 bg-black/50 text-xs">
                        <p className="font-bold text-white truncate">{img.title || 'Untitled'}</p>
                        <p className="text-accent uppercase tracking-widest text-[9px] mt-0.5">{img.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {menuModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 rounded-lg border border-accent/20 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xl font-bold font-serif text-white">
                {currentMenuItem ? 'Modify Dish' : 'Create Dish'}
              </h3>
              <button onClick={() => setMenuModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleMenuFormSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({...menuForm, name: e.target.value})}
                  className="block w-full border border-white/10 rounded bg-black/40 text-white px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Category</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({...menuForm, category: e.target.value})}
                    className="block w-full border border-white/10 rounded bg-black/40 text-white px-2 py-2 text-sm focus:outline-none"
                  >
                    <option value="Non Veg Biryanis">Non Veg Biryanis</option>
                    <option value="Combos & Jumbo Packs">Combos & Jumbo Packs</option>
                    <option value="Veg Biryanis">Veg Biryanis</option>
                    <option value="Soups">Soups</option>
                    <option value="Tandoori Veg Starters">Tandoori Veg Starters</option>
                    <option value="Tandoori Non Veg Starters">Tandoori Non Veg Starters</option>
                    <option value="Chinese Veg Starters">Chinese Veg Starters</option>
                    <option value="Egg Starters">Egg Starters</option>
                    <option value="Veg Curries">Veg Curries</option>
                    <option value="Egg Curries">Egg Curries</option>
                    <option value="Non Veg Curries">Non Veg Curries</option>
                    <option value="Chinese Non Veg Starters">Chinese Non Veg Starters</option>
                    <option value="Andhra Specials">Andhra Specials</option>
                    <option value="Rotis">Rotis</option>
                    <option value="Fried Rice & Noodles">Fried Rice & Noodles</option>
                    <option value="Beverages & Mojitos">Beverages & Mojitos</option>
                    <option value="Milkshakes">Milkshakes</option>
                    <option value="Ice Creams">Ice Creams</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <input
                    type="checkbox"
                    id="isVegCheckbox"
                    checked={menuForm.isVeg}
                    onChange={(e) => setMenuForm({...menuForm, isVeg: e.target.checked})}
                    className="h-4 w-4 rounded border-white/10 bg-black/40 accent-accent"
                  />
                  <label htmlFor="isVegCheckbox" className="ml-2 text-xs uppercase tracking-widest text-gray-300 font-semibold">Is Vegetarian</label>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  value={menuForm.image}
                  onChange={(e) => setMenuForm({...menuForm, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full border border-white/10 rounded bg-black/40 text-white px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={menuForm.priceRegular}
                    onChange={(e) => setMenuForm({...menuForm, priceRegular: e.target.value})}
                    className="block w-full border border-white/10 rounded bg-black/40 text-white px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Couple Price (₹)</label>
                  <input
                    type="number"
                    value={menuForm.priceCouple}
                    onChange={(e) => setMenuForm({...menuForm, priceCouple: e.target.value})}
                    placeholder="Optional"
                    className="block w-full border border-white/10 rounded bg-black/40 text-white px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-0.5">Family Price (₹)</label>
                  <input
                    type="number"
                    value={menuForm.priceFamily}
                    onChange={(e) => setMenuForm({...menuForm, priceFamily: e.target.value})}
                    placeholder="Optional"
                    className="block w-full border border-white/10 rounded bg-black/40 text-white px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  className="block w-full border border-white/10 rounded bg-black/40 text-white px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded text-gray-300 hover:text-white uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 bg-accent hover:bg-accent-hover text-dark font-bold rounded uppercase tracking-wider text-xs transition-colors"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD GALLERY IMAGE */}
      {galleryModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-6 rounded-lg border border-accent/20 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="text-xl font-bold font-serif text-white">Upload Gallery Image</h3>
              <button onClick={() => setGalleryModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleGallerySubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Image Title</label>
                <input
                  type="text"
                  required
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                  className="block w-full border border-white/10 rounded bg-black/40 text-white px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({...galleryForm, category: e.target.value})}
                  className="block w-full border border-white/10 rounded bg-black/40 text-white px-2 py-2 text-sm focus:outline-none"
                >
                  <option value="Food Gallery">Food Gallery</option>
                  <option value="Restaurant Interior">Restaurant Interior</option>
                  <option value="Customer Moments">Customer Moments</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={galleryForm.image}
                  onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})}
                  placeholder="https://images.unsplash.com/..."
                  className="block w-full border border-white/10 rounded bg-black/40 text-white px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded text-gray-300 hover:text-white uppercase tracking-wider text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 bg-accent hover:bg-accent-hover text-dark font-bold rounded uppercase tracking-wider text-xs transition-colors"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
