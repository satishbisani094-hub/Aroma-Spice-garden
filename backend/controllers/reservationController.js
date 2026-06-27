import { dbOperations } from '../config/db.js';

// Create a reservation
export const createReservation = async (req, res) => {
  try {
    const { name, phone, date, time, guests, specialRequest } = req.body;

    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: 'Name, phone, date, time, and guest count are required' });
    }

    const newReservation = await dbOperations.add('reservations', {
      name,
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequest: specialRequest || '',
      status: 'pending' // default status: pending, confirmed, cancelled
    });

    res.status(201).json({
      success: true,
      message: 'Reservation submitted successfully',
      data: newReservation
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Error submitting reservation' });
  }
};

// Get all reservations (Admin only)
export const getReservations = async (req, res) => {
  try {
    const reservations = await dbOperations.getAll('reservations');
    // Sort by date and time descending by default
    reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations' });
  }
};

// Update reservation status (Admin only)
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Valid status (pending, confirmed, cancelled) is required' });
    }

    const updated = await dbOperations.update('reservations', id, { status });
    res.json(updated);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ message: 'Error updating reservation status' });
  }
};
