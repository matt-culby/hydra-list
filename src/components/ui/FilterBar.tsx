'use client';

import { useState } from 'react';

interface FilterBarProps {
  onFilterChange: (filters: {
    rating?: { min: number; max: number };
    cost?: { min: number; max: number };
    date?: { start: string; end: string };
    search?: string;
  }) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(1000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    applyFilters({ search: value });
  };

  const handleRatingChange = (min: number, max: number) => {
    setMinRating(min);
    setMaxRating(max);
    applyFilters({ rating: { min, max } });
  };

  const handleCostChange = (min: number, max: number) => {
    setMinCost(min);
    setMaxCost(max);
    applyFilters({ cost: { min, max } });
  };

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      applyFilters({ date: { start, end } });
    }
  };

  const applyFilters = (newFilters: Partial<Parameters<typeof onFilterChange>[0]>) => {
    onFilterChange({
      rating: { min: minRating, max: maxRating },
      cost: { min: minCost, max: maxCost },
      ...(startDate && endDate ? { date: { start: startDate, end: endDate } } : {}),
      search: searchQuery,
      ...newFilters
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinRating(0);
    setMaxRating(5);
    setMinCost(0);
    setMaxCost(1000);
    setStartDate('');
    setEndDate('');
    onFilterChange({});
  };

  return (
    <div className="card mb-6">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-auto flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-color-text-lighter" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          <button
            type="button"
            className={`text-white font-medium rounded-lg text-sm px-4 py-2.5 flex items-center shadow-sm transition-colors ${
              isExpanded
                ? 'bg-secondary hover:bg-secondary-dark focus:ring-4 focus:ring-secondary/30'
                : 'bg-primary hover:bg-primary-dark focus:ring-4 focus:ring-primary/30'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg
              className="w-4 h-4 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M6 12h12m-9 6h6"/>
            </svg>
            <span>Filters</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
            </svg>
          </button>
          
          <button
            type="button"
            className="text-color-text bg-color-surface border border-color-border hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 transition-colors"
            onClick={clearFilters}
          >
            Clear
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-color-border bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-medium text-color-text mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                Rating
              </h3>
              <div className="flex items-center gap-4">
                <select
                  className="block p-2.5 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
                  value={minRating}
                  onChange={(e) => handleRatingChange(Number(e.target.value), maxRating)}
                >
                  {[0, 1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}★
                    </option>
                  ))}
                </select>
                <span className="text-color-text-light">to</span>
                <select
                  className="block p-2.5 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
                  value={maxRating}
                  onChange={(e) => handleRatingChange(minRating, Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}★
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Cost Filter */}
            <div>
              <h3 className="text-sm font-medium text-color-text mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cost
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-color-text-lighter">$</span>
                  <input
                    type="number"
                    className="block w-full pl-7 p-2.5 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
                    placeholder="Min"
                    min="0"
                    value={minCost}
                    onChange={(e) => handleCostChange(Number(e.target.value), maxCost)}
                  />
                </div>
                <span className="text-color-text-light">to</span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-color-text-lighter">$</span>
                  <input
                    type="number"
                    className="block w-full pl-7 p-2.5 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
                    placeholder="Max"
                    min="0"
                    value={maxCost}
                    onChange={(e) => handleCostChange(minCost, Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            {/* Date Filter */}
            <div>
              <h3 className="text-sm font-medium text-color-text mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date Experienced
              </h3>
              <div className="flex items-center gap-4">
                <input
                  type="date"
                  className="block w-full p-2.5 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
                  value={startDate}
                  onChange={(e) => handleDateChange(e.target.value, endDate)}
                />
                <span className="text-color-text-light">to</span>
                <input
                  type="date"
                  className="block w-full p-2.5 text-sm rounded-lg focus:ring-primary/30 focus:border-primary"
                  value={endDate}
                  onChange={(e) => handleDateChange(startDate, e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}