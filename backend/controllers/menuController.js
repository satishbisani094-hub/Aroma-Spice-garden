import { dbOperations } from '../config/db.js';

// Get all menu items
export const getMenu = async (req, res) => {
  try {
    const items = await dbOperations.getAll('menu');
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
};

// Add menu item
export const addMenuItem = async (req, res) => {
  try {
    const { name, category, description, isVeg, prices, image } = req.body;

    if (!name || !category || !prices || typeof prices !== 'object') {
      return res.status(400).json({ message: 'Name, category, and price details are required' });
    }

    const newItem = await dbOperations.add('menu', {
      name,
      category,
      description: description || '',
      isVeg: !!isVeg,
      prices,
      image: image || ''
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Error adding menu item' });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, isVeg, prices, image } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (isVeg !== undefined) updates.isVeg = !!isVeg;
    if (prices !== undefined) updates.prices = prices;
    if (image !== undefined) updates.image = image;

    const updatedItem = await dbOperations.update('menu', id, updates);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Error updating menu item' });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbOperations.delete('menu', id);
    if (!deleted) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
};
