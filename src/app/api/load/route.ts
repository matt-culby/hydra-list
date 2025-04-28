import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/types/item';

export async function GET(request: NextRequest) {
  try {
    // Get the category from the query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    
    // Validate category
    const validCategories: Category[] = ['restaurants', 'bars', 'cafes', 'movies', 'shows', 'date-ideas'];
    if (!validCategories.includes(category as Category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    // Get the file path
    const filePath = path.join(process.cwd(), 'src', 'data', `${category}.json`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Category data not found' }, { status: 404 });
    }
    
    // Read the data from the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error loading data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}