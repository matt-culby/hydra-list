'use client';

import { useState } from 'react';

interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating = 0,
  maxRating = 5,
  size = 'md',
  editable = false,
  onRatingChange
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };
  
  const handleClick = (e: React.MouseEvent, index: number) => {
    if (!editable) return;
    
    // Stop the event from propagating to parent elements
    e.stopPropagation();
    
    // If clicking the same star twice, clear the rating
    const newRating = rating === index ? 0 : index;
    console.log('RatingStars - handleClick', { index, newRating });
    onRatingChange?.(newRating);
  };
  
  const handleMouseEnter = (index: number) => {
    if (!editable) return;
    setHoverRating(index);
  };
  
  const handleMouseLeave = () => {
    if (!editable) return;
    setHoverRating(0);
  };
  
  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating;
        
        return (
          <span
            key={index}
            className={`${sizeClasses[size]} ${isFilled ? 'text-yellow-400' : 'text-gray-300'} ${editable ? 'cursor-pointer' : ''}`}
            onClick={(e) => handleClick(e, starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            role={editable ? 'button' : 'presentation'}
            aria-label={editable ? `Rate ${starValue} out of ${maxRating}` : `Rated ${rating} out of ${maxRating}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}