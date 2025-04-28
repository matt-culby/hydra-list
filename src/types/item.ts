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
  description: string;
  icon: string;
}

export const categories: CategoryInfo[] = [
  {
    id: 'restaurants',
    name: 'Restaurants',
    description: 'Places to eat',
    icon: '🍽️'
  },
  {
    id: 'bars',
    name: 'Bars',
    description: 'Places to drink',
    icon: '🍸'
  },
  {
    id: 'cafes',
    name: 'Cafes & Coffee',
    description: 'Coffee shops and cafes',
    icon: '☕'
  },
  {
    id: 'movies',
    name: 'Movies',
    description: 'Films to watch',
    icon: '🎬'
  },
  {
    id: 'shows',
    name: 'Shows',
    description: 'TV shows and series',
    icon: '📺'
  },
  {
    id: 'date-ideas',
    name: 'Date Ideas',
    description: 'Fun activities for couples',
    icon: '❤️'
  }
];