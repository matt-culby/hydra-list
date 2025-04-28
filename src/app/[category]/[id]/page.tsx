'use client';

'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Category, categories } from '@/types/item';
import { getItemById, updateItem } from '@/lib/data';
import RatingStars from '@/components/ui/RatingStars';

export default function ItemPage() {
  // Get params from the URL
  const params = useParams();
  const categoryId = params.category as string;
  const itemId = params.id as string;
  
  const [item, setItem] = useState<ReturnType<typeof getItemById>>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  
  // Check if the category and item exist
  const categoryInfo = categories.find(cat => cat.id === categoryId);
  
  // Load item data
  useEffect(() => {
    if (categoryId && itemId) {
      const foundItem = getItemById(categoryId as Category, itemId);
      setItem(foundItem);
      if (foundItem) {
        setRating(foundItem.rating);
        setNotes(foundItem.notes || '');
      }
    }
  }, [categoryId, itemId]);
  
  useEffect(() => {
    if (!categoryInfo || !item) {
      notFound();
    }
  }, [categoryInfo, item]);
  
  if (!item || !categoryInfo) {
    return null; // This will be caught by the useEffect and redirect to 404
  }
  
  const handleSaveReview = () => {
    if (!item || !categoryId || !itemId) return;
    
    const updatedItem = updateItem(categoryId as Category, itemId, {
      rating,
      notes,
      dateExperienced: rating !== undefined && !item.dateExperienced
        ? new Date().toISOString()
        : item.dateExperienced
    });
    
    if (updatedItem) {
      setItem(updatedItem);
      setIsEditing(false);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not experienced yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/${categoryId}`}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to {categoryInfo.name}
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-64 sm:h-96">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">{item.name}</h1>
            
            {item.cost !== undefined && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                ${item.cost}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-8 text-lg">{item.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Category</h2>
              <p className="text-gray-800 capitalize">{categoryInfo.name}</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">Date Experienced</h2>
              <p className="text-gray-800">{formatDate(item.dateExperienced)}</p>
            </div>
            
            {item.externalLink && (
              <div className="sm:col-span-2">
                <h2 className="text-sm font-medium text-gray-500 mb-1">External Link</h2>
                <a 
                  href={item.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {item.externalLink}
                </a>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Your Review</h2>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {isEditing ? 'Cancel' : 'Edit Review'}
              </button>
            </div>
            
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <RatingStars
                    rating={rating}
                    editable={true}
                    onRatingChange={setRating}
                    size="lg"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add your thoughts or review here..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Review
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Rating</h3>
                  {rating !== undefined ? (
                    <RatingStars rating={rating} size="lg" />
                  ) : (
                    <p className="text-gray-500 italic">Not rated yet</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  {notes ? (
                    <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-line">
                      {notes}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No notes yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}