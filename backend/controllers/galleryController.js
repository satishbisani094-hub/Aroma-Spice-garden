import { dbOperations } from '../config/db.js';

// Get all gallery items
export const getGallery = async (req, res) => {
  try {
    const items = await dbOperations.getAll('gallery');
    res.json(items);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Error fetching gallery items' });
  }
};

// Add gallery item (Admin only)
export const addGalleryItem = async (req, res) => {
  try {
    const { title, category, image } = req.body;

    if (!category || !image) {
      return res.status(400).json({ message: 'Category and image URL are required' });
    }

    const newItem = await dbOperations.add('gallery', {
      title: title || '',
      category,
      image
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(500).json({ message: 'Error adding gallery item' });
  }
};

// Delete gallery item (Admin only)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbOperations.delete('gallery', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Error deleting gallery item' });
  }
};
