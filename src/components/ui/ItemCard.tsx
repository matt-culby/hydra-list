'use client';

import Image from 'next/image';
import { Item } from '@/types/item';
import RatingStars from './RatingStars';

interface ItemCardProps {
  item: Item;
  onRatingChange?: (id: string, rating: number) => void;
}

export default function ItemCard({ item, onRatingChange }: ItemCardProps) {
  const {
    id,
    name,
    description,
    imageUrl,
    externalLink,
    rating,
    cost
  } = item;

  const handleRatingChange = (newRating: number) => {
    console.log('ItemCard - handleRatingChange', { id, newRating });
    onRatingChange?.(id, newRating);
  };

  // Format cost with currency symbol if available
  const formattedCost = cost !== undefined ? `$${cost}` : 'N/A';
  
  // Check if the item has been experienced (has a rating)
  const isCompleted = rating !== undefined;

  return (
    <div className={`card hover:shadow-lg transition-shadow ${isCompleted ? 'border-l-4 border-l-success' : ''}`}>
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={false}
          onError={(e) => {
            // Use a placeholder image if the original image fails to load
            const imgElement = e.currentTarget as HTMLImageElement;
            imgElement.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
            imgElement.srcset = "";
          }}
        />
        {rating !== undefined && (
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
            <div className="text-yellow-400 text-sm mr-1">★</div>
            <div className="text-white text-sm font-medium">{rating}</div>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          {cost !== undefined && (
            <span className="text-sm font-medium bg-secondary-light/20 text-secondary-dark py-1 px-2 rounded-md">
              {formattedCost}
            </span>
          )}
        </div>
        
        <p className="text-color-text-light text-sm mb-4 line-clamp-2">{description}</p>
        
        <div className="flex justify-between items-center">
          <div onClick={(e) => e.stopPropagation()}>
            <RatingStars
              rating={rating}
              editable={true}
              onRatingChange={handleRatingChange}
            />
          </div>
          
          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-secondary-dark text-sm font-medium flex items-center"
              onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up to parent
            >
              <span>Visit</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}