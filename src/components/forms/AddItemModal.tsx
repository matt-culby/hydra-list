'use client';

import { useState, useRef, useEffect } from 'react';
import { Category, categories } from '@/types/item';
import RatingStars from '@/components/ui/RatingStars';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: {
    name: string;
    description: string;
    imageUrl: string;
    externalLink: string;
    category: Category;
    rating?: number;
    notes?: string;
    dateExperienced?: string;
    cost?: number;
  }) => void;
  defaultCategory?: Category;
}

export default function AddItemModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  defaultCategory 
}: AddItemModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory || 'restaurants');
  const [cost, setCost] = useState<string>('');
  const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Experience fields
  const [alreadyExperienced, setAlreadyExperienced] = useState(false);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [dateExperienced, setDateExperienced] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setImageUrl('');
      setExternalLink('');
      setCategory(defaultCategory || 'restaurants');
      setCost('');
      setImageUploadMethod('url');
      setImagePreview(null);
      
      // Reset experience fields
      setAlreadyExperienced(false);
      setRating(undefined);
      setNotes('');
      setDateExperienced('');
      
      // Focus on the name input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, defaultCategory]);
  
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll just use the image URL directly
    // In a real app, we would upload the file to a server or storage service
    const finalImageUrl = imageUploadMethod === 'upload' && imagePreview 
      ? imagePreview 
      : imageUrl;
    
    onSubmit({
      name,
      description,
      imageUrl: finalImageUrl,
      externalLink,
      category,
      rating,
      notes,
      dateExperienced: dateExperienced || undefined,
      cost: cost ? Number(cost) : undefined
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add New Item</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded-full p-1"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Name *
              </label>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white mb-1">
                Image
              </label>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="imageUrl"
                    name="imageMethod"
                    checked={imageUploadMethod === 'url'}
                    onChange={() => setImageUploadMethod('url')}
                    className="mr-2"
                  />
                  <label htmlFor="imageUrl" className="text-gray-300">URL</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="imageUpload"
                    name="imageMethod"
                    checked={imageUploadMethod === 'upload'}
                    onChange={() => setImageUploadMethod('upload')}
                    className="mr-2"
                  />
                  <label htmlFor="imageUpload" className="text-gray-300">Upload</label>
                </div>
              </div>
              
              {imageUploadMethod === 'url' ? (
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
                />
              ) : (
                <div>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-32 object-cover rounded-md" 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <label htmlFor="externalLink" className="block text-sm font-medium text-white mb-1">
                External Link
              </label>
              <input
                type="url"
                id="externalLink"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                required
                className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="cost" className="block text-sm font-medium text-white mb-1">
                Cost
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700">
                  $
                </span>
                <input
                  type="number"
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full p-2.5 pl-7 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            
            <div className="md:col-span-2 mt-4 border-t pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="alreadyExperienced"
                  checked={alreadyExperienced}
                  onChange={(e) => setAlreadyExperienced(e.target.checked)}
                  className="mr-2 h-4 w-4 text-primary focus:ring-primary-light border-gray-600 rounded"
                />
                <label htmlFor="alreadyExperienced" className="text-sm font-medium text-white">
                  I&apos;ve already experienced this item
                </label>
              </div>
              
              {alreadyExperienced && (
                <div className="space-y-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div>
                    <label htmlFor="dateExperienced" className="block text-sm font-medium text-white mb-1">
                      Date Experienced
                    </label>
                    <input
                      type="date"
                      id="dateExperienced"
                      value={dateExperienced}
                      onChange={(e) => setDateExperienced(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  
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
                      rows={3}
                      placeholder="Add your thoughts or review here..."
                      className="w-full p-2.5 bg-white border border-gray-600 rounded-md text-gray-900 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-white bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}