import { dbOperations } from '../config/db.js';

export const getAnalytics = async (req, res) => {
  try {
    const [menu, reservations, queries] = await Promise.all([
      dbOperations.getAll('menu'),
      dbOperations.getAll('reservations'),
      dbOperations.getAll('queries')
    ]);

    // Reservations stats
    const totalReservations = reservations.length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed').length;
    const cancelledReservations = reservations.filter(r => r.status === 'cancelled').length;

    // Queries stats
    const totalQueries = queries.length;
    const unreadQueries = queries.filter(q => !q.isRead).length;

    // Menu stats
    const totalMenuItems = menu.length;
    const vegCount = menu.filter(m => m.isVeg).length;
    const nonVegCount = totalMenuItems - vegCount;

    // Category distribution
    const categoryCounts = {};
    menu.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
    });

    res.json({
      reservations: {
        total: totalReservations,
        pending: pendingReservations,
        confirmed: confirmedReservations,
        cancelled: cancelledReservations
      },
      queries: {
        total: totalQueries,
        unread: unreadQueries
      },
      menu: {
        total: totalMenuItems,
        veg: vegCount,
        nonVeg: nonVegCount,
        categories: categoryCounts
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error compiling analytics data' });
  }
};
