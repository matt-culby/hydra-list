/**
 * Hydra List Theme Configuration
 * 
 * This file contains shared styles and theme variables that can be easily
 * swapped out to change the look and feel of the application.
 */

// Color Palette
export const colors = {
  // Primary colors
  primary: {
    light: '#818CF8',   // Indigo 400
    DEFAULT: '#4F46E5', // Indigo 600
    dark: '#3730A3',    // Indigo 800
  },
  
  // Secondary colors
  secondary: {
    light: '#7DD3FC',   // Sky 300
    DEFAULT: '#0EA5E9', // Sky 500
    dark: '#0369A1',    // Sky 700
  },
  
  // Accent colors
  accent: {
    light: '#FCD34D',   // Amber 300
    DEFAULT: '#F59E0B', // Amber 500
    dark: '#B45309',    // Amber 700
  },
  
  // Semantic colors
  success: '#10B981',   // Emerald 500
  warning: '#F97316',   // Orange 500
  error: '#EF4444',     // Red 500
  
  // Neutral colors
  background: '#F9FAFB', // Gray 50
  surface: '#FFFFFF',    // White
  border: '#E5E7EB',     // Gray 200
  
  // Text colors
  text: {
    DEFAULT: '#1F2937',  // Gray 800
    light: '#6B7280',    // Gray 500
    lighter: '#9CA3AF',  // Gray 400
    onPrimary: '#FFFFFF', // White
  },
  
  // Dark mode colors
  dark: {
    background: '#111827', // Gray 900
    surface: '#1F2937',    // Gray 800
    border: '#374151',     // Gray 700
    text: {
      DEFAULT: '#F9FAFB',  // Gray 50
      light: '#E5E7EB',    // Gray 200
      lighter: '#9CA3AF',  // Gray 400
    }
  }
};

// Button Styles
export const buttons = {
  primary: `bg-primary hover:bg-primary-dark text-white font-medium rounded-lg 
            focus:ring-4 focus:ring-primary/30 transition-colors`,
  
  secondary: `bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg 
              focus:ring-4 focus:ring-secondary/30 transition-colors`,
  
  accent: `bg-accent hover:bg-accent-dark text-white font-medium rounded-lg 
           focus:ring-4 focus:ring-accent/30 transition-colors`,
  
  outline: `bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 
            font-medium rounded-lg focus:ring-4 focus:ring-gray-200 transition-colors`,
  
  dark: `bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg 
         focus:ring-4 focus:ring-gray-700/30 transition-colors`,
};

// Card Styles
export const cards = {
  default: `bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden`,
  hover: `hover:shadow-md transition-shadow duration-200`,
  completed: `border-l-4 border-l-success`,
};

// Form Element Styles
export const forms = {
  input: `block w-full p-2.5 rounded-lg focus:ring-primary/30 focus:border-primary`,
  label: `block text-sm font-medium mb-1`,
  select: `block w-full p-2.5 rounded-lg focus:ring-primary/30 focus:border-primary`,
  checkbox: `mr-2 h-4 w-4 text-primary focus:ring-primary-light rounded`,
  
  // Dark mode variants
  darkInput: `bg-white border border-gray-600 text-gray-900 focus:ring-primary focus:border-primary`,
  darkLabel: `text-white`,
};

// Layout Styles
export const layout = {
  container: `container mx-auto px-4`,
  section: `py-6`,
  divider: `border-t border-gray-200 my-6`,
};

// Typography Styles
export const typography = {
  h1: `text-3xl font-bold`,
  h2: `text-2xl font-bold`,
  h3: `text-xl font-semibold`,
  h4: `text-lg font-semibold`,
  body: `text-base`,
  small: `text-sm`,
  tiny: `text-xs`,
};

// Animation Styles
export const animations = {
  fadeIn: `transition-opacity duration-300 ease-in-out`,
  slideIn: `transition-transform duration-300 ease-in-out`,
  pulse: `animate-pulse`,
  spin: `animate-spin`,
};

// Gradient Backgrounds
export const gradients = {
  primary: `bg-gradient-to-r from-primary to-secondary`,
  accent: `bg-gradient-to-r from-accent to-primary`,
  cool: `bg-gradient-to-r from-blue-500 to-teal-400`,
  warm: `bg-gradient-to-r from-red-500 to-yellow-400`,
};

// Export the entire theme
export default {
  colors,
  buttons,
  cards,
  forms,
  layout,
  typography,
  animations,
  gradients,
};