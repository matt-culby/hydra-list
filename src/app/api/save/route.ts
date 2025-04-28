import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/types/item';

export async function POST(request: NextRequest) {
  try {
    const { category, data } = await request.json();
    
    if (!category || !data) {
      return NextResponse.json({ error: 'Category and data are required' }, { status: 400 });
    }
    
    // Validate category
    const validCategories: Category[] = ['restaurants', 'bars', 'cafes', 'movies', 'shows', 'date-ideas'];
    if (!validCategories.includes(category as Category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }
    
    // Get the file path
    const filePath = path.join(process.cwd(), 'src', 'data', `${category}.json`);
    
    // Write the data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}