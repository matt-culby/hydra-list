import { Item, Category } from '../types/item';

// Type for the data structure
interface DataFile {
  items: Item[];
}

// Cache for data
const dataCache: Record<Category, DataFile> = {
  'restaurants': { items: [] },
  'bars': { items: [] },
  'cafes': { items: [] },
  'movies': { items: [] },
  'shows': { items: [] },
  'date-ideas': { items: [] }
};

// Initialize the cache with data from the server
const initializeCache = async () => {
  const categories: Category[] = ['restaurants', 'bars', 'cafes', 'movies', 'shows', 'date-ideas'];
  
  for (const category of categories) {
    try {
      const response = await fetch(`/api/load?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.items) {
          dataCache[category] = data;
        }
      }
    } catch (error) {
      console.error(`Error loading data for ${category}:`, error);
    }
  }
  
  console.log('Data cache initialized');
};

/**
 * Update the cache with data from the server for a specific category
 */
export const updateCache = async (category: Category): Promise<boolean> => {
  try {
    const response = await fetch(`/api/load?category=${category}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.items) {
        dataCache[category] = data;
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

// Initialize the cache when the module is loaded
if (typeof window !== 'undefined') {
  // Only run in the browser
  initializeCache().catch(console.error);
}

// Function to save data to the server
const saveData = async (category: Category) => {
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        data: dataCache[category],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save data: ${response.statusText}`);
    }

    console.log(`Data saved for category: ${category}`);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
};

/**
 * Get all items for a specific category
 */
export const getItems = (category: Category): Item[] => {
  const items = dataCache[category]?.items || [];
  return items;
};

/**
 * Get a specific item by ID
 */
export const getItemById = (category: Category, id: string): Item | undefined => {
  return getItems(category).find(item => item.id === id);
};

/**
 * Add a new item to a category
 * In a real app, this would write to a database or file
 */
export const addItem = (category: Category, item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item => {
  const newItem: Item = {
    ...item,
    id: `${category}-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Add to cache
  dataCache[category].items.push(newItem);
  
  // Save the data to the server
  saveData(category)
    .then(success => {
      if (success) {
      } else {
        // If server save fails, try to update cache from server
        updateCache(category).catch(console.error);
      }
    })
    .catch(error => {
      console.error('Error saving data:', error);
      // Try to update cache from server on error
      updateCache(category).catch(console.error);
    });
  
  return newItem;
};

/**
 * Update an existing item
 */
export const updateItem = (category: Category, id: string, updates: Partial<Item>): Item | null => {
  console.log('data.ts - updateItem', { category, id, updates });
  
  const items = dataCache[category].items;
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    console.log('data.ts - updateItem - Item not found');
    return null;
  }
  
  const updatedItem: Item = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Update in cache
  items[index] = updatedItem;
  
  // Save the data to the server
  console.log('data.ts - updateItem - Item updated', updatedItem);
  saveData(category)
    .then(success => {
      if (success) {
        console.log(`Data saved successfully for ${category}`);
      } else {
        // If server save fails, try to update cache from server
        updateCache(category).catch(console.error);
      }
    })
    .catch(error => {
      console.error('Error saving data:', error);
      // Try to update cache from server on error
      updateCache(category).catch(console.error);
    });
  
  return updatedItem;
};

/**
 * Delete an item
 */
export const deleteItem = (category: Category, id: string): boolean => {
  const items = dataCache[category].items;
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) {
    return false;
  }
  
  // Remove from cache
  items.splice(index, 1);
  
  // Save the data to the server
  saveData(category)
    .then(success => {
      if (success) {
        console.log(`Data saved successfully for ${category}`);
      } else {
        // If server save fails, try to update cache from server
        updateCache(category).catch(console.error);
      }
    })
    .catch(error => {
      console.error('Error saving data:', error);
      // Try to update cache from server on error
      updateCache(category).catch(console.error);
    });
  
  return true;
};

/**
 * Get a random item from a category
 */
export const getRandomItem = (category: Category): Item | null => {
  const items = getItems(category);
  
  if (items.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

/**
 * Filter items by rating
 */
export const filterItemsByRating = (category: Category, minRating: number, maxRating: number): Item[] => {
  return getItems(category).filter(item => {
    if (item.rating === undefined) {
      return false;
    }
    return item.rating >= minRating && item.rating <= maxRating;
  });
};

/**
 * Filter items by cost
 */
export const filterItemsByCost = (category: Category, minCost: number, maxCost: number): Item[] => {
  return getItems(category).filter(item => {
    if (item.cost === undefined) {
      return false;
    }
    return item.cost >= minCost && item.cost <= maxCost;
  });
};

/**
 * Filter items by date
 */
export const filterItemsByDate = (category: Category, startDate: string, endDate: string): Item[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  
  return getItems(category).filter(item => {
    if (!item.dateExperienced) {
      return false;
    }
    
    const itemDate = new Date(item.dateExperienced).getTime();
    return itemDate >= start && itemDate <= end;
  });
};

/**
 * Search items by name or description
 */
export const searchItems = (category: Category, query: string): Item[] => {
  const lowerQuery = query.toLowerCase();
  
  return getItems(category).filter(item => 
    item.name.toLowerCase().includes(lowerQuery) || 
    item.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get completed items (items with a rating)
 */
export const getCompletedItems = (category: Category): Item[] => {
  return getItems(category).filter(item => item.rating !== undefined);
};

/**
 * Get pending items (items without a rating)
 */
export const getPendingItems = (category: Category): Item[] => {
  return getItems(category).filter(item => item.rating === undefined);
};