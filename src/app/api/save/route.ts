import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Category } from '@/types/item';
import { saveToSheet, isSheetsConfigured } from '@/lib/sheets-db';

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
    
    // Try to save to Google Sheets if configured
    let sheetsSaveSuccess = false;
    if (isSheetsConfigured()) {
      try {
        sheetsSaveSuccess = await saveToSheet(category, data);
        if (sheetsSaveSuccess) {
          console.log(`Saved data to Google Sheets for ${category}`);
        }
      } catch (sheetsError) {
        console.error('Error saving to Google Sheets, falling back to local files:', sheetsError);
      }
    }
    
    // Always save to local file system as backup
    console.log(`Saving data to local file for ${category}`);
    const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'src', 'data');
    const filePath = path.join(dataDir, `${category}.json`);
    
    // Ensure the directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Write the data to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: true,
      sheetsSaved: sheetsSaveSuccess
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}