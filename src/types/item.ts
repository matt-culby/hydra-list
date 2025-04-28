export interface Item {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  externalLink: string;
  category: string;
  rating?: number; // 0-5, undefined if not rated yet
  notes?: string;
  dateExperienced?: string; // ISO date string
  cost?: number; // Estimated cost
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export type Category = 'restaurants' | 'bars' | 'cafes' | 'movies' | 'shows' | 'date-ideas';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: '🍽️'
  },
  {
    id: 'bars',
    name: 'Bars',
    icon: '🍸'
  },
  {
    id: 'cafes',
    name: 'Cafes & Coffee',
    icon: '☕'
  },
  {
    id: 'movies',
    name: 'Movies',
    icon: '🎬'
  },
  {
    id: 'shows',
    name: 'Shows',
    icon: '📺'
  },
  {
    id: 'date-ideas',
    name: 'Date Ideas',
    icon: '❤️'
  }
];