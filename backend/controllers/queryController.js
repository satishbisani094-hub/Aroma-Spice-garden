import { dbOperations } from '../config/db.js';

// Create a query (contact message)
export const createQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newQuery = await dbOperations.add('queries', {
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newQuery
    });
  } catch (error) {
    console.error('Error creating query:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get all queries (Admin only)
export const getQueries = async (req, res) => {
  try {
    const queries = await dbOperations.getAll('queries');
    queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ message: 'Error fetching queries' });
  }
};

// Mark query as read (Admin only)
export const markQueryAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await dbOperations.update('queries', id, { isRead: true });
    res.json(updated);
  } catch (error) {
    console.error('Error updating query status:', error);
    res.status(500).json({ message: 'Error updating query status' });
  }
};
