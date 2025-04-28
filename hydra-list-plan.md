# Hydra List App - Implementation Plan

## Overview

Hydra List is a web application for couples to share and track experiences together. It allows users to create and manage lists of activities, rate them, and randomly select items for their next adventure.

## Features

- Multiple list categories (restaurants, travel destinations, hiking trails, movies, date night ideas)
- Item details including name, description, image, link, rating, notes, date, and cost
- Grid and list view options for browsing items
- Filtering by rating, date, and cost
- Random selection within each category
- Simple modal form for adding new items
- Support for both image URLs and direct uploads
- Local storage using JSON files (one per category)
- Docker deployment for local hosting

## Architecture

The application will be built using Next.js 15 with React 19, TypeScript, and TailwindCSS. We'll use a simple, component-based architecture with reusable components and hooks.

### Directory Structure

```
hydra-list/
├── public/
│   ├── images/         # Uploaded images
│   └── ...             # Other static assets
├── src/
│   ├── app/
│   │   ├── api/        # API routes for data operations
│   │   ├── [category]/ # Dynamic routes for each category
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Home page
│   ├── components/     # Reusable components
│   │   ├── ui/         # UI components (buttons, cards, etc.)
│   │   ├── forms/      # Form components
│   │   └── layout/     # Layout components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utility functions
│   ├── types/          # TypeScript type definitions
│   └── data/           # JSON data files
└── ...                 # Config files
```

### Data Structure

Each category will have its own JSON file with the following structure:

```typescript
// types/item.ts
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

// Example JSON structure (data/restaurants.json)
{
  "items": [
    {
      "id": "1",
      "name": "Fancy Restaurant",
      "description": "A nice place to eat",
      "imageUrl": "/images/fancy-restaurant.jpg",
      "externalLink": "https://example.com",
      "category": "restaurants",
      "rating": 4,
      "notes": "Great food but a bit pricey",
      "dateExperienced": "2025-04-15T00:00:00.000Z",
      "cost": 100,
      "createdAt": "2025-03-01T00:00:00.000Z",
      "updatedAt": "2025-04-15T00:00:00.000Z"
    },
    // More items...
  ]
}
```

## Components

### Layout Components

1. **MainLayout**: The main layout with navigation and footer
2. **CategoryLayout**: Layout for category pages with filtering options

### UI Components

1. **ItemCard**: Card component for displaying an item in grid view
2. **ItemRow**: Row component for displaying an item in list view
3. **ItemModal**: Modal for viewing item details
4. **AddItemModal**: Modal form for adding/editing items
5. **FilterBar**: Component for filtering items
6. **ViewToggle**: Toggle between grid and list views
7. **RandomButton**: Button for selecting a random item
8. **RatingStars**: Star rating component

### Page Components

1. **HomePage**: Landing page with links to categories
2. **CategoryPage**: Dynamic page for each category
3. **NotFoundPage**: 404 page

## API Routes

1. **/api/items/[category]**
   - GET: Get all items in a category
   - POST: Add a new item to a category

2. **/api/items/[category]/[id]**
   - GET: Get a specific item
   - PUT: Update an item
   - DELETE: Delete an item

3. **/api/upload**
   - POST: Upload an image

## Implementation Plan

### Phase 1: Setup and Basic Structure

1. Set up the project structure
2. Create basic layouts and navigation
3. Define TypeScript interfaces
4. Create sample JSON data files

### Phase 2: Core Functionality

1. Implement category pages with grid/list views
2. Create item cards and detail views
3. Implement filtering and sorting
4. Add random selection feature

### Phase 3: Data Management

1. Create API routes for CRUD operations
2. Implement the add/edit item modal
3. Set up image upload functionality
4. Connect UI to the API

### Phase 4: Refinement and Testing

1. Add responsive design for mobile
2. Implement colorful UI theme
3. Add loading states and error handling
4. Test all features

### Phase 5: Deployment

