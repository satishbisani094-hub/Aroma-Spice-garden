const API_URL = '/api';

// Helper for standard fetch headers
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    return await res.json();
  },

  // Menu
  getMenu: async () => {
    const res = await fetch(`${API_URL}/menu`);
    if (!res.ok) throw new Error('Failed to fetch menu items');
    return await res.json();
  },

  addMenuItem: async (token, itemData) => {
    const res = await fetch(`${API_URL}/menu`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error('Failed to add menu item');
    return await res.json();
  },

  updateMenuItem: async (token, id, itemData) => {
    const res = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error('Failed to update menu item');
    return await res.json();
  },

  deleteMenuItem: async (token, id) => {
    const res = await fetch(`${API_URL}/menu/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete menu item');
    return await res.json();
  },

  // Reservations
  createReservation: async (reservationData) => {
    const res = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reservationData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit reservation');
    }
    return await res.json();
  },

  getReservations: async (token) => {
    const res = await fetch(`${API_URL}/reservations`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch reservations');
    return await res.json();
  },

  updateReservationStatus: async (token, id, status) => {
    const res = await fetch(`${API_URL}/reservations/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update reservation status');
    return await res.json();
  },

  // Queries (Contact messages)
  createQuery: async (queryData) => {
    const res = await fetch(`${API_URL}/queries`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(queryData),
    });
    if (!res.ok) throw new Error('Failed to send contact message');
    return await res.json();
  },

  getQueries: async (token) => {
    const res = await fetch(`${API_URL}/queries`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch queries');
    return await res.json();
  },

  markQueryAsRead: async (token, id) => {
    const res = await fetch(`${API_URL}/queries/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to mark query as read');
    return await res.json();
  },

  // Gallery
  getGallery: async () => {
    const res = await fetch(`${API_URL}/gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery items');
    return await res.json();
  },

  addGalleryItem: async (token, itemData) => {
    const res = await fetch(`${API_URL}/gallery`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(itemData),
    });
    if (!res.ok) throw new Error('Failed to add gallery item');
    return await res.json();
  },

  deleteGalleryItem: async (token, id) => {
    const res = await fetch(`${API_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
    return await res.json();
  },

  // Analytics
  getAnalytics: async (token) => {
    const res = await fetch(`${API_URL}/analytics`, {
      headers: getHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  },
};
