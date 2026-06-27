import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, isFirebaseConnected } from './firebase.js';
import { defaultMenuItems } from './defaultMenu.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists for local fallback
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Generate simple mock ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// Helper for local file database
const getLocalFile = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readLocalData = async (collection) => {
  const filePath = getLocalFile(collection);
  if (!fs.existsSync(filePath)) {
    // Return empty array or default menu if it is the menu collection
    if (collection === 'menu') {
      await writeLocalData('menu', defaultMenuItems.map((item, idx) => ({ id: `dish_${idx + 1}`, ...item })));
      return readLocalData('menu');
    }
    if (collection === 'gallery') {
      const defaultGallery = [
        { id: 'g1', title: 'Hyderabadi Chicken Dum Biryani', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600' },
        { id: 'g2', title: 'Tandoori Veg Starters', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600' },
        { id: 'g3', title: 'Restaurant Interior Cozy Area', category: 'Restaurant Interior', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600' },
        { id: 'g4', title: 'Family Moments', category: 'Customer Moments', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600' }
      ];
      await writeLocalData('gallery', defaultGallery);
      return defaultGallery;
    }
    return [];
  }
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeLocalData = async (collection, data) => {
  const filePath = getLocalFile(collection);
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Database utility methods
export const dbOperations = {
  // Get all items in a collection
  getAll: async (collection) => {
    if (isFirebaseConnected) {
      const snapshot = await db.collection(collection).get();
      const items = [];
      snapshot.forEach(doc => {
        items.push({ id: doc.id, ...doc.data() });
      });
      
      // Auto seed Firebase if it is empty for the menu
      if (collection === 'menu' && items.length === 0) {
        console.log('Seeding Firebase menu with default items...');
        const batch = db.batch();
        defaultMenuItems.forEach((item) => {
          const docRef = db.collection('menu').doc();
          batch.set(docRef, item);
        });
        await batch.commit();
        return dbOperations.getAll('menu');
      }

      if (collection === 'gallery' && items.length === 0) {
        console.log('Seeding Firebase gallery...');
        const defaultGallery = [
          { title: 'Hyderabadi Chicken Dum Biryani', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=600' },
          { title: 'Tandoori Veg Starters', category: 'Food Gallery', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600' },
          { title: 'Restaurant Interior Cozy Area', category: 'Restaurant Interior', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600' },
          { title: 'Family Moments', category: 'Customer Moments', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=600' }
        ];
        for (const img of defaultGallery) {
          await db.collection('gallery').add(img);
        }
        return dbOperations.getAll('gallery');
      }

      return items;
    } else {
      return await readLocalData(collection);
    }
  },

  // Get item by ID
  getById: async (collection, id) => {
    if (isFirebaseConnected) {
      const doc = await db.collection(collection).doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } else {
      const items = await readLocalData(collection);
      return items.find(item => item.id === id) || null;
    }
  },

  // Create/Add a new item
  add: async (collection, itemData) => {
    const timestamp = new Date().toISOString();
    const item = { ...itemData, createdAt: timestamp, updatedAt: timestamp };

    if (isFirebaseConnected) {
      const docRef = await db.collection(collection).add(item);
      return { id: docRef.id, ...item };
    } else {
      const items = await readLocalData(collection);
      const newItem = { id: generateId(), ...item };
      items.push(newItem);
      await writeLocalData(collection, items);
      return newItem;
    }
  },

  // Update item by ID
  update: async (collection, id, updates) => {
    const timestamp = new Date().toISOString();
    const itemUpdates = { ...updates, updatedAt: timestamp };

    if (isFirebaseConnected) {
      await db.collection(collection).doc(id).update(itemUpdates);
      const updatedDoc = await db.collection(collection).doc(id).get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    } else {
      const items = await readLocalData(collection);
      const index = items.findIndex(item => item.id === id);
      if (index === -1) throw new Error(`Item with ID ${id} not found in ${collection}`);
      
      items[index] = { ...items[index], ...itemUpdates };
      await writeLocalData(collection, items);
      return items[index];
    }
  },

  // Delete item by ID
  delete: async (collection, id) => {
    if (isFirebaseConnected) {
      await db.collection(collection).doc(id).delete();
      return true;
    } else {
      const items = await readLocalData(collection);
      const filtered = items.filter(item => item.id !== id);
      if (items.length === filtered.length) return false;
      await writeLocalData(collection, filtered);
      return true;
    }
  }
};