1. Create Docker configuration
2. Document setup and usage
3. Deploy locally

## UI Design

The UI will be colorful and user-friendly with a focus on visual appeal. We'll use a card-based design for the grid view and a more compact design for the list view.

### Color Scheme

- Primary: #3B82F6 (Blue)
- Secondary: #10B981 (Green)
- Accent: #F59E0B (Amber)
- Background: #F9FAFB (Light Gray)
- Text: #1F2937 (Dark Gray)

### Mockups

#### Home Page
```
+---------------------------------------+
|           HYDRA LIST                  |
+---------------------------------------+
|                                       |
|  +----------+  +----------+  +------+ |
|  |          |  |          |  |      | |
|  | Restaurants| | Travel   |  |Movies| |
|  |          |  |          |  |      | |
|  +----------+  +----------+  +------+ |
|                                       |
|  +----------+  +----------+           |
|  |          |  |          |           |
|  | Hiking   |  | Date     |           |
|  | Trails   |  | Ideas    |           |
|  +----------+  +----------+           |
|                                       |
+---------------------------------------+
```

#### Category Page (Grid View)
```
+---------------------------------------+
|           RESTAURANTS                 |
+---------------------------------------+
| Filter: [Rating ▼] [Date ▼] [Cost ▼] |
| View: [Grid] [List]    [Random Pick] |
+---------------------------------------+
|                                       |
| +-------+  +-------+  +-------+      |
| |       |  |       |  |       |      |
| |  Item |  |  Item |  |  Item |      |
| |   1   |  |   2   |  |   3   |      |
| |       |  |       |  |       |      |
| | ★★★☆☆ |  | ★★★★★ |  | ★★☆☆☆ |      |
| +-------+  +-------+  +-------+      |
|                                       |
| +-------+  +-------+  +-------+      |
| |       |  |       |  |       |      |
| |  Item |  |  Item |  |  Item |      |
| |   4   |  |   5   |  |   6   |      |
| |       |  |       |  |       |      |
| | ★★★★☆ |  |  N/A  |  | ★★★☆☆ |      |
| +-------+  +-------+  +-------+      |
|                                       |
| [+ Add New]                           |
+---------------------------------------+
```

#### Add/Edit Modal
```
+---------------------------------------+
|          ADD NEW ITEM                 |
+---------------------------------------+
| Name:        [                     ]  |
| Description: [                     ]  |
|              [                     ]  |
| Image:       [Upload] or [URL     ]   |
| External Link:[                    ]  |
| Category:    [Dropdown            ▼]  |
| Cost:        [                     ]  |
|                                       |
| Rating:      ☆☆☆☆☆                   |
| Notes:       [                     ]  |
|              [                     ]  |
| Date:        [Date Picker          ]  |
|                                       |
| [Cancel]                  [Save]      |
+---------------------------------------+
```

## Technical Considerations

### State Management

We'll use React's built-in state management with the Context API for global state. This will include:

1. **UIContext**: For managing UI state (grid/list view, active filters)
2. **DataContext**: For managing data operations and caching

### File Storage

For image uploads, we'll store the files in the public/images directory and reference them in the JSON data files. In a future version, this could be migrated to a proper file storage solution.

### Performance Optimization

1. Use Next.js Image component for optimized images
2. Implement pagination for large lists
3. Use memoization for expensive computations
4. Lazy load components and images

## Future Enhancements

While not part of the initial implementation, these features could be added in the future:

1. Database integration (replacing JSON files)
2. User authentication
3. Social sharing
4. Statistics and insights
5. Mobile app version
6. Backup and export functionality

## Conclusion

This implementation plan provides a comprehensive roadmap for building the Hydra List app. The architecture is designed to be simple yet flexible, allowing for easy extension and modification as requirements evolve.

The focus is on creating a user-friendly application that helps couples track and share their experiences together, with a colorful and engaging UI that makes the process enjoyable.