'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Category, categories } from '@/types/item';
import {
  getItems,
  getRandomItem,
  addItem,
  updateItem,
  updateCache
} from '@/lib/data';
import ItemCard from '@/components/ui/ItemCard';
import ItemRow from '@/components/ui/ItemRow';
import ViewToggle from '@/components/ui/ViewToggle';
import FilterBar from '@/components/ui/FilterBar';
import RandomButton from '@/components/ui/RandomButton';
import AddItemModal from '@/components/forms/AddItemModal';
import ItemModal from '@/components/forms/ItemModal';

export default function CategoryPage() {
  // Get params from the URL
  const params = useParams();
  const categoryId = params.category as string;
  
  // State
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [items, setItems] = useState<ReturnType<typeof getItems>>([]);
  const [filteredItems, setFilteredItems] = useState<typeof items>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [filters, setFilters] = useState<{
    rating?: { min: number; max: number };
    cost?: { min: number; max: number };
    date?: { start: string; end: string };
    search?: string;
  }>({});
  
  // Check if the category exists
  const categoryInfo = categories.find(cat => cat.id === categoryId);
  
  // Initialize items
  useEffect(() => {
    if (categoryInfo) {
      // First, get items from the cache for immediate display
      const categoryItems = getItems(categoryId as Category);
      setItems(categoryItems);
      setFilteredItems(categoryItems);
      
      // Then, fetch the latest data from the server and update the cache
      const fetchData = async () => {
        try {
          // Update the cache with the latest data from the server
          const success = await updateCache(categoryId as Category);
          
          if (success) {
            // Get the updated items from the cache
            const updatedItems = getItems(categoryId as Category);
            setItems(updatedItems);
            setFilteredItems(updatedItems);
          } else {
            // Fallback to direct API call if cache update fails
            const response = await fetch(`/api/load?category=${categoryId}`);
            if (!response.ok) {
              throw new Error(`Failed to load data: ${response.statusText}`);
            }
            
            const data = await response.json();
            if (data && data.items) {
              setItems(data.items);
              setFilteredItems(data.items);
            }
          }
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };
      
      fetchData();
    }
  }, [categoryId, categoryInfo]);
  
  // Handle not found
  useEffect(() => {
    if (categoryId && !categoryInfo) {
      notFound();
    }
  }, [categoryId, categoryInfo]);
  
  // Apply filters when items or filters change
  useEffect(() => {
    if (!items.length) return;

    let result = [...items];

    // Only apply search filter if there's actual search text
    if (filters.search !== undefined && filters.search.trim() !== '' && categoryId) {
      const lowerQuery = filters.search.toLowerCase();
      
      result = result.filter(item => {
        const nameMatch = item.name.toLowerCase().includes(lowerQuery);
        const descMatch = item.description.toLowerCase().includes(lowerQuery);
        const matches = nameMatch || descMatch;
        
        return matches;
      });
      
      console.log(`Search results: ${result.length} items found`);
    }
    
    if (filters.rating) {
      result = result.filter(item => {
        if (item.rating === undefined) return false;
        return item.rating >= filters.rating!.min && item.rating <= filters.rating!.max;
      });
    }
    
    if (filters.cost) {
      result = result.filter(item => {
        if (item.cost === undefined) return false;
        return item.cost >= filters.cost!.min && item.cost <= filters.cost!.max;
      });
    }
    
    if (filters.date) {
      result = result.filter(item => {
        if (!item.dateExperienced) return false;
        const itemDate = new Date(item.dateExperienced).getTime();
        const startDate = new Date(filters.date!.start).getTime();
        const endDate = new Date(filters.date!.end).getTime();
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    
    setFilteredItems(result);
  }, [items, filters, categoryId]);
  
  // Handle adding a new item
  const handleAddItem = (newItemData: Parameters<typeof addItem>[1]) => {
    if (!categoryId) return;
    
    addItem(categoryId as Category, newItemData);
    setItems(getItems(categoryId as Category));
  };
  
  // Handle updating an item
  const handleUpdateItem = (id: string, updates: Parameters<typeof updateItem>[2]) => {
    if (!categoryId) return;
    
    const updatedItem = updateItem(categoryId as Category, id, updates);
    console.log('CategoryPage - handleUpdateItem - After update', { updatedItem });
    
    if (updatedItem) {
      // Get fresh items from the cache
      const freshItems = getItems(categoryId as Category);
      console.log('CategoryPage - handleUpdateItem - Fresh items', { freshItems });
      
      // Create a new array to ensure React detects the state change
      const newItems = [...freshItems];
      console.log('CategoryPage - handleUpdateItem - New items array', { newItems });
      
      // Force a re-render by updating the items state with a new array
      setItems(newItems);
      
      // Also update filteredItems directly to ensure UI updates
      setFilteredItems(newItems);
      
      // Update the selected item if it's the one being updated
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(updatedItem);
      }
    }
  };
  
  // Handle rating change
  const handleRatingChange = (id: string, rating: number) => {
    console.log('CategoryPage - handleRatingChange', { id, rating });
    handleUpdateItem(id, {
      rating,
      dateExperienced: new Date().toISOString()
    });
  };
  
  // Handle random selection
  const handleRandomSelect = () => {
    if (!categoryId) return;
    
    setIsRandomizing(true);
    
    // Add a small delay for animation effect
    setTimeout(() => {
      const randomItem = getRandomItem(categoryId as Category);
      setIsRandomizing(false);
      
      if (randomItem) {
        setSelectedItem(randomItem);
      }
    }, 1000);
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <FilterBar onFilterChange={setFilters} />
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <ViewToggle view={view} onViewChange={setView} />
          
          <RandomButton 
            onRandomSelect={handleRandomSelect} 
            isLoading={isRandomizing} 
          />
          
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-green-300 w-full sm:w-auto"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New
          </button>
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-medium text-gray-800 mb-2">No items found</h3>
          <p className="text-gray-600 mb-6">
            {Object.keys(filters).length > 0 
              ? "Try adjusting your filters or" 
              : "Get started by"} adding a new item to your list.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Item
          </button>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
              <ItemCard 
                item={item} 
                onRatingChange={handleRatingChange} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
          {filteredItems.map(item => (
            <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer">
              <ItemRow 
                item={item} 
                onRatingChange={handleRatingChange} 
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
        defaultCategory={categoryId as Category}
      />
      
      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          onUpdate={handleUpdateItem}
        />
      )}
    </div>
  );
}