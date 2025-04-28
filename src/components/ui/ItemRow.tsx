'use client';

import Image from 'next/image';
import { Item } from '@/types/item';
import RatingStars from './RatingStars';

interface ItemRowProps {
  item: Item;
  onRatingChange?: (id: string, rating: number) => void;
}

export default function ItemRow({ item, onRatingChange }: ItemRowProps) {
  const {
    id,
    name,
    description,
    imageUrl,
    externalLink,
    rating,
    dateExperienced,
    cost
  } = item;

  const handleRatingChange = (newRating: number) => {
    console.log('ItemRow - handleRatingChange', { id, newRating });
    onRatingChange?.(id, newRating);
  };

  // Format cost with currency symbol if available
  const formattedCost = cost !== undefined ? `$${cost}` : 'N/A';
  
  // Format date if available
  const formattedDate = dateExperienced 
    ? new Date(dateExperienced).toLocaleDateString() 
    : 'Not experienced yet';
  
  // Check if the item has been experienced (has a rating)
  const isCompleted = rating !== undefined;

  return (
    <div className={`flex flex-col sm:flex-row gap-4 p-4 border-b ${isCompleted ? 'border-l-4 border-l-success bg-success/5' : 'border-l-4 border-l-transparent'}`}>
      <div className="relative h-24 sm:h-20 sm:w-32 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 128px"
          className="object-cover"
          onError={(e) => {
            // Use a placeholder image if the original image fails to load
            const imgElement = e.currentTarget as HTMLImageElement;
            imgElement.src = "https://via.placeholder.com/128x96?text=Image+Not+Available";
            imgElement.srcset = "";
          }}
        />
        {rating !== undefined && (
          <div className="absolute top-1 right-1 bg-black/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center">
            <div className="text-yellow-400 text-xs mr-0.5">★</div>
            <div className="text-white text-xs font-medium">{rating}</div>
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-2 mt-1 sm:mt-0">
            {cost !== undefined && (
              <span className="text-sm font-medium bg-secondary-light/20 text-secondary-dark py-0.5 px-2 rounded-md">
                {formattedCost}
              </span>
            )}
            <div onClick={(e) => e.stopPropagation()}>
              <RatingStars
                rating={rating}
                editable={true}
                onRatingChange={handleRatingChange}
                size="sm"
              />
            </div>
          </div>
        </div>
        
        <p className="text-color-text-light text-sm my-2 line-clamp-1">{description}</p>
        
        <div className="flex flex-wrap justify-between items-center mt-2">
          <div className="text-xs text-color-text-lighter flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </div>
          
          <div className="flex gap-3 mt-2 sm:mt-0">
            {externalLink && (
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary-dark text-sm font-medium flex items-center"
                onClick={(e) => e.stopPropagation()} // Prevent event from bubbling up to parent
              >
                <span>Visit</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}