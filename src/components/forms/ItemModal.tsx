'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Item } from '@/types/item';
import RatingStars from '@/components/ui/RatingStars';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
  onUpdate: (id: string, updates: Partial<Item>) => void;
}

export default function ItemModal({ 
  isOpen, 
  onClose, 
  item,
  onUpdate
}: ItemModalProps) {
  const [rating, setRating] = useState<number | undefined>(item.rating);
  const [notes, setNotes] = useState(item.notes || '');
  const [isEditing, setIsEditing] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Update local state when item changes
  useEffect(() => {
    setRating(item.rating);
    setNotes(item.notes || '');
  }, [item]);
  
  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle escape key to close modal
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  const handleSaveReview = () => {
    onUpdate(item.id, {
      rating,
      notes,
      dateExperienced: rating !== undefined && !item.dateExperienced 
        ? new Date().toISOString() 
        : item.dateExperienced
    });
    setIsEditing(false);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not experienced yet';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="relative h-64 sm:h-80 bg-gray-800">
          <Image
            src={item.imageUrl || "https://placecats.com/neo/800/500"}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover rounded-t-lg"
            priority
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 backdrop-blur-sm rounded-full p-2 shadow-md"
            aria-label="Close"
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 sm:mb-0">{item.name}</h2>
            
            {item.cost !== undefined && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-light/20 text-secondary-light">
                ${item.cost}
              </span>
            )}
          </div>
          
          <p className="text-gray-300 mb-6">{item.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Category</h3>
              <p className="text-white capitalize">{item.category.replace('-', ' ')}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Date Experienced</h3>
              <p className="text-white">{formatDate(item.dateExperienced)}</p>
            </div>
            
            {item.externalLink && (
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-400 mb-1">External Link</h3>
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:text-secondary-light hover:underline"
                >
                  {item.externalLink}
                </a>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Your Review</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm font-medium text-secondary hover:text-secondary-light"
              >
                {isEditing ? 'Cancel' : 'Edit Review'}
              </button>
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
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
                  <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="Add your thoughts or review here..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveReview}
                    className="px-4 py-2.5 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    Save Review
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Rating</h4>
                  {rating !== undefined ? (
                    <RatingStars rating={rating} size="lg" />
                  ) : (
                    <p className="text-gray-500 italic">Not rated yet</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Notes</h4>
                  {notes ? (
                    <p className="text-gray-300 whitespace-pre-line">{notes}</p>
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