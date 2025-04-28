'use client';

import { useState } from 'react';

interface RandomButtonProps {
  onRandomSelect: () => void;
  isLoading?: boolean;
}

export default function RandomButton({ onRandomSelect, isLoading = false }: RandomButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleClick = () => {
    if (isLoading || isAnimating) return;
    
    setIsAnimating(true);
    
    // Animate the button for a short time before triggering the actual random selection
    setTimeout(() => {
      setIsAnimating(false);
      onRandomSelect();
    }, 800);
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || isAnimating}
      className={`relative overflow-hidden text-white font-medium rounded-lg text-sm px-5 py-2.5 shadow-sm border border-accent-dark ${
        isAnimating
          ? 'bg-gradient-accent background-animate cursor-not-allowed'
          : isLoading
            ? 'bg-accent-light/70 cursor-not-allowed'
            : 'bg-accent hover:bg-accent-dark focus:ring-4 focus:ring-accent/30 transition-colors'
      }`}
    >
      <span className="relative z-10 flex items-center">
        {isLoading || isAnimating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {isAnimating ? "Choosing..." : "Loading..."}
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122">
              </path>
            </svg>
            Random Pick
          </>
        )}
      </span>
      
      {/* Add some CSS for the animation */}
      <style jsx>{`
        .background-animate {
          background-size: 400%;
          animation: AnimateBackground 2s ease infinite;
        }
        
        @keyframes AnimateBackground {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </button>
  );
}